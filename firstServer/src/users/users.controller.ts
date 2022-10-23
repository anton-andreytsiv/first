import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http.error.class';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import 'reflect-metadata';
import { IUser } from './users.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { IUserService } from './user.servise.interface';
import { ValidateMiddlware } from '../common/validate.middlware';
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { IConfigService } from '../config/config.service.interface';
import { GuardMiddlware } from '../common/guard.middlware';
import {} from 'path'
import { AuthMiddleware } from '../common/auth.middleware';
import { IUserRepository } from './user.repository.interface';

function goLogin(res: Response): void{
    const path = require('path');
    const login = path.normalize(path.resolve("./") + '/src/public/login.html');
    res.setHeader("Location", login);
    res.status(301);
    res.end();
}
export function goUrl(res: Response, url: string): void{
    res.setHeader("Location", url);
    res.status(301);
    res.end();
}

@injectable()
export class UserController extends BaseController implements IUser {
	
	constructor(
		@inject(TYPES.Ilogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.UserRepository) private userRepository: IUserRepository,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.AuthMiddleware) private authMiddlware: AuthMiddleware,
	
	) {
		super(loggerService);
		this.bindRoutes([
			{ path: '/hit',
			method: "post", 
			func: this.start,
			middlwares: []	
		},
			{ path: '/register',
			method: 'post', 
			func: this.register,
			middlwares: [new ValidateMiddlware(UserRegisterDto)]	
		},
			{ path: '/login', 
			method: 'post', 
			func: this.login, 
			middlwares: []//new ValidateMiddlware(UserLoginDto)]
		},			
			{ path: '/info', 
			method: 'get', 
			func: this.info, 
			middlwares: []
		},
			{ path: '/logout', 
			method: 'get', 
			func: this.logout, 
			middlwares: []
		},
		]);
	}

	async start (req: Request, res:Response, next:NextFunction){
		const path = require('path');
		console.log(req.body.email);
		res.status(200);
		res.header("Access-Control-Allow-Origin", "*");
		res.end(JSON.stringify({ role: "admin" }));
	}

	async login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
		const path = require('path');
		if(req.body.email){
			const result = await this.userService.validateUser(req.body);
			
			if (result) {
				const jwt = await this.signJwt(result.id, req.body.email, this.configService.get('SECRET'))
				res.cookie('token',jwt, { maxAge: 9000000, httpOnly: true, sameSite: 'none'});
				req.user_id = result.id;
				req.email = result.email;
				if(result.roleId==1){
					req.role = 'admin';									
				} else{
					req.role = 'user';
				}
				res.status(200);
				res.end(JSON.stringify({ name: result.name, role: req.role }));
				
			} else {
				res.status(401);
				res.end();
			}
		} else if(req.cookies['token']){
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
					console.log('role: '+ role.name);
					if(role.name=='admin'){
						goUrl(res, '/admin/admin.html');
						
					} else{
						goUrl(res, '/customers/customer.html')
					}
                }
                 next();
            } catch (e){
                console.log(e);
                next();
            }
		} else {
			goUrl(res, 'dao.html');
		}
		
		
	}
	private signJwt (id:number, email:string, secret:string): Promise<string>{
		return new Promise((resolve, reject) =>{
			sign(
				{id,
				email,
				iat: Math.floor(Date.now() / 1000)},
				secret,
				{
					algorithm: 'HS256'
				},
				(err, token) =>{
					if(err){
						reject(err);
					}
					resolve (token as string);
				}
			)
		})
	}

	async register(req: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
		console.log('controller');
		const result = await this.userService.createUser(req.body);
		if (!result) {
			return next(new HTTPError(422, 'this user already exists'));
		} else {
			
			res.status(200);
			res.end(JSON.stringify({ name: result.name }));
			}
		
	}


	async info({user_id}: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
		console.log('info');
		if (user_id){
		const userInfo = await this.userService.getUserInfoById(user_id);
		console.log(userInfo);
		this.ok(res, userInfo);
		} else {
			goLogin(res);
		}
	}
	logout (req: Request, res: Response, next: NextFunction): void{
		console.log('logout get method');
		res.cookie('token','my', { maxAge: 1, httpOnly: true, sameSite: 'none' });
		req.user_id = 0;
		req.role = '';
		res.status(200);
		res.end('logout');
	}
}
