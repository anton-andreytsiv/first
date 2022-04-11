import { IMiddlware } from "./middlware.interface";
import { NextFunction, Request, Response} from "express";
import { JwtPayload, verify } from "jsonwebtoken";

export class AuthMiddlware implements IMiddlware {

    constructor(private secret: string) {}

    execute(req: Request, res: Response, next: NextFunction){
        if(req.headers.authorization){
         
            try {
                 const user =  verify(req.headers.authorization.split(' ')[1], this.secret) as JwtPayload ;
                 req.user = user.email;
                 next();
            } catch (e){
                console.log(e);
                next();
            }
            
        } else {
             next();
        }
       
    }

}