import { env } from './env.config';
import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType;

function connectRedis() {
  redisClient = createClient({
    socket: {
      host: env.REDIS_HOST,
      port: 6379,
      reconnectStrategy(retries) {
        if (retries > 5) {
          console.log('Max Redis reconnect attempts reached');
          return false;
        }
        return Math.min(retries * 100, 2000);
      },
    },
  });

  redisClient.on('connect', () => {
    console.log('Connected to redis');
  });
  redisClient.on('error', err => {
    console.error('Redis connection error', err);
  });

  redisClient.connect();
}

export { connectRedis, redisClient };
