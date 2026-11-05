const STORAGE_KEY = "njs_prod_checklist_v2";
const SETTINGS_KEY = "njs_prod_settings_v2";

let deviceId = "";
try {
  deviceId = sessionStorage.getItem("njs_dev_id");
  if (!deviceId) {
    deviceId = "dev_" + Math.random().toString(36).slice(2, 9);
    sessionStorage.setItem("njs_dev_id", deviceId);
  }
} catch (e) {
  deviceId = "dev_" + Math.random().toString(36).slice(2, 9);
}

let state = {
  checked: {},
  takes: {},
  notes: {},
  hide: false,
  updatedAt: 0
};

let settings = {
  theme: "dark",
  sound: true,
  room: "natal-2027",
  user: "Director",
  role: "direction",
  dept: "all"
};

let activities = [];
let audioCtx = null;
let syncTimer = null;
let isSyncing = false;
let broadcast = null;
let mqttClient = null;
let currentPhase = "prep";
let searchIndex = [];
let activeDesktopSetup = null;

function startSlateTimecode() {
  const display = document.getElementById("tc-display");
  if (!display) return;
  function update() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");
    const ms = now.getMilliseconds();
    const frames = String(Math.floor((ms / 1000) * 24)).padStart(2, "0");
    display.textContent = `${h}:${m}:${s}:${frames}`;
    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function initAudio() {
  if (!audioCtx && typeof window !== "undefined") {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
}

function playSlateSound(isDone) {
  if (!settings.sound) return;
  try {
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(isDone ? 440 : 280, t);
    osc.frequency.exponentialRampToValueAtTime(isDone ? 880 : 180, t + 0.05);

    oscGain.gain.setValueAtTime(0.3, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(oscGain);
    oscGain.connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + 0.06);

    const bufferSize = audioCtx.sampleRate * 0.05;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.015));
    }

    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(1200, t);
    noiseFilter.Q.setValueAtTime(2.5, t);

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.4, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);

    noiseSource.start(t);
  } catch (err) {}
}

function playCelebrationConfetti() {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.5 },
      colors: ["#e5a93c", "#38b2ac", "#ededed", "#e53e3e"]
    });
  }
}

function loadLocalStorage() {
  try {
    const rawState = localStorage.getItem(STORAGE_KEY);
    if (rawState) {
      const parsed = JSON.parse(rawState);
      if (parsed && typeof parsed === "object") {
        state = {
          checked: parsed.checked || {},
          takes: parsed.takes || {},
          notes: parsed.notes || {},
          hide: !!parsed.hide,
          updatedAt: parsed.updatedAt || 0
        };
      }
    }
    const rawSettings = localStorage.getItem(SETTINGS_KEY);
    if (rawSettings) {
      const parsed = JSON.parse(rawSettings);
      if (parsed && typeof parsed === "object") {
        settings = { ...settings, ...parsed };
      }
    }
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get("room");
    if (roomParam) {
      settings.room = roomParam.trim().toLowerCase();
    }
  } catch (e) {}
}

function saveLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {}
}

function initBroadcastChannel() {
  if ("BroadcastChannel" in window) {
    try {
      if (broadcast) broadcast.close();
      broadcast = new BroadcastChannel(`njs_chan_${settings.room}`);
      broadcast.onmessage = (event) => {
        if (event.data && event.data.type === "SYNC_STATE") {
          mergeRemoteState(event.data.state, event.data.activity, false);
        }
      };
    } catch (e) {}
  }
}

function initMqttRealtime() {
  if (typeof mqtt === "undefined") return;
  try {
    if (mqttClient) {
      mqttClient.end(true);
      mqttClient = null;
    }

    setSyncStatus("syncing");
    const brokerUrl = "wss://broker.emqx.io:8084/mqtt";
    const clientId = `njs_${deviceId}_${Math.random().toString(16).slice(2, 6)}`;
    const topic = `njs/prod/${settings.room}/sync`;

    mqttClient = mqtt.connect(brokerUrl, {
      clientId,
      clean: true,
      connectTimeout: 5000,
      reconnectPeriod: 3000
    });

    mqttClient.on("connect", () => {
      setSyncStatus("synced");
      mqttClient.subscribe(topic, { qos: 1 });
      broadcastRealtimeState(null);
    });

    mqttClient.on("message", (recvTopic, msgBuffer) => {
      try {
        const payload = JSON.parse(msgBuffer.toString());
        if (!payload || payload.sender === deviceId) return;

        if (payload.fullState) {
          mergeRemoteState(payload.fullState, payload.activity, true);
        } else if (payload.mutation) {
          applyMutationLocally(payload.mutation, payload.user, payload.role);
          if (payload.log) {
            activities.unshift({
              id: Date.now() + Math.random().toString(36).slice(2, 6),
              text: payload.log,
              user: payload.user || "Crew",
              role: payload.role || "General",
              at: Date.now()
            });
            if (activities.length > 50) activities = activities.slice(0, 50);
            renderActivityFeed();
          }
          renderMain();
          updateDesktopInspector();
          showToast(`Slate synced: ${payload.user || "Crew"}`);
        }
      } catch (err) {}
    });

    mqttClient.on("error", () => setSyncStatus("offline"));
    mqttClient.on("close", () => setSyncStatus("offline"));
  } catch (e) {
    setSyncStatus("offline");
  }
}

function broadcastRealtimeState(mutation = null, log = null) {
  if (mqttClient && mqttClient.connected) {
    const topic = `njs/prod/${settings.room}/sync`;
    const payload = {
      sender: deviceId,
      room: settings.room,
      user: settings.user,
      role: settings.role,
      mutation,
      log,
      fullState: mutation ? null : state,
      activity: activities,
      at: Date.now()
    };
    mqttClient.publish(topic, JSON.stringify(payload), { qos: 1 });
  }

  if (broadcast) {
    try {
      broadcast.postMessage({
        type: "SYNC_STATE",
        state,
        activity: activities
      });
    } catch (e) {}
  }
}

