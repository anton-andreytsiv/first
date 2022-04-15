import express, { Express, Request, Response } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { ExeptionFilter } from './errors/exeption.filters';
import { ILogger } from './logger/logger.interface';
import { TYPES } from './types';
import { UserController } from './users/users.controller';
import 'reflect-metadata';
import bodyParser from 'body-parser';
import { ConfigService } from './config/config.service';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { PrismaService } from './database/prisma.service';
import { AuthMiddlware } from './common/auth.middlware';
import cookieParser from "cookie-parser";


@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.Ilogger) private logger: ILogger,
		@inject(TYPES.IUser) private userController: UserController,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter,
		@inject(TYPES.ConfigService) private configService: ConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService
	) {
		this.app = express();
		this.port = 8000;
		this.app.use(express.static(__dirname + '/public'));
		this.app.use(cookieParser());
	}

	userMiddleware(): void {
		//this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: false }));
	}
	pagesRoutes():void{
		this.app.use('/admin.html', (req: Request, res: Response)=>{
			//const authMiddlware = new AuthMiddlware();
		//	this.app.use(authMiddlware.execute.bind(authMiddlware));
			});

	}

	userRoutes(): void {
		this.app.use('/users', this.userController.router);
		
	}

	useExeptionFilter(): void {
		this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
	}

	public async init(): Promise<void> {
		this.userMiddleware();
		this.userRoutes();	
		this.pagesRoutes();	
		this.useExeptionFilter();
		this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log('server is running!');
	}
}
