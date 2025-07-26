import dotenv from 'dotenv';

dotenv.config();

export const POSTGRES_HOST = process.env.POSTGRES_HOST!;
export const POSTGRES_USER = process.env.POSTGRES_USER!;
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD!;

export const SUPABASE_URL = process.env.SUPABASE_URL!;
export const SUPABASE_KEY = process.env.SUPABASE_KEY!;

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN!;
export const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;

export const PORT = process.env.PORT || 3000;

export const ROBLOX_CLIENT_ID = process.env.ROBLOX_CLIENT_ID!;
export const ROBLOX_SECRET = process.env.ROBLOX_SECRET!;
