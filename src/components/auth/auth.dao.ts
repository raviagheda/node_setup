import { compare, hash } from 'bcrypt';
import { UserInflux } from '../../config/connection/influx';
import { jwtSecret, MEASUREMENTS } from '../../constants/constant';
import * as jwt from 'jsonwebtoken';
import { IUserModel } from './auth.models';

class AuthDAO {
  signup = async (body: IUserModel): Promise<any> => {
    try {
      const user: IUserModel[] = await UserInflux.query(
        `select * from "${MEASUREMENTS.USER}" where email='${body.email}'`
      );

      if (user.length >= 1) {
        throw new Error('User With This Email Already Exists');
      }

      const password = body.password;

      const hashed = await hash(password, 10);

      const result = await UserInflux.writePoints([
        {
          measurement: MEASUREMENTS.USER,
          fields: {
            email: body.email,
            password: hashed,
          },
        },
      ]);

      const createdUser: IUserModel[] = await UserInflux.query(
        `select * from "${MEASUREMENTS.USER}" where email='${body.email}'`
      );

      const token: any = await jwtToken(createdUser[0]);

      return token;
    } catch (error) {
      throw new Error(error);
    }
  };

  login = async (body: IUserModel): Promise<any> => {
    try {
      const user: IUserModel[] = await UserInflux.query(
        `select * from "${MEASUREMENTS.USER}" where email='${body.email}'`
      );

      if (!user.length) {
        throw new Error('User Does not exits with this email id');
      }
      const result = await compare(body.password, user[0].password);

      if (!result) {
        throw new Error('Incorrect Credentials');
      }
      const token: any = await jwtToken(user[0]);

      return token;
    } catch (error) {
      throw new Error(error);
    }
  };
}

export async function jwtToken(user: IUserModel): Promise<String> {
  const token: any = await jwt.sign(
    {
      email: user.email,
      time: user.time,
    },
    jwtSecret,
    { expiresIn: '3h' }
  );

  return token;
}
export default new AuthDAO();
