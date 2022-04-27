import { IMiddlware } from "./middlware.interface";
import { NextFunction, Request, Response} from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { UserRepository } from "../users/user.repository";
import { Role } from "@prisma/client";
import { ConfigService } from "../config/config.service";
import 'reflect-metadata';
import { goUrl } from "../users/users.controller";

@injectable()
export class AuthMiddleware implements IMiddlware{

    constructor(
        @inject(TYPES.UserRepository) private userRepository: UserRepository,
        @inject(TYPES.ConfigService) private configService: ConfigService,
        ) {}

    async execute(req: Request, res:Response, next: NextFunction){
        const path = require('path');
        console.log('root auth  ' + req.path);
        if  (req.path == '/'){
            next();
        } else {

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
                    console.log('auth token complite ' + req.path);
                }
                //else{
                    //goUrl(res, '/doa.html');
                //}
                /*if (req.path.includes('login')){
                    console.log('login html with cookies');
                    if (req.role == "admin"){
                        goUrl(res, '/admin/admin.html');
                    } else {
                        goUrl(res, '/customers/customer.html');
                    }
                }*/
                 next();
            } catch (e){
                console.log(e);
                next();
            }
            
        } else if (req.path.includes('login')){
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