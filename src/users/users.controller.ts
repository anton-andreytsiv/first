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
import { sign } from "jsonwebtoken";
import { IConfigService } from '../config/config.service.interface';
import { GuardMiddlware } from '../common/guard.middlware';
import {} from 'path'
import { AuthMiddlware } from '../common/auth.middlware';


@injectable()
export class UserController extends BaseController implements IUser {
	
	constructor(
		@inject(TYPES.Ilogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.AuthMiddleware) private authMiddlware: AuthMiddlware,
	
	) {
		super(loggerService);
		this.bindRoutes([
			{ path: '/',
			method: "get", 
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
			middlwares: [new ValidateMiddlware(UserLoginDto)]
		},			
			{ path: '/info', 
			method: 'get', 
			func: this.info, 
			middlwares: [new GuardMiddlware()]
		},
		]);
	}

	async start (req: Request, res:Response, next:NextFunction){
		const path = require('path');
		//console.log(req.cookies['token']);
		//res.sendFile(path.join(__dirname, '../public', 'admin.html'));
		await this.authMiddlware.execute(req, res, next);
		console.log(req.role);
		if(req.role=='user'){
			res.sendFile(path.join(__dirname, '../public', 'customer.html'));
		} else if (req.role=='admin'){
			res.setHeader('Location', path.join(__dirname, '../public', 'admin.html'));
		} else{
			res.sendFile(path.join(__dirname, '../public', 'login.html'));
		}
		
	}

	async login({body, cookies}: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
		const path = require('path');
		if(cookies['token']){
			
			
		} else{
			const result = await this.userService.validateUser(body);
			if (result) {
				const jwt = await this.signJwt(result.id, this.configService.get('SECRET'))
				res.cookie('token',jwt, { maxAge: 900000, httpOnly: true });
				if(result.roleId==1){
					res.sendFile(path.join(__dirname, '../public', 'admin.html'));
				} else{
					res.sendFile(path.join(__dirname, '../public', 'customer.html'));
				}
			} else {
				res.sendFile(path.join(__dirname, '../public', 'login.html'));
			}
		}
		
		
	}
	private signJwt (id:number, secret:string): Promise<string>{
		return new Promise((resolve, reject) =>{
			sign(
				{id,
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

	async register({body}: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result) {
			return next(new HTTPError(422, 'Такой пользователь уже существует'));
		}
		this.ok(res, { email: result.email, id: result.id });
	}
	async info({user_id}: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
		const userInfo = await this.userService.getUserInfo(user_id);
		this.ok(res, userInfo);
	}
}