function applyMutationLocally(mutation, user, role) {
  if (!mutation) return;
  if (mutation.type === "toggle") {
    if (mutation.checked) {
      state.checked[mutation.key] = {
        ticked: true,
        by: user || "Crew",
        role: role || "General",
        at: Date.now()
      };
    } else {
      delete state.checked[mutation.key];
    }
  } else if (mutation.type === "take") {
    if (!state.takes[mutation.key]) state.takes[mutation.key] = [];
    state.takes[mutation.key].push({
      takeNumber: mutation.takeNumber,
      isHero: !!mutation.isHero,
      note: mutation.note || "",
      by: user || "DOP",
      at: Date.now()
    });
  } else if (mutation.type === "note") {
    state.notes[mutation.key] = {
      text: mutation.text,
      by: user || "Director",
      at: Date.now()
    };
  } else if (mutation.type === "reset") {
    state.checked = {};
    state.takes = {};
    state.notes = {};
  } else if (mutation.type === "hide") {
    state.hide = !!mutation.hide;
  }
  state.updatedAt = Date.now();
  saveLocalStorage();
}

function makeItemId(phaseId, secKey, index) {
  return `${phaseId}.${secKey}.${index}`;
}

function parseShotCode(str) {
  const match = /^(\d\.\d+)\s+(.*)$/.exec(str);
  return match ? { code: match[1], text: match[2] } : { code: "", text: str };
}

function buildSearchIndex() {
  searchIndex = [];
  CHECKLIST_DATA.forEach((phase) => {
    phase.sections.forEach((sec) => {
      sec.items.forEach((it, idx) => {
        const itemObj = typeof it === "string" ? { text: it, dept: sec.dept || "production" } : it;
        const parsed = parseShotCode(itemObj.text);
        searchIndex.push({
          id: makeItemId(phase.id, sec.key, idx),
          phaseId: phase.id,
          phaseLabel: phase.label,
          secKey: sec.key,
          secTitle: sec.title,
          code: parsed.code,
          text: parsed.text,
          dept: itemObj.dept || sec.dept || "production"
        });
      });
    });
  });
}

function getTotalCounts() {
  let total = 0;
  let done = 0;
  CHECKLIST_DATA.forEach((phase) => {
    phase.sections.forEach((sec) => {
      sec.items.forEach((_, idx) => {
        total++;
        const itemId = makeItemId(phase.id, sec.key, idx);
        if (state.checked[itemId]) done++;
      });
    });
  });
  return { done, total };
}

function getPhaseCounts(phase) {
  let total = 0;
  let done = 0;
  phase.sections.forEach((sec) => {
    sec.items.forEach((_, idx) => {
      total++;
      const itemId = makeItemId(phase.id, sec.key, idx);
      if (state.checked[itemId]) done++;
    });
  });
  return { done, total };
}

function updateProgressUI() {
  const { done, total } = getTotalCounts();
  const pct = total ? Math.round((done / total) * 100) : 0;

  const doneEl = document.getElementById("done-count");
  const totalEl = document.getElementById("total-count");
  const fillEl = document.getElementById("bar-fill");
  const radialPct = document.getElementById("radial-pct");

  if (doneEl) doneEl.textContent = done;
  if (totalEl) totalEl.textContent = total;
  if (fillEl) fillEl.style.width = `${pct}%`;
  if (radialPct) radialPct.textContent = `${pct}% WRAPPED`;

  CHECKLIST_DATA.forEach((phase) => {
    const counts = getPhaseCounts(phase);
    const badge = document.getElementById(`tab-badge-${phase.id}`);
    if (badge) {
      const remaining = counts.total - counts.done;
      badge.textContent = remaining === 0 ? "DONE" : remaining;
      badge.classList.toggle("done", remaining === 0 && counts.total > 0);
    }
    const quickBadge = document.getElementById(`quick-badge-${phase.id}`);
    if (quickBadge) {
      const remaining = counts.total - counts.done;
      quickBadge.textContent = remaining === 0 ? "DONE" : remaining;
      quickBadge.classList.toggle("done", remaining === 0 && counts.total > 0);
    }
  });

  document.querySelectorAll(".cine-card[data-sec-key]").forEach((card) => {
    const countEl = card.querySelector(".shot-counter-pill");
    if (countEl) {
      let cardTotal = 0;
      let cardDone = 0;
      card.querySelectorAll('.shot-row input[type="checkbox"]').forEach((chk) => {
        cardTotal++;
        if (chk.checked) cardDone++;
      });
      countEl.textContent = `${cardDone}/${cardTotal}`;
      countEl.classList.toggle("full", cardDone === cardTotal && cardTotal > 0);
    }
  });
}

function renderTabs() {
  const container = document.getElementById("tabs");
  const quickNav = document.getElementById("quick-phase-nav");
  if (container) container.innerHTML = "";
  if (quickNav) quickNav.innerHTML = "";

  const phasePrefixes = {
    prep: "01",
    gear: "02",
    day: "03",
    scenes: "04",
    wrap: "05"
  };

  CHECKLIST_DATA.forEach((phase) => {
    const pNum = phasePrefixes[phase.id] || "";
    if (container) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cine-tab";
      btn.id = `tab-${phase.id}`;
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", phase.id === currentPhase ? "true" : "false");

      const label = document.createElement("span");
      label.textContent = `${pNum} ${phase.label}`;

      const badge = document.createElement("span");
      badge.className = "tab-counter";
      badge.id = `tab-badge-${phase.id}`;
      badge.textContent = "0";

      btn.appendChild(label);
      btn.appendChild(badge);
      btn.addEventListener("click", () => switchPhase(phase.id));
      container.appendChild(btn);
    }

    if (quickNav) {
      const qBtn = document.createElement("button");
      qBtn.type = "button";
      qBtn.className = `quick-phase-btn ${phase.id === currentPhase ? "active" : ""}`;
      qBtn.id = `quick-tab-${phase.id}`;

      const qLabel = document.createElement("span");
      qLabel.textContent = `${pNum} ${phase.label}`;

      const qBadge = document.createElement("span");
      qBadge.className = "tab-counter";
      qBadge.id = `quick-badge-${phase.id}`;
      qBadge.textContent = "0";

      qBtn.appendChild(qLabel);
      qBtn.appendChild(qBadge);
      qBtn.addEventListener("click", () => switchPhase(phase.id));
      quickNav.appendChild(qBtn);
    }
  });
}

