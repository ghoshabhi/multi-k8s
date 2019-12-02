const keys = require("./keys");
const redis = require("redis");

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const redisSubscriberClient = redisClient.duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

redisSubscriberClient.on("message", (channel, message) => {
  const fibValue = fib(parseInt(message));
  redisClient.hset("values", message, fibValue);
});

redisSubscriberClient.subscribe("insert");
