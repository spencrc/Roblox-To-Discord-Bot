# Roblox-Verify-Bot

[![discord.js](https://img.shields.io/badge/discord.js-%5E14.21.0-blue)](https://discord.js.org/)

## Commands

The following commands are available:

- `/ping`: replies with "Pong!"
- `/verify`: replies with generated ROBLOX OAuth 2.0 link.
- `/whois`: sends a GET request to Roblox’s API for the mentioned user and replies with their profile information.
- `/verifylog`: sets the server's verify log channel in the database.

## Setup

1. Install Node.js. Instructions on how to install Node on your system: [Downloading and Installing Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
2. Create a `.env` file inside the project's folder, and have it contain the following:
    
   ```
   SUPABASE_URL=supabase_url
   SUPABASE_KEY=supabase_api_key
   DISCORD_TOKEN=discord_token
   DISCORD_CLIENT_ID=discord_client_id
   ROBLOX_CLIENT_ID=roblox_client_id
   ROBLOX_API_KEY=roblox_api_key
   BASE_URL=https://example.com
   ```
3. Create a Discord application on the [Discord Developer Portal](https://discord.com/developers/applications/).
4. Create an OAuth 2.0 App on ROBLOX with the `openid` scope. Please ensure one of the Redirect URLs matches the BASE_URL in the .env file, with /redirect added at the end (e.x.: https://example.com/redirect).
5. Create an API Key on ROBLOX. No permissions are required.
6. Create a project on Supabase.
7. Obtain your `.env` variables:
      - `SUPABASE_URL` and `SUPABASE_KEY` can be found on the initial page of your new Supabase project. They can also be found under Project Settings.
      - `DISCORD_TOKEN` and `DISCORD_CLIENT_ID` can be found on the page for your new Discord application. The client id will be located under the General Information tab, under Application Id. The token will be located under the Bot tab.
      - `ROBLOX_CLIENT_ID` will be located on the page for your new ROBLOX OAuth 2.0 app.
      - `ROBLOX_API_KEY` will be located on the page for your new ROBLOX API Key.
      - `BASE_URL will` be whatever your want it to be! It should be the website served by [Roblox-Verify-Backend](https://github.com/spencrc/Roblox-Verify-Backend), either locally or hosted.
8. Install packages by running `npm i` in the project's folder.
9. Add your bot to your server. Instructions are here: [Adding your bot to servers](https://discordjs.guide/preparations/adding-your-bot-to-servers.html)
10. Register the slash commands in your guild by running `npm run deploy`.
11. Start the bot by either using `npm start`, `npm run dev`, or by using Docker Compose (if you have Docker Desktop installed!).

## Scripts

The bot comes with a few different scripts defined in `package.json`:

- `npm run build`: builds the `src/` directory to `dist/` using the TypeScript compiler.
- `npm start`: starts the bot normally.
- `npm run dev`: starts the bot in development mode, which means incrementally re-building the bot on file update and restarting it.
- `npm run deploy`: deploys Discord commands globally.
- `npm run undeploy`: deletes all deployed Discord commands globally.
- `npm run lint`: runs ESLint for best coding practices.
- `npm run format`: runs Prettier to highlight inconsistencies in formatting.
- `npm run format:fix`: runs Prettier to fix all inconsistencies in formatting.

## Database Setup

Please create the following tables with the following columns:

- `roblox_discord_links` (realtime)
  - `discord_id`: text (primary key)
  - `guild_id`: text
  - `roblox_id`: text
- `roblox_oauth_sessions`
  - `state`: text (primary key)
  - `discord_id`: text
  - `expires_at`: timestamp
  - `guild_id`: text
- `settings`
  - `guild_id`: text (primary key)
  - `verify_log_channel_id`: text