function renderDeptFilters() {
  const container = document.getElementById("dept-strip");
  if (!container) return;
  container.innerHTML = "";

  const deptCodes = {
    all: "ALL",
    camera: "CAM / DOP",
    lighting: "G&E / LIGHT",
    sound: "SND / AUDIO",
    direction: "DIR / SLATE",
    art: "ART / PROPS",
    cast: "CAST",
    safety: "SAFETY",
    production: "PRODUCTION"
  };

  DEPARTMENTS.forEach((dept) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = `dept-pill ${settings.dept === dept.id ? "active" : ""}`;
    chip.setAttribute("data-dept", dept.id);
    chip.textContent = deptCodes[dept.id] || dept.label;

    chip.addEventListener("click", () => {
      settings.dept = dept.id;
      saveLocalStorage();
      document.querySelectorAll(".dept-pill").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      applyDeptFilter();
    });

    container.appendChild(chip);
  });
}

function applyDeptFilter() {
  const currentDept = settings.dept;
  document.querySelectorAll(".shot-row[data-dept]").forEach((itemEl) => {
    const itemDept = itemEl.getAttribute("data-dept");
    if (currentDept === "all" || itemDept === currentDept) {
      itemEl.style.display = "";
    } else {
      itemEl.style.display = "none";
    }
  });

  document.querySelectorAll(".cine-card[data-sec-key]").forEach((secEl) => {
    const visibleItems = secEl.querySelectorAll('.shot-row:not([style*="display: none"])');
    if (visibleItems.length === 0 && currentDept !== "all") {
      secEl.style.display = "none";
    } else {
      secEl.style.display = "";
    }
  });
}

function switchPhase(phaseId) {
  currentPhase = phaseId;
  window.location.hash = phaseId;

  document.querySelectorAll(".cine-tab").forEach((tab) => {
    const isSelected = tab.id === `tab-${phaseId}`;
    tab.setAttribute("aria-selected", isSelected ? "true" : "false");
  });

  document.querySelectorAll(".quick-phase-btn").forEach((qBtn) => {
    const isSelected = qBtn.id === `quick-tab-${phaseId}`;
    qBtn.classList.toggle("active", isSelected);
  });

  renderMain();
  if (typeof gsap !== "undefined") {
    gsap.fromTo(
      ".cine-card",
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, stagger: 0.03, duration: 0.25, ease: "power2.out" }
    );
  }
}

function selectSetupForInspector(itemId, code, title, dept) {
  activeDesktopSetup = { itemId, code, title, dept };
  document.querySelectorAll(".shot-row").forEach((r) => r.classList.remove("selected"));
  const row = document.querySelector(`.shot-row[data-item-id="${itemId}"]`);
  if (row) row.classList.add("selected");
  updateDesktopInspector();
  updateIpadDock();
}

function updateIpadDock() {
  const codeEl = document.getElementById("ipad-dock-code");
  const descEl = document.getElementById("ipad-dock-desc");
  if (!codeEl || !descEl) return;
  if (activeDesktopSetup) {
    codeEl.textContent = activeDesktopSetup.code ? `[${activeDesktopSetup.code}]` : "SHOT";
    descEl.textContent = activeDesktopSetup.title || "Selected setup";
  }
}

function updateDesktopInspector() {
  if (!activeDesktopSetup) return;

  const codeEl = document.getElementById("inspector-code");
  const titleEl = document.getElementById("inspector-title");
  const deptEl = document.getElementById("inspector-dept");
  const takesEl = document.getElementById("inspector-takes");
  const notesEl = document.getElementById("inspector-notes");
  const btnAdd = document.getElementById("inspector-btn-add");
  const btnHero = document.getElementById("inspector-btn-hero");
  const btnSave = document.getElementById("inspector-btn-save-note");

  if (codeEl) codeEl.textContent = activeDesktopSetup.code || "SHOT";
  if (titleEl) titleEl.textContent = activeDesktopSetup.title || "";
  if (deptEl) deptEl.textContent = (activeDesktopSetup.dept || "CAM").toUpperCase();

  if (btnAdd) btnAdd.disabled = false;
  if (btnHero) btnHero.disabled = false;
  if (btnSave) btnSave.disabled = false;
  if (notesEl) {
    notesEl.disabled = false;
    const noteObj = state.notes[activeDesktopSetup.itemId];
    notesEl.value = noteObj ? noteObj.text : "";
  }

  if (takesEl) {
    takesEl.innerHTML = "";
    const takes = state.takes[activeDesktopSetup.itemId] || [];
    if (takes.length === 0) {
      takesEl.innerHTML = `<div style="font-family:var(--font-mono);font-size:11px;color:var(--ink-tertiary);">No takes recorded yet. Click + LOG TAKE.</div>`;
    } else {
      takes.forEach((t, i) => {
        const pill = document.createElement("div");
        pill.className = "active-take-pill";
        pill.innerHTML = `
          <span>TAKE ${String(t.takeNumber || i + 1).padStart(2, "0")} ${t.isHero ? '<span class="take-hero-star">⭐ HERO</span>' : ''}</span>
          <span style="font-size:10px;color:var(--ink-tertiary);">${t.by || "DOP"}</span>
        `;
        takesEl.appendChild(pill);
      });
    }
  }
  updateIpadDock();
}

