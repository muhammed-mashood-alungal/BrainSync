import { env } from './env.config';
import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType;
console.log(`redis://${env.REDIS_USERNAME}:${env.REDIS_PASSWORD}@${env.REDIS_HOST}:${env.REDIS_PORT}`)
function connectRedis() {
  const redisUrl = `redis://${env.REDIS_USERNAME}:${env.REDIS_PASSWORD}@${env.REDIS_HOST}:${env.REDIS_PORT}`;
  console.log('Connecting to Redis at:', env.REDIS_HOST);
  redisClient = createClient({
    username: env.REDIS_USERNAME!,
    password: env.REDIS_PASSWORD!,
    socket: {
      host: env.REDIS_HOST!,
      port: Number(env.REDIS_PORT)!,
      connectTimeout: 30000,
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
    console.log('HEEEEEEY')
    console.error('Redis connection error', err);
  });

  redisClient.connect();
}

export { connectRedis, redisClient };
