import { Request, Response, NextFunction, Router } from 'express';
import { IMiddlware } from './middlware.interface';

export interface IControllerRoute {
	path: string;
	func: (req: Request, res: Response, next: NextFunction) => void;
	method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;
	middlwares?: IMiddlware[];
}

export type ExpressReturnType = Response<any, Record<string, any>>;
