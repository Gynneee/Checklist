const STORAGE_KEY = "njs_prod_checklist_v2";
const SETTINGS_KEY = "njs_prod_settings_v2";

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
let currentPhase = "prep";
let searchIndex = [];

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

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(isDone ? 620 : 340, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(isDone ? 880 : 220, audioCtx.currentTime + 0.08);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(750, audioCtx.currentTime);
    filter.Q.setValueAtTime(3.0, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.12);

    const bufferSize = audioCtx.sampleRate * 0.04;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
    whiteNoise.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    whiteNoise.start();
  } catch (err) {}
}

function playCelebrationConfetti() {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#f0883e", "#58a6ff", "#3fb950", "#ffffff"]
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
      broadcast = new BroadcastChannel(`njs_channel_${settings.room}`);
      broadcast.onmessage = (event) => {
        if (event.data && event.data.type === "SYNC_STATE") {
          mergeRemoteState(event.data.state, event.data.activity, false);
        }
      };
    } catch (e) {}
  }
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
  const radialMeter = document.getElementById("radial-meter");
  const radialPct = document.getElementById("radial-pct");

  if (doneEl) doneEl.textContent = done;
  if (totalEl) totalEl.textContent = total;
  if (fillEl) fillEl.style.width = `${pct}%`;
  if (radialPct) radialPct.textContent = `${pct}%`;

  if (radialMeter) {
    const circumference = 2 * Math.PI * 16;
    const offset = circumference - (pct / 100) * circumference;
    radialMeter.style.strokeDashoffset = offset;
  }

  CHECKLIST_DATA.forEach((phase) => {
    const counts = getPhaseCounts(phase);
    const badge = document.getElementById(`tab-badge-${phase.id}`);
    if (badge) {
      const remaining = counts.total - counts.done;
      badge.textContent = remaining === 0 ? "done" : remaining;
      badge.classList.toggle("done", remaining === 0 && counts.total > 0);
    }
  });

  document.querySelectorAll(".sec[data-sec-key]").forEach((card) => {
    const secKey = card.getAttribute("data-sec-key");
    const countEl = card.querySelector(".sec-cnt");
    if (countEl) {
      let cardTotal = 0;
      let cardDone = 0;
      card.querySelectorAll('.item input[type="checkbox"]').forEach((chk) => {
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
  if (!container) return;
  container.innerHTML = "";

  CHECKLIST_DATA.forEach((phase) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tab";
    btn.id = `tab-${phase.id}`;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", phase.id === currentPhase ? "true" : "false");

    const label = document.createElement("span");
    label.textContent = phase.label;

    const badge = document.createElement("span");
    badge.className = "tab-badge";
    badge.id = `tab-badge-${phase.id}`;
    badge.textContent = "0";

    btn.appendChild(label);
    btn.appendChild(badge);

    btn.addEventListener("click", () => {
      switchPhase(phase.id);
    });

    container.appendChild(btn);
  });
}

function renderDeptFilters() {
  const container = document.getElementById("dept-strip");
  if (!container) return;
  container.innerHTML = "";

  DEPARTMENTS.forEach((dept) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = `chip ${settings.dept === dept.id ? "active" : ""}`;
    chip.setAttribute("data-dept", dept.id);

    chip.innerHTML = `<span>${dept.label}</span>`;
    chip.addEventListener("click", () => {
      settings.dept = dept.id;
      saveLocalStorage();
      document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      applyDeptFilter();
    });

    container.appendChild(chip);
  });
}

function applyDeptFilter() {
  const currentDept = settings.dept;
  document.querySelectorAll(".item[data-dept]").forEach((itemEl) => {
    const itemDept = itemEl.getAttribute("data-dept");
    if (currentDept === "all" || itemDept === currentDept) {
      itemEl.style.display = "";
    } else {
      itemEl.style.display = "none";
    }
  });

  document.querySelectorAll(".sec[data-sec-key]").forEach((secEl) => {
    const visibleItems = secEl.querySelectorAll('.item:not([style*="display: none"])');
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

  document.querySelectorAll(".tab").forEach((tab) => {
    const isSelected = tab.id === `tab-${phaseId}`;
    tab.setAttribute("aria-selected", isSelected ? "true" : "false");
  });

  renderMain();
  if (typeof gsap !== "undefined") {
    gsap.fromTo(
      ".sec",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, stagger: 0.04, duration: 0.35, ease: "power2.out" }
    );
  }
}

function renderMain() {
  const main = document.getElementById("main");
  if (!main) return;
  main.innerHTML = "";

  const phase = CHECKLIST_DATA.find((p) => p.id === currentPhase) || CHECKLIST_DATA[0];

  if (phase.preset) {
    const card = document.createElement("details");
    card.className = "sec";
    card.open = true;

    const summary = document.createElement("summary");
    summary.innerHTML = `
      <div class="sec-title-wrap">
        <h2>Camera preset reference</h2>
      </div>
      <svg class="chev-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
    `;
    card.appendChild(summary);

    const grid = document.createElement("div");
    grid.className = "preset-grid";

    CAMERA_PRESET.forEach((item) => {
      const box = document.createElement("div");
      box.className = "preset-card";
      box.innerHTML = `
        <span class="preset-key">${item.label}</span>
        <span class="preset-val">${item.value}</span>
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
    card.className = "sec";
    card.open = true;

    const summary = document.createElement("summary");
    summary.innerHTML = `
      <div class="sec-title-wrap">
        <h2>Suggested shooting order</h2>
      </div>
      <svg class="chev-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
    `;
    card.appendChild(summary);

    const list = document.createElement("ol");
    list.className = "order-list";

    SUGGESTED_ORDER.forEach((txt) => {
      const li = document.createElement("li");
      li.className = "order-item";
      li.innerHTML = `<span class="order-text">${txt}</span>`;
      list.appendChild(li);
    });

    card.appendChild(list);
    main.appendChild(card);
  }

  phase.sections.forEach((sec) => {
    const card = document.createElement("details");
    card.className = "sec";
    card.open = true;
    card.setAttribute("data-sec-key", sec.key);

    const summary = document.createElement("summary");
    const titleWrap = document.createElement("div");
    titleWrap.className = "sec-title-wrap";

    if (sec.tag) {
      const tag = document.createElement("span");
      tag.className = "sc-tag";
      tag.textContent = sec.tag;
      titleWrap.appendChild(tag);
    }

    const h2 = document.createElement("h2");
    h2.textContent = sec.title;
    titleWrap.appendChild(h2);

    summary.appendChild(titleWrap);

    const cnt = document.createElement("span");
    cnt.className = "sec-cnt";
    cnt.textContent = "0/0";
    summary.appendChild(cnt);

    const chev = document.createElement("div");
    chev.innerHTML = `<svg class="chev-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>`;
    summary.appendChild(chev.firstElementChild);

    card.appendChild(summary);

    if (sec.prep) {
      const prep = document.createElement("div");
      prep.className = "prep-box";
      prep.innerHTML = `
        <span class="prep-tag">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Prep
        </span>
        <span class="prep-text">${sec.prep}</span>
      `;
      card.appendChild(prep);
    }

    const itemList = document.createElement("div");
    itemList.className = "item-list";

    sec.items.forEach((it, idx) => {
      const itemObj = typeof it === "string" ? { text: it, dept: sec.dept || "production" } : it;
      const parsed = parseShotCode(itemObj.text);
      const itemId = makeItemId(phase.id, sec.key, idx);
      const isChecked = !!state.checked[itemId];
      const dept = itemObj.dept || sec.dept || "production";

      const row = document.createElement("label");
      row.className = `item ${parsed.code ? "has-code" : ""} ${isChecked ? "done" : ""}`;
      row.setAttribute("data-item-id", itemId);
      row.setAttribute("data-dept", dept);

      const chk = document.createElement("input");
      chk.type = "checkbox";
      chk.checked = isChecked;
      chk.setAttribute("data-id", itemId);
      chk.setAttribute("data-text", parsed.text);
      chk.setAttribute("data-code", parsed.code);
      chk.setAttribute("data-phase", phase.id);

      const box = document.createElement("span");
      box.className = "check-box";
      box.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2"><polyline points="20 6 9 17 4 12"/></svg>`;

      row.appendChild(chk);
      row.appendChild(box);

      if (parsed.code) {
        const codeEl = document.createElement("span");
        codeEl.className = "shot-code";
        codeEl.textContent = parsed.code;
        row.appendChild(codeEl);
      }

      const content = document.createElement("div");
      content.className = "item-content";

      const txt = document.createElement("span");
      txt.className = "item-text";
      txt.textContent = parsed.text;
      content.appendChild(txt);

      const badges = document.createElement("div");
      badges.className = "item-badges";

      const deptBadge = document.createElement("span");
      deptBadge.className = "meta-badge";
      deptBadge.textContent = dept;
      badges.appendChild(deptBadge);

      const takes = state.takes[itemId];
      if (takes && takes.length > 0) {
        const takeBadge = document.createElement("span");
        takeBadge.className = "meta-badge take-badge";
        const hasHero = takes.some((t) => t.isHero);
        takeBadge.textContent = `${takes.length} ${takes.length === 1 ? "take" : "takes"} ${hasHero ? "⭐" : ""}`;
        badges.appendChild(takeBadge);
      }

      const note = state.notes[itemId];
      if (note && note.text) {
        const noteBadge = document.createElement("span");
        noteBadge.className = "meta-badge note-badge";
        noteBadge.textContent = `Note: ${note.text.slice(0, 24)}${note.text.length > 24 ? "..." : ""}`;
        badges.appendChild(noteBadge);
      }

      content.appendChild(badges);
      row.appendChild(content);

      const actions = document.createElement("div");
      actions.className = "item-actions";

      const takeBtn = document.createElement("button");
      takeBtn.type = "button";
      takeBtn.className = "btn-mini";
      takeBtn.title = "Log take or note";
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
  const label = target.closest(".item");

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
    const box = label.querySelector(".check-box");
    if (box) {
      gsap.fromTo(
        box,
        { scale: 0.8 },
        { scale: 1, duration: 0.35, ease: "back.out(2.5)" }
      );
    }
  }

  saveLocalStorage();
  updateProgressUI();

  const mutation = {
    type: "toggle",
    key: itemId,
    checked: isChecked,
    log: `${settings.user} (${settings.role}) ${isChecked ? "completed" : "unmarked"} ${itemCode ? `[${itemCode}] ` : ""}${itemText}`
  };

  syncWithBackend(mutation);

  const { done, total } = getTotalCounts();
  if (done === total && total > 0 && isChecked) {
    playCelebrationConfetti();
    showToast("FILM 100% WRAPPED! All shots and checklist items completed!", "success");
  }
}

async function syncWithBackend(mutation = null) {
  if (isSyncing) return;
  isSyncing = true;
  setSyncStatus("syncing");

  try {
    const payload = {
      room: settings.room,
      user: settings.user,
      role: settings.role,
      mutation,
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
      setSyncStatus("synced");
    } else {
      setSyncStatus("offline");
    }
  } catch (err) {
    setSyncStatus("offline");
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
        setSyncStatus("synced");
      }
    }
  } catch (err) {
    setSyncStatus("offline");
  }
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

function setSyncStatus(status) {
  const pill = document.getElementById("sync-status-pill");
  const dot = document.getElementById("sync-status-dot");
  const text = document.getElementById("sync-status-text");
  if (!pill || !dot || !text) return;

  if (status === "synced") {
    pill.style.background = "var(--success-soft)";
    pill.style.color = "var(--success)";
    dot.style.background = "var(--success)";
    text.textContent = `Live: ${settings.room}`;
  } else if (status === "syncing") {
    pill.style.background = "rgba(240, 136, 62, 0.15)";
    pill.style.color = "var(--accent)";
    dot.style.background = "var(--accent)";
    text.textContent = "Syncing...";
  } else {
    pill.style.background = "rgba(139, 148, 158, 0.15)";
    pill.style.color = "var(--muted)";
    dot.style.background = "var(--muted)";
    text.textContent = "Local (Offline)";
  }
}

function showToast(msg, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    <span>${msg}</span>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3200);
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
      width: 170,
      height: 170,
      colorDark: "#12191D",
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
  showToast(`Connected to room: ${settings.room}`, "success");
}

let activeTakeItemId = null;

function openTakeModal(itemId, title, desc) {
  activeTakeItemId = itemId;
  const modal = document.getElementById("take-modal");
  if (!modal) return;

  const titleEl = document.getElementById("take-modal-title");
  const descEl = document.getElementById("take-modal-desc");
  const noteInput = document.getElementById("take-modal-note");
  const takeList = document.getElementById("take-modal-list");

  if (titleEl) titleEl.textContent = title;
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
    takeList.innerHTML = `<div style="color:var(--muted);font-size:12px;padding:8px 0;">No takes logged yet for this shot.</div>`;
    return;
  }

  takes.forEach((t, i) => {
    const row = document.createElement("div");
    row.style.cssText = "display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:var(--surface-alt);border-radius:6px;border:1px solid var(--line);font-size:13px;";
    row.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-weight:700;font-family:var(--mono);color:${t.isHero ? "var(--accent)" : "var(--fg-bright)"}">Take ${t.takeNumber || i + 1} ${t.isHero ? "⭐ (Hero Take)" : ""}</span>
        <span style="font-size:11px;color:var(--muted);">${t.by || "DOP"}</span>
      </div>
      <button type="button" class="btn" style="min-height:28px;padding:3px 8px;font-size:11px;" data-take-idx="${i}">Delete</button>
    `;
    row.querySelector("button").addEventListener("click", () => {
      takes.splice(i, 1);
      state.takes[itemId] = takes;
      state.updatedAt = Date.now();
      saveLocalStorage();
      renderTakesInModal(itemId);
      renderMain();
      syncWithBackend({
        type: "take",
        key: itemId,
        takes
      });
    });
    takeList.appendChild(row);
  });
}

function closeTakeModal() {
  const modal = document.getElementById("take-modal");
  if (modal) modal.classList.remove("open");
}

function logNewTake(isHero = false) {
  if (!activeTakeItemId) return;
  if (!state.takes[activeTakeItemId]) state.takes[activeTakeItemId] = [];

  const takes = state.takes[activeTakeItemId];
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
  renderTakesInModal(activeTakeItemId);
  renderMain();

  syncWithBackend({
    type: "take",
    key: activeTakeItemId,
    takeNumber: nextNum,
    isHero,
    log: `${settings.user} logged Take ${nextNum} ${isHero ? "⭐ (Hero)" : ""} for shot`
  });

  showToast(`Take ${nextNum} logged!`, "success");
}

function saveShotNote() {
  if (!activeTakeItemId) return;
  const noteInput = document.getElementById("take-modal-note");
  const text = noteInput ? noteInput.value.trim() : "";

  if (text) {
    state.notes[activeTakeItemId] = {
      text,
      by: settings.user,
      at: Date.now()
    };
  } else {
    delete state.notes[activeTakeItemId];
  }

  state.updatedAt = Date.now();
  saveLocalStorage();
  renderMain();
  closeTakeModal();

  syncWithBackend({
    type: "note",
    key: activeTakeItemId,
    text,
    log: `${settings.user} updated note for shot`
  });

  showToast("Shot note saved", "success");
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
  const results = q ? searchIndex.filter((it) => it.text.toLowerCase().includes(q) || it.code.toLowerCase().includes(q) || it.secTitle.toLowerCase().includes(q) || it.dept.toLowerCase().includes(q)) : searchIndex.slice(0, 20);

  if (results.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:24px;color:var(--muted);font-size:13px;">No items match "${query}"</div>`;
    return;
  }

  results.forEach((r, idx) => {
    const item = document.createElement("div");
    item.className = `search-item ${idx === 0 ? "highlighted" : ""}`;
    item.innerHTML = `
      <span class="search-item-phase">${r.phaseLabel}</span>
      ${r.code ? `<span class="search-item-code">${r.code}</span>` : ""}
      <span class="search-item-text">${r.text}</span>
      <span class="meta-badge">${r.dept}</span>
    `;

    item.addEventListener("click", () => {
      closeSearchModal();
      switchPhase(r.phaseId);
      setTimeout(() => {
        const targetEl = document.querySelector(`.item[data-item-id="${r.id}"]`);
        if (targetEl) {
          const parentSec = targetEl.closest(".sec");
          if (parentSec) parentSec.open = true;
          targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
          if (typeof gsap !== "undefined") {
            gsap.fromTo(
              targetEl,
              { backgroundColor: "var(--accent-glow)" },
              { backgroundColor: "", duration: 1.5 }
            );
          }
        }
      }, 150);
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
  if (!container) return;
  container.innerHTML = "";

  if (activities.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:20px;color:var(--muted);font-size:12px;">No activity logged yet. Ticks will appear here in real time.</div>`;
    return;
  }

  activities.forEach((act) => {
    const card = document.createElement("div");
    card.className = "activity-card";
    const dateStr = new Date(act.at || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    card.innerHTML = `
      <div class="activity-meta">
        <span class="activity-user">${act.user} (${act.role})</span>
        <span>${dateStr}</span>
      </div>
      <div class="activity-text">${act.text}</div>
    `;
    container.appendChild(card);
  });
}

function applyTheme(theme) {
  settings.theme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    themeBtn.innerHTML = theme === "dark" ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>` : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  }
  saveLocalStorage();
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
      syncWithBackend({
        type: "hide",
        hide: state.hide
      });
    });
  }

  const soundBtn = document.getElementById("btn-sound-toggle");
  if (soundBtn) {
    soundBtn.classList.toggle("active", settings.sound);
    soundBtn.addEventListener("click", () => {
      settings.sound = !settings.sound;
      soundBtn.classList.toggle("active", settings.sound);
      saveLocalStorage();
      showToast(settings.sound ? "Sound FX enabled" : "Sound FX muted");
    });
  }

  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      applyTheme(settings.theme === "dark" ? "light" : "dark");
    });
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
        showToast("Invite link copied to clipboard!", "success");
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
        resetBtn.textContent = "Tap again to clear all";
        resetBtn.classList.add("btn-danger");
        showToast("Press again within 4 seconds to confirm reset", "warn");
        timer = setTimeout(() => {
          armed = false;
          resetBtn.textContent = "Reset ticks";
          resetBtn.classList.remove("btn-danger");
        }, 4000);
        return;
      }
      clearTimeout(timer);
      armed = false;
      resetBtn.textContent = "Reset ticks";
      resetBtn.classList.remove("btn-danger");

      state.checked = {};
      state.takes = {};
      state.notes = {};
      state.updatedAt = Date.now();
      saveLocalStorage();
      renderMain();
      syncWithBackend({
        type: "reset",
        log: `${settings.user} cleared all checklist ticks`
      });
      showToast("All ticks have been reset");
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
  initBroadcastChannel();
  buildSearchIndex();

  const hash = window.location.hash.replace("#", "");
  if (CHECKLIST_DATA.some((p) => p.id === hash)) {
    currentPhase = hash;
  }

  renderTabs();
  renderDeptFilters();
  renderMain();
  initEventHandlers();
  startSyncLoop();
}

window.addEventListener("DOMContentLoaded", initApp);

