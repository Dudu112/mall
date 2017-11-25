const redis = require("redis");
const client = redis.createClient('redis://127.0.0.1:6300');

client.on('error', err => console.log('------ Redis connection failed ------' + err))
.on('connect', () => console.log('------ Redis connection succeed ------'));

module.exports = client;
