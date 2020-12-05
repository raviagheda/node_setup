import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import * as jwtConfig from '../config/middleware/jwt-auth';
import * as swaggerUi from 'swagger-ui-express';
import AuthRouter from './../components/auth/auth.router';
import UserRouter from './../components/user/user-router';
import { swaggerSpec } from '../config/swagger/swagger';
import SwaggerAuthRouter from '../components/swagger-auth/swagger-auth-router';
import * as jwtSwagger from '../config/middleware/jwt-swagger-auth';
/**
 * @export
 * @param {express.Application} app
 */
export function init(app: express.Application): void {
  const router: express.Router = express.Router();

  /**
   * @description
   *  Forwards any requests to the /v1/users URI to our UserRouter
   *  Also, check if user authenticated
   * @constructs
   */
  app.use('/v1/users', jwtConfig.isAuthenticated, UserRouter);

  /**
   * @description Forwards any requests to the /auth URI to our AuthRouter
   * @constructs
   */
  app.use('/auth', AuthRouter);

  /**
   * @description
   *  If swagger.json file exists in root folder, shows swagger api description
   *  else send commands, how to get swagger.json file
   * @constructs
   */
  app.use('/docs', swaggerUi.serve);
  app.get('/docs', jwtSwagger.isSwaggerAuthenticated, swaggerUi.setup(swaggerSpec));
  app.get('/swagger-login-page', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/swagger-login.html'));
  });
  app.use('/swagger-auth', SwaggerAuthRouter);
  app.get('/swagger', jwtSwagger.isSwaggerAuthenticated, (req: any, res: any) => {
    res.header('Content-Type', 'application/json');
    res.json(swaggerSpec);
  });

  /**
   * @description No results returned mean the object is not found
   * @constructs
   */
  app.use((req, res, next) => {
    res.status(404).send(http.STATUS_CODES[404]);
  });

  /**
   * @constructs all routes
   */
  app.use(router);
}
