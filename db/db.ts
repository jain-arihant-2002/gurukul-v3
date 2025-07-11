import { env } from '@/utils/env';
 import { drizzle } from 'drizzle-orm/neon-http';// use this for Neon
//import { drizzle } from 'drizzle-orm/node-postgres'; // TODO:change this for local Postgres with line 2
import * as schema from '@/db/schema';

export const db = drizzle(env.DATABASE_URL, {
    schema,
    //logger: true, // Enable logging for debugging TODO remove in production

});