function renderMain() {
  const main = document.getElementById("main");
  if (!main) return;
  main.innerHTML = "";

  const phase = CHECKLIST_DATA.find((p) => p.id === currentPhase) || CHECKLIST_DATA[0];

  if (phase.preset) {
    const card = document.createElement("details");
    card.className = "cine-card";
    card.open = true;

    const summary = document.createElement("summary");
    summary.innerHTML = `
      <div class="card-title-group">
        <span class="scene-num-badge">DIT</span>
        <h2 class="card-heading">CAMERA & SENSOR CALIBRATION MATRIX</h2>
      </div>
      <div class="card-meta-right">
        <span class="shot-counter-pill full">S-LOG3 10-BIT</span>
        <svg class="chevron-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
      </div>
    `;
    card.appendChild(summary);

    const grid = document.createElement("div");
    grid.className = "dit-preset-grid";

    CAMERA_PRESET.forEach((item) => {
      const box = document.createElement("div");
      box.className = "dit-cell";
      box.innerHTML = `
        <span class="dit-key">${item.label}</span>
        <span class="dit-val">${item.value}</span>
      `;
      box.addEventListener("click", () => {
        navigator.clipboard.writeText(`${item.label}: ${item.value}`);
        showToast(`Copied ${item.label}: ${item.value}`);
      });
      grid.appendChild(box);
    });

    card.appendChild(grid);
    main.appendChild(card);
  }

  if (phase.order) {
    const card = document.createElement("details");
    card.className = "cine-card";
    card.open = true;

    const summary = document.createElement("summary");
    summary.innerHTML = `
      <div class="card-title-group">
        <span class="scene-num-badge">CALL</span>
        <h2 class="card-heading">SUGGESTED SHOOTING ORDER & SETUP SCHEDULE</h2>
      </div>
      <div class="card-meta-right">
        <span class="shot-counter-pill">${SUGGESTED_ORDER.length} SETUPS</span>
        <svg class="chevron-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
      </div>
    `;
    card.appendChild(summary);

    const list = document.createElement("ol");
    list.className = "order-timeline";

    SUGGESTED_ORDER.forEach((txt) => {
      const li = document.createElement("li");
      li.className = "order-step";
      li.innerHTML = `<span class="order-step-txt">${txt}</span>`;
      list.appendChild(li);
    });

    card.appendChild(list);
    main.appendChild(card);
  }

  phase.sections.forEach((sec) => {
    const card = document.createElement("details");
    card.className = "cine-card";
    card.open = true;
    card.setAttribute("data-sec-key", sec.key);

    const summary = document.createElement("summary");
    const titleWrap = document.createElement("div");
    titleWrap.className = "card-title-group";

    if (sec.tag) {
      const tag = document.createElement("span");
      tag.className = "scene-num-badge";
      tag.textContent = sec.tag.replace("Scene ", "SC.");
      titleWrap.appendChild(tag);
    }

    const h2 = document.createElement("h2");
    h2.className = "card-heading";
    h2.textContent = sec.title;
    titleWrap.appendChild(h2);

    summary.appendChild(titleWrap);

    const rightMeta = document.createElement("div");
    rightMeta.className = "card-meta-right";

    const cnt = document.createElement("span");
    cnt.className = "shot-counter-pill";
    cnt.textContent = "0/0";
    rightMeta.appendChild(cnt);

    const chev = document.createElement("div");
    chev.innerHTML = `<svg class="chevron-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>`;
    rightMeta.appendChild(chev.firstElementChild);

    summary.appendChild(rightMeta);
    card.appendChild(summary);

    if (sec.prep) {
      const prep = document.createElement("div");
      prep.className = "prep-slate-box";
      prep.innerHTML = `
        <span class="prep-lead">PREP SPECS</span>
        <span class="prep-details">${sec.prep}</span>
      `;
      card.appendChild(prep);
    }

    const itemList = document.createElement("div");
    itemList.className = "shot-list";

    sec.items.forEach((it, idx) => {
      const itemObj = typeof it === "string" ? { text: it, dept: sec.dept || "production" } : it;
      const parsed = parseShotCode(itemObj.text);
      const itemId = makeItemId(phase.id, sec.key, idx);
      const isChecked = !!state.checked[itemId];
      const dept = itemObj.dept || sec.dept || "production";
      const isSelected = activeDesktopSetup && activeDesktopSetup.itemId === itemId;

      const row = document.createElement("label");
      row.className = `shot-row ${parsed.code ? "has-code" : ""} ${isChecked ? "done" : ""} ${isSelected ? "selected" : ""}`;
      row.setAttribute("data-item-id", itemId);
      row.setAttribute("data-dept", dept);

      row.addEventListener("click", () => {
        selectSetupForInspector(itemId, parsed.code || sec.title, parsed.text, dept);
      });

      const chk = document.createElement("input");
      chk.type = "checkbox";
      chk.checked = isChecked;
      chk.setAttribute("data-id", itemId);
      chk.setAttribute("data-text", parsed.text);
      chk.setAttribute("data-code", parsed.code);
      chk.setAttribute("data-phase", phase.id);

      const box = document.createElement("span");
      box.className = "tally-box";
      box.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>`;

      row.appendChild(chk);
      row.appendChild(box);

      if (parsed.code) {
        const codeEl = document.createElement("span");
        codeEl.className = "shot-code-tag";
        codeEl.textContent = parsed.code;
        row.appendChild(codeEl);
      }

      const content = document.createElement("div");
      content.className = "shot-body";

      const txt = document.createElement("span");
      txt.className = "shot-text";
      txt.textContent = parsed.text;
      content.appendChild(txt);

      const badges = document.createElement("div");
      badges.className = "shot-tags";

      const deptBadge = document.createElement("span");
      deptBadge.className = "tag-badge";
      deptBadge.textContent = dept.toUpperCase();
      badges.appendChild(deptBadge);

      const takes = state.takes[itemId];
      if (takes && takes.length > 0) {
        const takeBadge = document.createElement("span");
        takeBadge.className = "tag-badge take";
        const hasHero = takes.some((t) => t.isHero);
        takeBadge.textContent = `${takes.length} ${takes.length === 1 ? "TAKE" : "TAKES"} ${hasHero ? "⭐ HERO" : ""}`;
        badges.appendChild(takeBadge);
      }

      const note = state.notes[itemId];
      if (note && note.text) {
        const noteBadge = document.createElement("span");
        noteBadge.className = "tag-badge note";
        noteBadge.textContent = `NOTE: ${note.text.slice(0, 24)}${note.text.length > 24 ? "..." : ""}`;
        badges.appendChild(noteBadge);
      }

      content.appendChild(badges);
      row.appendChild(content);

      const actions = document.createElement("div");
      actions.className = "shot-tools";

      const takeBtn = document.createElement("button");
      takeBtn.type = "button";
      takeBtn.className = "btn-shot-action";
      takeBtn.title = "Clapper Slate / Log Take";
      takeBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`;
      takeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openTakeModal(itemId, parsed.code || sec.title, parsed.text);
      });

      actions.appendChild(takeBtn);
      row.appendChild(actions);

      itemList.appendChild(row);
    });

    card.appendChild(itemList);
    main.appendChild(card);
  });

  applyDeptFilter();
  updateProgressUI();
}

