import dotenv from 'dotenv';

dotenv.config();

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN!;
export const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;

export const POSTGRES_HOST = process.env.POSTGRES_HOST!;
export const POSTGRES_USER = process.env.POSTGRES_USER!;
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD!;
