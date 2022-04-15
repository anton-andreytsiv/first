import { IMiddlware } from "./middlware.interface";
import { NextFunction, Request, Response} from "express";

export class GuardMiddlware implements IMiddlware {
    execute(req: Request, res: Response, next: NextFunction) {
        if (req.user_id){
            return next();
        }
        res.status(401).send("no auth");
    }
}