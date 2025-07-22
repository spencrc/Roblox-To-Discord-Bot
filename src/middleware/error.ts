import { NextFunction, Request, Response } from "express";
import { HttpError } from "../classes/http-error.js";

export default function errorMiddleware(error: HttpError, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) return next(error);

    const status = error.status || 500;
    const message = error.message;
    res.status(status).send(message);
}