import { IMiddlware } from "./middlware.interface";
import { NextFunction, Request, Response} from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { UserRepository } from "../users/user.repository";
import { ConfigService } from "../config/config.service";
import 'reflect-metadata';

@injectable()
export class AuthMiddleware implements IMiddlware{

    constructor(
        @inject(TYPES.UserRepository) private userRepository: UserRepository,
        @inject(TYPES.ConfigService) private configService: ConfigService,
        ) {}

    async execute(req: Request, res:Response, next: NextFunction){
        const path = require('path');
        console.log('root auth  ' + req.path);
        if  (req.path == '/' || req.path == '/users/register' || req.path == '/graphql'){
            next();
        } else {

        if(req.cookies['token']){
            try {
                const user =  verify(req.cookies['token'], this.configService.get("SECRET")) as JwtPayload ;
                if(user.id){
                    req.user_id = user.id;
                    req.email = user.email;
                    const role = await this.userRepository.getRole(user.id);
                    if (!role){
                        return next();
                    } 
                    req.role = role.name;
                    console.log('auth token complite ' + req.path);
                }
                 next();
            } catch (e){
                console.log(e);
                next();
            }
            
        } else if (req.path.includes('login')){
            console.log("login in path")
            next();
        }
        else {
            console.log('no cookies token ');
           
            res.setHeader("Location", '/login.html');
            res.status(301);
            res.end();

        } 
    }     
    }

    isAdmin(req: Request, res:Response, next: NextFunction){
        console.log('admin auth');
        if(req.role == 'admin'){
            next()
        } else {
            res.setHeader("Location", '/doa.html');
            res.status(301);
            res.end();
        }
    }

    isUser(req: Request, res:Response, next: NextFunction){
        console.log('customer auth');
        if(req.role == 'user'){
            next()
        } else {
            res.setHeader("Location", '/doa.html');
            res.status(301);
            res.end();
        }
    }

}