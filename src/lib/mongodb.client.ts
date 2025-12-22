import { MongoClient} from 'mongodb';
import { FALLBACK_MONGODB_URI } from './constants';

export async function initializeMongoDB() {
  const uri = process.env.MONGODB_URI || FALLBACK_MONGODB_URI;

  const client = new MongoClient(uri);
  const db = client.db();

  await client.connect();

  console.log('connected to mongodb');

  return { client, db };
}
