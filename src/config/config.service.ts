import { IConfigService } from "./config.service.interface";
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv'
import { ILogger } from "../logger/logger.interface";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";

@injectable()
export class ConfigService implements IConfigService {
    private config: DotenvParseOutput;

    constructor (
        @inject(TYPES.Ilogger) private logger: ILogger
    ){
        const result: DotenvConfigOutput = config();
        if (result.error){
            logger.error('[config service]' + result.error);
        }
        else {
            this.logger.log('[config service] config is load')
            this.config = result.parsed as DotenvParseOutput;
        }
    }
    get (key: string):string {
        return this.config[key];
    }
}