const redis = require('server/db/redis');
const redisClient = redis.createClient({
    host: 'redis-stack', // the hostname of the Redis container in Docker
    port: 6379 // the port Redis is listening on
});
await redisClient.connect();


module.exports = {redisClient};