
import { NextFunction, Request, Response } from 'express';

export interface IProducts {
	getAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getOne: (req: Request, res: Response, next: NextFunction) => void;
	buy: (req: Request, res: Response, next: NextFunction) => void;
	myOrders: (req: Request, res: Response, next: NextFunction) => void;
    

}
