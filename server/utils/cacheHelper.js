const redisClient = require("./redisClient");

async function invalidLeadStateCache() {
    try {
        const pattern = "lead_state:*";

        for await (const key of redisClient.scanIterator({ MATCH: pattern })) {
            try {
                await redisClient.del(key);
                console.log("Invalidated cache key:", key);
            } catch (error) {
                console.error("Error deleting key:", key, error);
            }
        }
    } catch (error) {
        console.error("Error invalidated lead_state cache", error);
    }
}
module.exports = { invalidLeadStateCache };