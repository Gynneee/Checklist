export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  return res.status(200).json({
    status: "ok",
    service: "not-just-story-sync-backend",
    timestamp: Date.now(),
    kvConnected: !!(process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL)
  });
}