function handleCheckboxChange(target) {
  const itemId = target.getAttribute("data-id");
  const isChecked = target.checked;
  const itemText = target.getAttribute("data-text") || "";
  const itemCode = target.getAttribute("data-code") || "";
  const label = target.closest(".shot-row");

  if (isChecked) {
    state.checked[itemId] = {
      ticked: true,
      by: settings.user,
      role: settings.role,
      at: Date.now()
    };
    if (label) label.classList.add("done");
  } else {
    delete state.checked[itemId];
    if (label) label.classList.remove("done");
  }

  state.updatedAt = Date.now();
  playSlateSound(isChecked);

  if (typeof gsap !== "undefined" && isChecked) {
    const box = label.querySelector(".tally-box");
    if (box) {
      gsap.fromTo(
        box,
        { scale: 0.8 },
        { scale: 1, duration: 0.25, ease: "back.out(2)" }
      );
    }
  }

  saveLocalStorage();
  updateProgressUI();
  updateDesktopInspector();

  const logText = `${settings.user} (${settings.role.toUpperCase()}) ${isChecked ? "TICKED" : "UNMARKED"} ${itemCode ? `[${itemCode}] ` : ""}${itemText}`;
  const mutation = {
    type: "toggle",
    key: itemId,
    checked: isChecked
  };

  broadcastRealtimeState(mutation, logText);
  syncWithBackend(mutation, logText);

  const { done, total } = getTotalCounts();
  if (done === total && total > 0 && isChecked) {
    playCelebrationConfetti();
    showToast("FILM 100% WRAPPED! Production complete!", "success");
  }
}

async function syncWithBackend(mutation = null, log = null) {
  if (isSyncing) return;
  isSyncing = true;

  try {
    const payload = {
      room: settings.room,
      user: settings.user,
      role: settings.role,
      mutation: mutation ? { ...mutation, log } : null,
      fullState: mutation ? null : state
    };

    const res = await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.data) {
        mergeRemoteState(data.data, data.activity, false);
      }
    }
  } catch (err) {
  } finally {
    isSyncing = false;
  }
}

