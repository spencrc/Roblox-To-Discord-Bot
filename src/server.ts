import { client } from './client.js';
import { PORT } from './config.js';
import express from 'express';
import indexRoutes from './routes/index.js';
import redirectRoutes from './routes/redirect.js';
import errorMiddleware from './middleware/error.js';

// Start Discord bot by loading all commands and events, then login using your client's token
await client.start();

// Start Express.js server!
const app = express();

app.use('/', indexRoutes);
app.use('/redirect', redirectRoutes);
app.use(errorMiddleware);

app.listen(PORT, () => {
	console.log(`[EXPRESS SERVER] Ready! Listening on port ${PORT}!`);
});
