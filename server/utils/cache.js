const { redisClient } = require("./redisClient");

exports.clearLeadStateCache = async () => {
  try {
    const keys = await redisClient.keys("lead_state:*");
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log("🔥 Redis cache cleared: lead_state");
    } else {
      console.log("No lead_state cache to clear");
    }
  } catch (err) {
    console.log("Redis cache clear error:", err);
  }
};