async function fetchRemoteState() {
  try {
    const res = await fetch(`/api/sync?room=${encodeURIComponent(settings.room)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.data) {
        mergeRemoteState(data.data, data.activity, true);
      }
    }
  } catch (err) {}
}

function mergeRemoteState(remoteData, remoteActivities, shouldRerender = false) {
  if (!remoteData) return;

  let hasChanged = false;

  if (remoteData.updatedAt && remoteData.updatedAt > (state.updatedAt || 0)) {
    state.checked = remoteData.checked || {};
    state.takes = remoteData.takes || {};
    state.notes = remoteData.notes || {};
    state.hide = !!remoteData.hide;
    state.updatedAt = remoteData.updatedAt;
    hasChanged = true;
  } else {
    for (const key in remoteData.checked) {
      if (!state.checked[key]) {
        state.checked[key] = remoteData.checked[key];
        hasChanged = true;
      }
    }
    for (const key in remoteData.takes) {
      if (!state.takes[key] || remoteData.takes[key].length > state.takes[key].length) {
        state.takes[key] = remoteData.takes[key];
        hasChanged = true;
      }
    }
    for (const key in remoteData.notes) {
      if (!state.notes[key] || (remoteData.notes[key].at || 0) > (state.notes[key].at || 0)) {
        state.notes[key] = remoteData.notes[key];
        hasChanged = true;
      }
    }
  }

  if (remoteActivities && Array.isArray(remoteActivities)) {
    activities = remoteActivities;
    renderActivityFeed();
  }

  if (hasChanged || shouldRerender) {
    saveLocalStorage();
    renderMain();
    updateDesktopInspector();
  }
}

function setSyncStatus(status) {
  const tally = document.getElementById("tally-status");
  const tallyText = document.getElementById("tally-text");
  const syncLabel = document.getElementById("sync-btn-label");
  if (!tally || !tallyText) return;

  if (status === "synced") {
    tally.className = "tally-badge live";
    tallyText.textContent = "REC SYNC";
    if (syncLabel) syncLabel.textContent = `FREQ: ${settings.room.toUpperCase()}`;
  } else if (status === "syncing") {
    tally.className = "tally-badge";
    tallyText.textContent = "LINKING";
    if (syncLabel) syncLabel.textContent = "CONNECTING...";
  } else {
    tally.className = "tally-badge";
    tallyText.textContent = "STANDBY";
    if (syncLabel) syncLabel.textContent = "LOCAL OFFLINE";
  }
}

function showToast(msg, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;flex-shrink:0;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    <span>${msg}</span>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 250);
  }, 3000);
}

function renderDesktopQr() {
  const qrBox = document.getElementById("desktop-qr-box");
  if (!qrBox || typeof QRCode === "undefined") return;
  qrBox.innerHTML = "";
  const fullShareUrl = `${window.location.origin}${window.location.pathname}?room=${encodeURIComponent(settings.room)}`;
  new QRCode(qrBox, {
    text: fullShareUrl,
    width: 124,
    height: 124,
    colorDark: "#0B0D0F",
    colorLight: "#FFFFFF",
    correctLevel: QRCode.CorrectLevel.M
  });
}

function openSyncModal() {
  const modal = document.getElementById("sync-modal");
  if (!modal) return;

  const roomInput = document.getElementById("sync-room-input");
  const userInput = document.getElementById("sync-user-input");
  const roleSelect = document.getElementById("sync-role-select");
  const shareLinkInput = document.getElementById("sync-share-link");

  if (roomInput) roomInput.value = settings.room;
  if (userInput) userInput.value = settings.user;
  if (roleSelect) roleSelect.value = settings.role;

  const fullShareUrl = `${window.location.origin}${window.location.pathname}?room=${encodeURIComponent(settings.room)}`;
  if (shareLinkInput) shareLinkInput.value = fullShareUrl;

  const qrBox = document.getElementById("sync-qr-box");
  if (qrBox && typeof QRCode !== "undefined") {
    qrBox.innerHTML = "";
    new QRCode(qrBox, {
      text: fullShareUrl,
      width: 160,
      height: 160,
      colorDark: "#0B0D0F",
      colorLight: "#FFFFFF",
      correctLevel: QRCode.CorrectLevel.M
    });
  }

  modal.classList.add("open");
}

function closeSyncModal() {
  const modal = document.getElementById("sync-modal");
  if (modal) modal.classList.remove("open");
}

function saveSyncModal() {
  const roomInput = document.getElementById("sync-room-input");
  const userInput = document.getElementById("sync-user-input");
  const roleSelect = document.getElementById("sync-role-select");

  if (roomInput && roomInput.value.trim()) {
    const newRoom = roomInput.value.trim().toLowerCase();
    if (newRoom !== settings.room) {
      settings.room = newRoom;
      initBroadcastChannel();
      initMqttRealtime();
      renderDesktopQr();
      fetchRemoteState();
    }
  }
  if (userInput && userInput.value.trim()) {
    settings.user = userInput.value.trim();
  }
  if (roleSelect) {
    settings.role = roleSelect.value;
  }

  saveLocalStorage();
  closeSyncModal();
  showToast(`Frequency locked: ${settings.room.toUpperCase()}`, "success");
}

let activeTakeItemId = null;

function openTakeModal(itemId, title, desc) {
  activeTakeItemId = itemId;
  const modal = document.getElementById("take-modal");
  if (!modal) return;

  const titleEl = document.getElementById("take-modal-title");
  const descEl = document.getElementById("take-modal-desc");
  const noteInput = document.getElementById("take-modal-note");

  if (titleEl) titleEl.textContent = `SLATE : ${title}`;
  if (descEl) descEl.textContent = desc;

  const noteObj = state.notes[itemId];
  if (noteInput) noteInput.value = noteObj ? noteObj.text : "";

  renderTakesInModal(itemId);
  modal.classList.add("open");
}

function renderTakesInModal(itemId) {
  const takeList = document.getElementById("take-modal-list");
  if (!takeList) return;
  takeList.innerHTML = "";

  const takes = state.takes[itemId] || [];
  if (takes.length === 0) {
    takeList.innerHTML = `<div style="color:var(--ink-tertiary);font-family:var(--font-mono);font-size:11px;padding:6px 0;">NO CONTINUITY TAKES LOGGED FOR THIS SETUP.</div>`;
    return;
  }

  takes.forEach((t, i) => {
    const row = document.createElement("div");
    row.style.cssText = "display:flex;align-items:center;justify-content:space-between;padding:6px 10px;background:var(--bg-slate);border-radius:var(--radius-sharp);border:1px solid var(--line-hair);font-family:var(--font-mono);font-size:12px;";
    row.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-weight:700;color:${t.isHero ? "var(--cine-amber)" : "var(--ink-primary)"}">TAKE ${String(t.takeNumber || i + 1).padStart(2, "0")} ${t.isHero ? "⭐ HERO" : ""}</span>
        <span style="font-size:10px;color:var(--ink-tertiary);">${t.by || "DOP"}</span>
      </div>
      <button type="button" class="btn-engraved" style="padding:2px 6px;font-size:9px;" data-take-idx="${i}">DISCARD</button>
    `;
    row.querySelector("button").addEventListener("click", () => {
      takes.splice(i, 1);
      state.takes[itemId] = takes;
      state.updatedAt = Date.now();
      saveLocalStorage();
      renderTakesInModal(itemId);
      renderMain();
      updateDesktopInspector();

      const mutation = {
        type: "take",
        key: itemId,
        takes
      };
      broadcastRealtimeState(mutation, `${settings.user} deleted take`);
      syncWithBackend(mutation);
    });
    takeList.appendChild(row);
  });
}

function closeTakeModal() {
  const modal = document.getElementById("take-modal");
  if (modal) modal.classList.remove("open");
}

function logNewTake(isHero = false) {
  const targetId = activeTakeItemId || (activeDesktopSetup && activeDesktopSetup.itemId);
  if (!targetId) return;
  if (!state.takes[targetId]) state.takes[targetId] = [];

  const takes = state.takes[targetId];
  const nextNum = takes.length + 1;
  const newTake = {
    takeNumber: nextNum,
    isHero,
    by: settings.user,
    at: Date.now()
  };

  takes.push(newTake);
  state.updatedAt = Date.now();
  saveLocalStorage();
  if (activeTakeItemId) renderTakesInModal(activeTakeItemId);
  renderMain();
  updateDesktopInspector();

  const logText = `${settings.user} logged TAKE ${String(nextNum).padStart(2, "0")} ${isHero ? "⭐ HERO" : ""}`;
  const mutation = {
    type: "take",
    key: targetId,
    takeNumber: nextNum,
    isHero
  };

  broadcastRealtimeState(mutation, logText);
  syncWithBackend(mutation, logText);
  showToast(`TAKE ${String(nextNum).padStart(2, "0")} RECORDED`, "success");
}

function saveShotNote() {
  const targetId = activeTakeItemId || (activeDesktopSetup && activeDesktopSetup.itemId);
  if (!targetId) return;

  const noteInput = document.getElementById("take-modal-note");
  const desktopNoteInput = document.getElementById("inspector-notes");
  const text = (noteInput && noteInput.value.trim()) || (desktopNoteInput && desktopNoteInput.value.trim()) || "";

  if (text) {
    state.notes[targetId] = {
      text,
      by: settings.user,
      at: Date.now()
    };
  } else {
    delete state.notes[targetId];
  }

  state.updatedAt = Date.now();
  saveLocalStorage();
  renderMain();
  updateDesktopInspector();
  if (activeTakeItemId) closeTakeModal();

  const logText = `${settings.user} updated DIT note`;
  const mutation = {
    type: "note",
    key: targetId,
    text
  };

  broadcastRealtimeState(mutation, logText);
  syncWithBackend(mutation, logText);
  showToast("DIT note recorded", "success");
}

