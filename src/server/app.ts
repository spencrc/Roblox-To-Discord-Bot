import express from 'express';

import indexRouter from './routes/index.js';
import redirectRouter from './routes/redirect.js';
import termsRouter from './routes/terms.js';

import errorMiddleware from './middleware/error-middleware.js';

// Setup Express.js server!
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/', indexRouter);
app.use('/redirect', redirectRouter);
app.use('/terms', termsRouter);

app.use(errorMiddleware);

export default app;
