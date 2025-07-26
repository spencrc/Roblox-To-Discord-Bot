import { client } from './bot/client.js';
import app from './server/app.js';
import { PORT } from './config.js';

// Start Discord bot by loading all commands and events, then login using your client's token
await client.start();

// Start Express.js server!
app.listen(PORT, () => {
	console.log(`Ready! Listening on port ${PORT}!`);
});