function openSearchModal() {
  const modal = document.getElementById("search-modal");
  const input = document.getElementById("search-input");
  if (!modal || !input) return;

  input.value = "";
  renderSearchResults("");
  modal.classList.add("open");
  requestAnimationFrame(() => input.focus());
}

function closeSearchModal() {
  const modal = document.getElementById("search-modal");
  if (modal) modal.classList.remove("open");
}

function renderSearchResults(query) {
  const container = document.getElementById("search-results");
  if (!container) return;
  container.innerHTML = "";

  const q = query.trim().toLowerCase();
  const results = q ? searchIndex.filter((it) => it.text.toLowerCase().includes(q) || it.code.toLowerCase().includes(q) || it.secTitle.toLowerCase().includes(q) || it.dept.toLowerCase().includes(q)) : searchIndex.slice(0, 25);

  if (results.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:24px;color:var(--ink-tertiary);font-family:var(--font-mono);font-size:12px;">NO CUES MATCHING "${query}"</div>`;
    return;
  }

  results.forEach((r, idx) => {
    const item = document.createElement("div");
    item.className = `search-result-row ${idx === 0 ? "highlighted" : ""}`;
    item.innerHTML = `
      <span class="search-res-phase">${r.phaseLabel}</span>
      ${r.code ? `<span class="search-res-code">[${r.code}]</span>` : ""}
      <span class="search-res-text">${r.text}</span>
      <span class="tag-badge">${r.dept.toUpperCase()}</span>
    `;

    item.addEventListener("click", () => {
      closeSearchModal();
      switchPhase(r.phaseId);
      setTimeout(() => {
        const targetEl = document.querySelector(`.shot-row[data-item-id="${r.id}"]`);
        if (targetEl) {
          const parentSec = targetEl.closest(".cine-card");
          if (parentSec) parentSec.open = true;
          selectSetupForInspector(r.id, r.code, r.text, r.dept);
          targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
          if (typeof gsap !== "undefined") {
            gsap.fromTo(
              targetEl,
              { backgroundColor: "var(--cine-amber-glow)" },
              { backgroundColor: "", duration: 1.2 }
            );
          }
        }
      }, 120);
    });

    container.appendChild(item);
  });
}

function toggleActivityDrawer() {
  const drawer = document.getElementById("activity-drawer");
  if (drawer) {
    drawer.classList.toggle("open");
  }
}

function renderActivityFeed() {
  const container = document.getElementById("activity-list");
  const desktopContainer = document.getElementById("desktop-activity-list");
  if (!container && !desktopContainer) return;

  const content = activities.length === 0 ? `<div style="text-align:center;padding:16px;color:var(--ink-tertiary);font-family:var(--font-mono);font-size:11px;">STANDBY : NO SLATE ACTIVITY RECORDED.</div>` : "";

  if (container) {
    if (content) {
      container.innerHTML = content;
    } else {
      container.innerHTML = "";
      activities.forEach((act) => {
        const card = document.createElement("div");
        card.className = "activity-strip-item";
        const dateStr = new Date(act.at || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        card.innerHTML = `
          <div class="activity-strip-head">
            <span class="activity-strip-user">${act.user} (${(act.role || "CREW").toUpperCase()})</span>
            <span>${dateStr}</span>
          </div>
          <div class="activity-strip-text">${act.text}</div>
        `;
        container.appendChild(card);
      });
    }
  }

  if (desktopContainer) {
    if (content) {
      desktopContainer.innerHTML = content;
    } else {
      desktopContainer.innerHTML = "";
      activities.slice(0, 15).forEach((act) => {
        const card = document.createElement("div");
        card.className = "activity-strip-item";
        const dateStr = new Date(act.at || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        card.innerHTML = `
          <div class="activity-strip-head">
            <span class="activity-strip-user">${act.user}</span>
            <span>${dateStr}</span>
          </div>
          <div class="activity-strip-text">${act.text}</div>
        `;
        desktopContainer.appendChild(card);
      });
    }
  }
}

function applyTheme(theme) {
  settings.theme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  saveLocalStorage();
}

function toggleFullscreenMode() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
    document.body.classList.add("fullscreen-mode");
    showToast("FULLSCREEN VIDEO VILLAGE ENGAGED");
  } else {
    document.exitFullscreen().catch(() => {});
    document.body.classList.remove("fullscreen-mode");
  }
}

