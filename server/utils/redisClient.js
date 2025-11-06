const redis = require("redis");

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        console.error("Redis reconnect failed after 5 attempts");
        return new Error("Redis connection failed");
      }
      console.log(`Redis reconnect attempt #${retries}`);
      return Math.min(retries * 100, 3000);
    },
  },
});

redisClient.on("error", (err) => console.error("Redis Error:", err));
redisClient.on("connect", () => console.log("Connected to Redis"));
redisClient.on("reconnecting", () => console.log("Reconnecting to Redis..."));

(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error("Redis Connection Failed:", error);
  }
})();

module.exports = redisClient;
