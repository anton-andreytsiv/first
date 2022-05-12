import { UserModel, Role } from "@prisma/client";
import { isEmail } from "class-validator";
import { inject, injectable } from "inversify";
import { PrismaService } from "../database/prisma.service";
import { TYPES } from "../types";
import { User } from "./user.entity";

const db = require('../database/db');

   
@injectable()
export class UserRepository {

    constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService){}

    async create ({ email, password, name }: User): Promise<UserModel>{ 
        return this.prismaService.client.userModel.create({
            data: {
                email,
                password, 
                name
            }
        });
    }
    async createUser ({ email, password, name }: User): Promise<UserModel | null>{ 
        try{
            const newUser = await db.query(`INSERT INTO users (email, password, name, roleId) VALUES ($1, $2, $3, $4)`,[email, password, name, 2])
            return newUser;
        }
        catch(e){
            console.log(e);
        }
        return null;
        
    }
    async find (email: string): Promise<UserModel | null>{
        return this.prismaService.client.userModel.findFirst({
            where :{
                email
            }
        });
    }
    async findById (id: number): Promise<UserModel | null>{
        return this.prismaService.client.userModel.findFirst({
            where :{
                id
            }
        });
    }
    async getRole (id: number): Promise<Role | null>{
        const user = await this.prismaService.client.userModel.findFirst({
            where :{
                id
            }
        });
        if (user){
            return await this.prismaService.client.role.findFirst({
                where :{
                    id : user.roleId
                }
            });
        }
        return null;
    }
}