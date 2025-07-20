import express from "express";
import { PORT } from "../config.js";
import indexRoutes from "./routes/index.js";

const startExpressServer = () => {
    const app = express();

    app.use('/', indexRoutes)

    app.listen(PORT, () => {
        console.log(`[EXPRESS SERVER] Ready! Listening on port ${PORT}!`);
    })
}

export default startExpressServer;