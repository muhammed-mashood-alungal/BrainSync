import mongoose from 'mongoose';
import { env } from './env.config';
import { Db, GridFSBucket } from 'mongodb';

const URI = env.MONGO_URI as string;

if (!URI) {
  throw new Error('MONGO_URI is not defined in the environment variables.');
}

class MongoDBConfig {
  private static instance: MongoDBConfig;
  private gfs: GridFSBucket | null = null;
  private connectionPromise: Promise<void> | null = null;

  public static getInstance(): MongoDBConfig {
    if (!MongoDBConfig.instance) {
      MongoDBConfig.instance = new MongoDBConfig();
    }
    return MongoDBConfig.instance;
  }

  public connectDB(): Promise<void> {
    if (!this.connectionPromise) {
      this.connectionPromise = new Promise(async (resolve, reject) => {
        try {
          await mongoose.connect(URI);
          console.log('MongoDB Connected Successfully');

          const conn = mongoose.connection;
          // If connection is already open, set up GridFS immediately
          if (conn.readyState === 1) {
            this.gfs = new GridFSBucket(conn.db as Db, { bucketName: 'pdfs' });
            resolve();
          } else {
            // Otherwise wait for the open event
            conn.once('open', () => {
              this.gfs = new GridFSBucket(conn.db as Db, {
                bucketName: 'pdfs',
              });
              resolve();
            });

            conn.on('error', err => {
              reject(err);
            });
          }
        } catch (err) {
          console.log(err);
          reject(err);
        }
      });
    }
    return this.connectionPromise;
  }

  public async getGridFSBucket(): Promise<GridFSBucket> {
    if (!this.connectionPromise) {
      await this.connectDB();
    } else {
      await this.connectionPromise;
    }

    if (!this.gfs) {
      throw new Error(
        'GridFSBucket not initialized. Ensure MongoDB is connected.'
      );
    }
    return this.gfs;
  }
}

const mongoDBConfig = new MongoDBConfig();

export default mongoDBConfig;
