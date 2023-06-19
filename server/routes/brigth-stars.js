const express = require('express');
// const {redisClient} = require("../db/redis");
const redis = require("redis");
const router = express.Router();

router.get('/', async function(req, res, next) {
    try {
        const redis = require('redis');
        const redisClient = redis.createClient({
            host: 'redis-stack', // the hostname of the Redis container in Docker
            port: 6379 // the port Redis is listening on
        });
        await redisClient.connect();

        const reply = await redisClient.lRange('bright-star-catalog', 0, -1);
        res.send(reply);
    } catch (e) {
        console.error(e);
        res.status(500).end();
    }
});

module.exports = router;