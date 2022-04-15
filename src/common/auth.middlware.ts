import { IMiddlware } from "./middlware.interface";
import { NextFunction, Request, Response} from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { UserRepository } from "../users/user.repository";
import { Role } from "@prisma/client";
import { ConfigService } from "../config/config.service";
import 'reflect-metadata';

@injectable()
export class AuthMiddlware {

    constructor(
        @inject(TYPES.UserRepository) private userRepository: UserRepository,
        @inject(TYPES.ConfigService) private configService: ConfigService,
        ) {}

    async execute(req: Request, res:Response, next: NextFunction){
        if(req.cookies['token']){
            try {
                const user =  verify(req.cookies['token'], this.configService.get("SECRET")) as JwtPayload ;
                if(user.id){
                    req.user_id = user.id;
                    const role = await this.userRepository.getRole(user.id);
                    if (!role){
                        return next();
                    } 
                    req.role = role.name;
                }
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