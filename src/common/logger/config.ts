import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

export const APP_WINSTON_CONFIG = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike(),
      ),
    }),
    new winston.transports.File({
      filename: 'combined.log',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
        winston.format.printf(
          (info) => `[${info.timestamp}] ${info.level}: ${info.message}`,
        ),
      ),
    }),
  ],
};
