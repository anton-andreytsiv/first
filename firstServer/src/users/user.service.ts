import { UserModel } from "@prisma/client";
import { compare, setRandomFallback } from "bcryptjs";
import { inject, injectable } from "inversify";
import { ConfigService } from "../config/config.service";
import { HTTPError } from "../errors/http.error.class";
import { TYPES } from "../types";
import { UserLoginDto } from "./dto/user-login.dto";
import { UserRegisterDto } from "./dto/user-register.dto";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";
import { IUserService } from "./user.servise.interface";

@injectable()
export class UserService implements IUserService {
    constructor (
        @inject(TYPES.ConfigService) private configService: ConfigService,
        @inject(TYPES.UserRepository) private userRepository: UserRepository
        ) {}

    async createUser ({ name, email, password }: UserRegisterDto): Promise<UserModel | null> {
        const newUser = new User(name, email);
        const salt = this.configService.get('SALT');
		await newUser.setPassword(password, salt);
        console.log(newUser);
        const existUser = await this.userRepository.find(email);
        if (existUser){
            return null;
        }
            return this.userRepository.create(newUser);
    }

    async validateUser ({email, password}: UserLoginDto): Promise<UserModel | null>{
    const existUser = await this.userRepository.find(email);
    
    if (!existUser){
        console.log(new HTTPError(401, 'wrong login'));
       return null;
    }
    
     if (await compare(password, existUser.password)){
         return existUser;
     }
     console.log(new HTTPError(401, 'wrong password'));
     return null;

    }
    async getUserInfoById (id: number): Promise<UserModel | null>{
        return await this.userRepository.findById(id);
    }


    async getUserInfo (email: string): Promise<UserModel | null>{
        return await this.userRepository.find(email);
    }
    
} 