function initEventHandlers() {
  const main = document.getElementById("main");
  if (main) {
    main.addEventListener("change", (e) => {
      const target = e.target;
      if (target && target.type === "checkbox") {
        handleCheckboxChange(target);
      }
    });
  }

  const hideBtn = document.getElementById("btn-hide-done");
  if (hideBtn) {
    hideBtn.setAttribute("aria-pressed", state.hide ? "true" : "false");
    if (main) main.classList.toggle("hide-done", state.hide);

    hideBtn.addEventListener("click", () => {
      state.hide = !state.hide;
      hideBtn.setAttribute("aria-pressed", state.hide ? "true" : "false");
      if (main) main.classList.toggle("hide-done", state.hide);
      saveLocalStorage();
      broadcastRealtimeState({ type: "hide", hide: state.hide });
      syncWithBackend({ type: "hide", hide: state.hide });
    });
  }

  const soundBtn = document.getElementById("btn-sound-toggle");
  if (soundBtn) {
    soundBtn.classList.toggle("active", settings.sound);
    soundBtn.addEventListener("click", () => {
      settings.sound = !settings.sound;
      soundBtn.classList.toggle("active", settings.sound);
      saveLocalStorage();
      showToast(settings.sound ? "SLATE AUDIO ENGAGED" : "SLATE AUDIO MUTED");
    });
  }

  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      applyTheme(settings.theme === "dark" ? "light" : "dark");
    });
  }

  const fullBtn = document.getElementById("btn-fullscreen");
  if (fullBtn) {
    fullBtn.addEventListener("click", toggleFullscreenMode);
  }

  const searchTrigger = document.getElementById("search-trigger");
  if (searchTrigger) {
    searchTrigger.addEventListener("click", openSearchModal);
  }

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderSearchResults(e.target.value);
    });
  }

  const syncTrigger = document.getElementById("btn-sync-modal");
  if (syncTrigger) {
    syncTrigger.addEventListener("click", openSyncModal);
  }

  const syncSaveBtn = document.getElementById("sync-modal-save");
  if (syncSaveBtn) {
    syncSaveBtn.addEventListener("click", saveSyncModal);
  }

  const syncCloseBtn = document.getElementById("sync-modal-close");
  if (syncCloseBtn) {
    syncCloseBtn.addEventListener("click", closeSyncModal);
  }

  const copyShareBtn = document.getElementById("sync-copy-btn");
  if (copyShareBtn) {
    copyShareBtn.addEventListener("click", () => {
      const shareInput = document.getElementById("sync-share-link");
      if (shareInput) {
        shareInput.select();
        navigator.clipboard.writeText(shareInput.value);
        showToast("SLATE FREQUENCY COPIED", "success");
      }
    });
  }

  const takeCloseBtn = document.getElementById("take-modal-close");
  if (takeCloseBtn) {
    takeCloseBtn.addEventListener("click", closeTakeModal);
  }

  const takeAddBtn = document.getElementById("take-modal-add");
  if (takeAddBtn) {
    takeAddBtn.addEventListener("click", () => logNewTake(false));
  }

  const takeAddHeroBtn = document.getElementById("take-modal-add-hero");
  if (takeAddHeroBtn) {
    takeAddHeroBtn.addEventListener("click", () => logNewTake(true));
  }

  const takeSaveNoteBtn = document.getElementById("take-modal-save-note");
  if (takeSaveNoteBtn) {
    takeSaveNoteBtn.addEventListener("click", saveShotNote);
  }

  const inspAdd = document.getElementById("inspector-btn-add");
  if (inspAdd) {
    inspAdd.addEventListener("click", () => logNewTake(false));
  }

  const inspHero = document.getElementById("inspector-btn-hero");
  if (inspHero) {
    inspHero.addEventListener("click", () => logNewTake(true));
  }

  const inspSave = document.getElementById("inspector-btn-save-note");
  if (inspSave) {
    inspSave.addEventListener("click", saveShotNote);
  }

  const ipadAdd = document.getElementById("ipad-btn-add-take");
  if (ipadAdd) {
    ipadAdd.addEventListener("click", () => logNewTake(false));
  }

  const ipadHero = document.getElementById("ipad-btn-hero-take");
  if (ipadHero) {
    ipadHero.addEventListener("click", () => logNewTake(true));
  }

  const ipadOpen = document.getElementById("ipad-btn-open-take");
  if (ipadOpen) {
    ipadOpen.addEventListener("click", () => {
      if (activeDesktopSetup) {
        openTakeModal(activeDesktopSetup.itemId, activeDesktopSetup.code || "SHOT", activeDesktopSetup.title || "");
      }
    });
  }

  const actTrigger = document.getElementById("btn-activity-drawer");
  if (actTrigger) {
    actTrigger.addEventListener("click", toggleActivityDrawer);
  }

  const actClose = document.getElementById("activity-drawer-close");
  if (actClose) {
    actClose.addEventListener("click", toggleActivityDrawer);
  }

  const resetBtn = document.getElementById("btn-reset");
  if (resetBtn) {
    let armed = false;
    let timer = null;
    resetBtn.addEventListener("click", () => {
      if (!armed) {
        armed = true;
        resetBtn.textContent = "CONFIRM CLEAR ALL?";
        resetBtn.style.color = "var(--tally-red)";
        showToast("TAP AGAIN WITHIN 4s TO CONFIRM RESET", "warn");
        timer = setTimeout(() => {
          armed = false;
          resetBtn.textContent = "CLEAR TICKS";
          resetBtn.style.color = "";
        }, 4000);
        return;
      }
      clearTimeout(timer);
      armed = false;
      resetBtn.textContent = "CLEAR TICKS";
      resetBtn.style.color = "";

      state.checked = {};
      state.takes = {};
      state.notes = {};
      state.updatedAt = Date.now();
      saveLocalStorage();
      renderMain();
      updateDesktopInspector();

      const logText = `${settings.user} cleared all slate ticks`;
      broadcastRealtimeState({ type: "reset" }, logText);
      syncWithBackend({ type: "reset" }, logText);
      showToast("ALL TICKS RESET");
    });
  }

  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      openSearchModal();
    }
    if (e.key === "Escape") {
      closeSearchModal();
      closeSyncModal();
      closeTakeModal();
      const drawer = document.getElementById("activity-drawer");
      if (drawer) drawer.classList.remove("open");
    }
  });

  window.addEventListener("hashchange", () => {
    const hash = window.location.hash.replace("#", "");
    if (CHECKLIST_DATA.some((p) => p.id === hash)) {
      switchPhase(hash);
    }
  });

  document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove("open");
      }
    });
  });
}

function startSyncLoop() {
  fetchRemoteState();
  if (syncTimer) clearInterval(syncTimer);
  syncTimer = setInterval(() => {
    if (document.visibilityState === "visible") {
      fetchRemoteState();
    }
  }, 4500);
}

function initApp() {
  loadLocalStorage();
  applyTheme(settings.theme);
  startSlateTimecode();
  initBroadcastChannel();
  initMqttRealtime();
  renderDesktopQr();
  buildSearchIndex();

  const hash = window.location.hash.replace("#", "");
  if (CHECKLIST_DATA.some((p) => p.id === hash)) {
    currentPhase = hash;
  }

  renderTabs();
  renderDeptFilters();
  renderMain();

  const firstScene = CHECKLIST_DATA.find((p) => p.id === "scenes");
  if (firstScene && firstScene.sections && firstScene.sections[0] && firstScene.sections[0].items[0]) {
    const it = firstScene.sections[0].items[0];
    const parsed = parseShotCode(typeof it === "string" ? it : it.text);
    selectSetupForInspector(makeItemId("scenes", firstScene.sections[0].key, 0), parsed.code || "1.1", parsed.text, "camera");
  }

  initEventHandlers();
  startSyncLoop();
}

window.addEventListener("DOMContentLoaded", initApp);
