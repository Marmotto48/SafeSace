const REDIS_PORT = process.env.REDIS_PORT || 6379;
var mongoose = require("mongoose");
var MongooseCache = require("mongoose-redis");

module.exports = {
  cache: MongooseCache(mongoose, "redis://127.0.0.1:6379"),
};

// const client = redis.createClient(REDIS_PORT);
// client.connect();
// client.on("connect", () => {
//   console.log("connected");
// });
