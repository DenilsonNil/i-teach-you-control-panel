import { MongoClient, Db } from "mongodb";

type MongoCache = {
  client: MongoClient | null;
  db: Db | null;
};

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
  throw new Error("MONGODB_URI is not set. Configure it in your environment variables.");
}

if (!dbName) {
  throw new Error("MONGODB_DB is not set. Configure it in your environment variables.");
}

const globalWithMongo = globalThis as typeof globalThis & {
  _mongoCache?: MongoCache;
};

const mongoCache: MongoCache = globalWithMongo._mongoCache ?? {
  client: null,
  db: null,
};

export const getDatabase = async (): Promise<Db> => {
  if (mongoCache.db && mongoCache.client) {
    return mongoCache.db;
  }

  const client = mongoCache.client ?? new MongoClient(uri);
  if (!mongoCache.client) {
    await client.connect();
    mongoCache.client = client;
  }

  const database = mongoCache.db ?? client.db(dbName);
  mongoCache.db = database;
  globalWithMongo._mongoCache = mongoCache;

  return database;
};
