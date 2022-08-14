import express, { Express, NextFunction, Request, Response } from 'express';
import { Server } from 'http';
import { ApolloServer } from 'apollo-server-express';
import { context } from './database/context'


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
import { AuthMiddleware } from './common/auth.middleware';
import cookieParser from "cookie-parser";
import { ProductsController } from './products/products.controller';
const resolvers = require('./graphql/resolvers');
const typeDefs = require ('./graphql/typedefs');


@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.Ilogger) private logger: ILogger,
		@inject(TYPES.IUser) private userController: UserController,
		@inject(TYPES.ProductsController) private productsController: ProductsController,
		@inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter,
		@inject(TYPES.ConfigService) private configService: ConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
		@inject(TYPES.AuthMiddleware) private authMiddleware: AuthMiddleware,
		
	) {
		this.app = express();
		this.port = 8000;
		
		this.app.use(cookieParser());
	}

	userMiddleware(): void {
		this.app.use(bodyParser.json());
		const cors = require("cors");
		this.app.use(cors({  origin: true,
		credentials: true,
		exposedHeaders: ['set-cookie']}));

		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(this.authMiddleware.execute.bind(this.authMiddleware));
		this.app.use('/admin/*.*',this.authMiddleware.isAdmin.bind(this.authMiddleware));		
		this.app.use('/customers/*.*',this.authMiddleware.isUser.bind(this.authMiddleware));
		this.app.use(express.static(__dirname + '/public'));	
	}

	productsRoutes():void{
		this.app.use('/products', this.productsController.router);	
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
		this.productsRoutes();	
		this.useExeptionFilter();
		this.prismaService.connect();
		

		const apolloServer = new ApolloServer({
			typeDefs,
			resolvers,
			csrfPrevention: true,
			cache: 'bounded',
			context: context

		});
	
		  await apolloServer.start();
		  apolloServer.applyMiddleware({ 
			  app: this.app,
			  cors: false,
			  path: '/',
			
			});
		  
			

		this.server = this.app.listen(this.port);
		this.logger.log('server is running!');
	}
}
