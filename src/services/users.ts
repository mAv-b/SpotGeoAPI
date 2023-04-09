import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { User, UserInterface } from "../database/models/User";

dotenv.config();

export class UserService {
  user: UserInterface | null = null;
  bodyEmail: string;
  bodyPassword: string;

  constructor(email: string, password: string) {
    this.bodyEmail = email;
    this.bodyPassword = password;
  }

  async getUserInstance() {
    const user = await User.findOne({ where: { email: this.bodyEmail } });

    if(!user){
      return null;
    }

    const {email, password} = user.dataValues;
    this.user = {email, password};

    return user;
  }

  async authorizationUser() {
    if(!this.user){
      return false;
    }

    const isAuthorizate = bcrypt.compareSync(this.bodyPassword, this.user.password);
    return isAuthorizate;
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
      return {error: "invalid token."};
    }
  }
}