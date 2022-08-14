import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import { ILogger } from "../logger/logger.interface";
import { TYPES } from "../types";
import {LoggerService} from '../logger/logger.service'

@injectable()
export class PrismaService {

     client: PrismaClient;

    constructor (
        @inject(TYPES.Ilogger) private logger: ILogger
    ) {
        this.client = new PrismaClient()
    }

    async connect(): Promise<void> {
        try {
        await this.client.$connect();
        this.logger.log('database connected!') 
        } catch (e){
            this.logger.error(e)
        }

    }

    async disconnect(): Promise<void> {
        await this.client.$disconnect();
    }
}
