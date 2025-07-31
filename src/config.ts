import dotenv from 'dotenv';

dotenv.config();

export const SUPABASE_URL = process.env.SUPABASE_URL!;
export const SUPABASE_KEY = process.env.SUPABASE_KEY!;

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN!;
export const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;

export const ROBLOX_CLIENT_ID = process.env.ROBLOX_CLIENT_ID!;
export const ROBLOX_SECRET = process.env.ROBLOX_SECRET!;

export const BASE_URL = process.env.BASE_URL!;
