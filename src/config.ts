import dotenv from 'dotenv';

dotenv.config();

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN!;
export const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;

export const PORT = process.env.PORT || 3000;

export const ROBLOX_CLIENT_ID = process.env.ROBLOX_CLIENT_ID!;
export const ROBLOX_SECRET = process.env.ROBLOX_SECRET!;
