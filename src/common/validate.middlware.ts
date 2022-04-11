import { IMiddlware } from "./middlware.interface";
import { NextFunction, Request, Response} from "express";
import { ClassConstructor, plainToClass } from "class-transformer";
import { validate } from "class-validator";

export class ValidateMiddlware implements IMiddlware {

    constructor (private classToValidate: ClassConstructor<object>){
       
    }
    execute ( { body }: Request, res: Response, next: NextFunction): void{
        const instance = plainToClass(this.classToValidate, body);
        validate (instance).then((errors) => {
            if(errors.length  > 0){
                res.status(402).send(errors);
            } else {
                next();
            }
        })
    }
}