import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http.error.class';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import 'reflect-metadata';
import { IProducts } from './products.interface';


import { IConfigService } from '../config/config.service.interface';

import {} from 'path'
import { AuthMiddleware } from '../common/auth.middleware';
import { IProductsService } from './products.servise.interface';


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

function connectRabbit(order_id:number, email:string):void{

	let amqp = require('amqplib/callback_api');

	amqp.connect('amqp://rabbitmq', function(error0, connection) {
		if (error0) {
			setTimeout(()=>{
				console.log('trying to reconnect');
				connectRabbit(order_id, email);
			},10000)
			
		}
		connection.createChannel(function(error1, channel) {
			if (error1) {
				throw error1;
			}
	
			let queue = 'mail';
			let msg = {
				'order_id': order_id,
				'email': email
			}
	
			channel.assertQueue(queue, {
				durable: false
			});
			channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
	
			console.log(" [x] Sent %s", msg);
		});
		setTimeout(function() {
			connection.close();
			process.exit(0);
		}, 5000);
	});
}

@injectable()
export class ProductsController extends BaseController implements IProducts {
	
	constructor(
		@inject(TYPES.Ilogger) private loggerService: ILogger,
		@inject(TYPES.ProductsService) private productsService: IProductsService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.AuthMiddleware) private authMiddlware: AuthMiddleware,
	
	) 
	{
		super(loggerService);
		this.bindRoutes([
			{ path: '/',
			method: "get", 
			func: this.getAll,
			middlwares: []	
		},
			{ path: '/id',
			method: 'get', 
			func: this.getOne,
			middlwares: []	
		},
			{ path: '/buy',
			method: 'post', 
			func: this.buy,
			middlwares: []	
		},
			{ path: '/myorders',
			method: 'get', 
			func: this.myOrders,
			middlwares: []	
		}
		]);
	}

	async getAll (req: Request, res:Response, next:NextFunction){

		const allProducts = await this.productsService.getAllProducts();
		
		
		res.status(200);
		
		res.end(JSON.stringify(allProducts));
	}

	getOne (req: Request, res:Response, next:NextFunction){
	}

	async buy (req: Request, res:Response, next:NextFunction){
		if(req.body){
			let productLess = false;
			let allProducts = await this.productsService.getAllProductsQuantity();

			Object.entries(req.body).map( item => {
				if (allProducts){
						allProducts.forEach(element => {
							if(element.id == Number(item[0]) && element.quantity < Number(item[1])){
								productLess = true;
							}
						});
				}
			});

			if (productLess){
				res.status(200)
				res.end('no items');
			} else {
				let order_id = await this.productsService.setOrder(req.body, req.user_id)
				console.log(order_id);
				connectRabbit(order_id, req.email)
				res.status(200);
				res.end(req.user_id.toString());
			}

		}
		
	}

	async myOrders (req: Request, res:Response, next:NextFunction){

		const myOrders = await this.productsService.getOrders(req.user_id);
		
		
		res.status(200);
		
		res.end(JSON.stringify(myOrders));
	}

	
}
