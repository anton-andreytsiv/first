import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { ExeptionFilter } from './errors/exeption.filters';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { TYPES } from './types';
import { UserController } from './users/users.controller';
import 'reflect-metadata';
import { IUser } from './users/users.interface';
import { UserService } from './users/user.service';
import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.service.interface';
import { PrismaService } from './database/prisma.service';
import { UserRepository } from './users/user.repository';
import { IMiddlware } from './common/middlware.interface';
import { AuthMiddleware} from './common/auth.middleware';
import { ProductsRepository } from './products/products.repository';
import { ProductsService } from './products/products.service'
import { ProductsController } from './products/products.controller';
import { IProducts } from './products/products.interface'

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.Ilogger).to(LoggerService).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<IUser>(TYPES.IUser).to(UserController);
	bind<ProductsController>(TYPES.ProductsController).to(ProductsController);
	bind<UserService>(TYPES.UserService).to(UserService);
	bind<ProductsService>(TYPES.ProductsService).to(ProductsService);
	bind<ExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<UserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
	bind<ProductsRepository>(TYPES.ProductsRepository).to(ProductsRepository).inSingletonScope();
	bind<AuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware);
	bind<App>(TYPES.Application).to(App);
});

export interface IBootstrap {
	appContainer: Container;
	app: App;
}

function bootstarp(): IBootstrap {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();
	return { appContainer, app };
}

export const { app, appContainer } = bootstarp();
