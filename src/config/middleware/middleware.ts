import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as path from 'path';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import Config from '../env';
import { HttpError } from '../error';
import { sendHttpErrorModule } from '../error/send-http-error';
import { Logger } from 'winston';
import { RotatingFileStream } from 'rotating-file-stream';

const expressWinston: any = require('express-winston');
const rfs: any = require('rotating-file-stream');
const winston: any = require('winston');

function pad(num: number): string {
  return (num > 9 ? '' : '0') + num;
}

function generatorFileName(fileName: string): any {
  return function (time: any, index: number): string {
    if (!time) return `${fileName}-file.log`;

    const month: string = `${time.getFullYear()}-${pad(time.getMonth() + 1)}`;
    const day: string = pad(time.getDate());
    const hour: string = pad(time.getHours());
    const minute: string = pad(time.getMinutes());

    return `${month}/${month}-${day}_${hour}-${minute}-${index}_${fileName}-file.log`;
  };
}

/**
 * @export
 * @param {express.Application} app
 */
export function configure(app: express.Application): void {
  // express middleware
  app.use(
    bodyParser.urlencoded({
      extended: false,
    })
  );
  app.use(bodyParser.json());
  // parse Cookie header and populate req.cookies with an object keyed by the cookie names.
  app.use(cookieParser());
  // returns the compression middleware
  app.use(compression());

  // helps you secure your Express apps by setting various HTTP headers
  app.use(helmet());
  const logger: Logger = new winston.createLogger({
    transports: [
      new winston.transports.File({
        level: 'info',
        filename: './logs/dev-logs.log',
        handleExceptions: true,
        json: true,
        maxsize: 2621440, // 2.5MB
        maxFiles: 10,
        colorize: false,
        eol: ',\r\n',
      }),
      new winston.transports.Console({
        level: 'info',
        handleExceptions: true,
        json: true,
        colorize: false,
        eol: '\r\n',
      }),
    ],
    exitOnError: false,
  });

  winston.stream = {
    write(message: any, encoding: any): void {
      // use the 'info' log level so the output will be picked up by both transports (file and console)
      logger.info(message, encoding);
      logger.debug(message, encoding);
    },
  };
  // create a rotating write stream
  const accessLogStream: RotatingFileStream = rfs.createStream(generatorFileName('access'), {
    interval: '1d', // rotate daily
    path: path.join(`${__dirname}../../../../`, 'logs'),
    size: '5M', // rotate every 10 MegaBytes written,
    initialRotation: true,
  });

  app.use(morgan('combined', { stream: accessLogStream }));
  app.use(morgan('combined', { stream: winston.stream }));

  app.use(expressWinston.logger(logger));

  // custom errors
  app.use(sendHttpErrorModule);

  // CORS option to whitelist domains
  // providing a Connect/Express middleware that can be used to enable COL̥RS with various options
  app.use(
    cors({
      origin: (origin, callback): void => {
        if (!origin || Config.whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
    })
  );

  // cors
  app.use((req: any, res: any, next: any) => {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS ');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With,' + ' Content-Type, Accept,' + ' Authorization,' + ' Access-Control-Allow-Credentials'
    );
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });
}

interface CustomResponse extends express.Response {
  sendHttpError: (error: HttpError | Error, message?: string) => void;
}

/**
 * @export
 * @param {express.Application} app
 */
export function initErrorHandler(app: express.Application): void {
  app.use((error: Error, req: express.Request, res: CustomResponse, next: express.NextFunction) => {
    if (typeof error === 'number') {
      error = new HttpError(error); // next(404)
    }

    if (error instanceof HttpError) {
      res.sendHttpError(error);
    } else {
      if (app.get('env') === 'development') {
        error = new HttpError(500, error.message);
        res.sendHttpError(error);
      } else {
        error = new HttpError(500);
        res.sendHttpError(error, error.message);
      }
    }

    console.error(error);
  });
}
