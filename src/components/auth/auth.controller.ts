import HttpError from '../../config/error';
import { NextFunction, Request, Response } from 'express';
import AuthDAO from './auth.dao';
/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function signup(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = req.body;

    if (!body.email || !body.password) {
      throw new Error('Email And Password Are Required');
    }

    const result = await AuthDAO.signup(body);

    res.json({ message: 'signup successfully', token: result });
  } catch (error) {
    console.log(error);
    if (error.code === 500) {
      return next(new HttpError(error.message.status, error.message));
    }
    res.json({
      status: 400,
      message: error.message,
    });
  }
}

/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise < void >}
 */
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = req.body;

    if (!body.email || !body.password) {
      throw new Error('Email And Password Are Required');
    }

    const token: any = await AuthDAO.login(body);
    const expiresIn: any = 60 * 60 * 3 * 1000;
    const options: any = { maxAge: expiresIn, httpOnly: true };

    res.cookie('token', token, options);

    res.json({ token, expiresIn });
  } catch (error) {
    if (error.code === 500) {
      return next(new HttpError(error.message.status, error.message));
    }

    res.json({
      status: 400,
      message: error.message,
    });
  }
}
