const memoryStore = new Map();
const activityStore = new Map();

async function getFromKv(key) {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json || json.result === null || json.result === undefined) return null;
    if (typeof json.result === "string") {
      try {
        return JSON.parse(json.result);
      } catch (e) {
        return json.result;
      }
    }
    return json.result;
  } catch (err) {
    return null;
  }
}

async function setToKv(key, value) {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return false;
  try {
    const res = await fetch(`${url}/set/${encodeURIComponent(key)}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(typeof value === "string" ? value : JSON.stringify(value))
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const queryRoom = req.query && req.query.room;
  const bodyRoom = req.body && req.body.room;
  const room = (queryRoom || bodyRoom || "default").trim().toLowerCase();
  const roomKey = `njs_room_${room}`;
  const actKey = `njs_act_${room}`;

  if (req.method === "GET") {
    let data = await getFromKv(roomKey);
    let activity = await getFromKv(actKey);

    if (!data && memoryStore.has(roomKey)) {
      data = memoryStore.get(roomKey);
    }
    if (!activity && activityStore.has(actKey)) {
      activity = activityStore.get(actKey);
    }

    if (!data) {
      data = {
        checked: {},
        takes: {},
        notes: {},
        hide: false,
        updatedAt: 0
      };
    }

    return res.status(200).json({
      ok: true,
      room,
      data,
      activity: activity || [],
      source: (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) ? "cloud_kv" : "memory"
    });
  }

  if (req.method === "POST") {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    let current = await getFromKv(roomKey);
    if (!current && memoryStore.has(roomKey)) {
      current = memoryStore.get(roomKey);
    }
    if (!current) {
      current = {
        checked: {},
        takes: {},
        notes: {},
        hide: false,
        updatedAt: 0
      };
    }

    let acts = await getFromKv(actKey);
    if (!acts && activityStore.has(actKey)) {
      acts = activityStore.get(actKey);
    }
    if (!acts) acts = [];

    const { mutation, fullState, user, role } = body;

    if (fullState) {
      current.checked = fullState.checked || {};
      current.takes = fullState.takes || {};
      current.notes = fullState.notes || {};
      current.hide = !!fullState.hide;
      current.updatedAt = Date.now();
    } else if (mutation) {
      if (mutation.type === "toggle") {
        if (mutation.checked) {
          current.checked[mutation.key] = {
            ticked: true,
            by: user || "Crew",
            role: role || "General",
            at: Date.now()
          };
        } else {
          delete current.checked[mutation.key];
        }
      } else if (mutation.type === "take") {
        if (!current.takes[mutation.key]) current.takes[mutation.key] = [];
        current.takes[mutation.key].push({
          takeNumber: mutation.takeNumber,
          isHero: !!mutation.isHero,
          note: mutation.note || "",
          by: user || "DOP",
          at: Date.now()
        });
      } else if (mutation.type === "note") {
        current.notes[mutation.key] = {
          text: mutation.text,
          by: user || "Director",
          at: Date.now()
        };
      } else if (mutation.type === "reset") {
        current.checked = {};
        current.takes = {};
        current.notes = {};
      } else if (mutation.type === "hide") {
        current.hide = !!mutation.hide;
      }
      current.updatedAt = Date.now();
    }

    if (mutation && mutation.log) {
      acts.unshift({
        id: Date.now() + Math.random().toString(36).slice(2, 7),
        text: mutation.log,
        user: user || "Crew",
        role: role || "General",
        at: Date.now()
      });
      if (acts.length > 50) acts = acts.slice(0, 50);
    }

    await setToKv(roomKey, current);
    await setToKv(actKey, acts);
    memoryStore.set(roomKey, current);
    activityStore.set(actKey, acts);

    return res.status(200).json({
      ok: true,
      room,
      data: current,
      activity: acts,
      savedAt: current.updatedAt
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
