import { NextFunction, Request, Response} from "express";

export interface IMiddlware {
    execute: (req: Request, res: Response, next: NextFunction) => void;
}