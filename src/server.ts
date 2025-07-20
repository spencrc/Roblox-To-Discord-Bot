import { client } from './bot/client.js';
import startExpressServer from './api/app.js';

// Start Discord bot by loading all commands and events, then login using your client's token
await client.start();

// Start Express.js server!
startExpressServer();
