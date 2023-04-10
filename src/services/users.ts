import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { User, UserSchema, AuthUserSchema, UserInterface } from "../database/models/User";
import { validate } from '../database/models';

dotenv.config();

export class UserService {
  user: UserInterface | null = null;
  requestBody: any = {};

  constructor(body: any, isAuthSchema: boolean) {

    let schema;
    if (isAuthSchema) {
      schema = AuthUserSchema;
    } else {
      schema = UserSchema;
    }

    const isValidateBody = validate(body, schema);
    if (!isValidateBody) {
      throw 'invalid payload request';
    }

    this.requestBody = body;
  }

  async getUserInstance() {

    const user = await User.findOne({ where: { email: this.requestBody.email } });

    if(!user){
      return null;
    }

    const {email, password} = user.dataValues;
    this.user = {email, password};

    return user;
  }

  async authenticateUser() {
    if(!this.user){
      return false;
    }

    const isAuthenticate = bcrypt.compareSync(
      this.requestBody.password,
      this.user.password
    );

    return isAuthenticate;
  }

  async signToken() {
    const token = jwt.sign({
      email: this.user!.email
    }, process.env.JWT_SECRET_KEY as string, {
      "expiresIn": '1h'
    });

    return token;
  }

  static async checkToken(token: string) {
    try {
      const value = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY as string
      );

      return value;

    } catch (err) {
      return {error: "Forbbiden request"};
    }
  }

  static async auth(authHeader: any) {
    if(!authHeader){
      return {error: "Forbbiden request"}
    }
  
    return (await this.checkToken(authHeader.split(' ')[1])) as jwt.JwtPayload;
  }
}