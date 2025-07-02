import { NextFunction, Request, Response } from 'express';
import authService from '../services/auth-service';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from '../utils/schemas/auth-schema';
import bcrypt from 'bcrypt';
import { RegisterDTO } from '../dtos/auth-dtos';
import userService from '../services/user-service';
import jwt from 'jsonwebtoken';
import { transporter } from '../libs/nodemailer';

class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/LoginDTO"
                    }  
                }
            }
        } 
    */

    try {
      const body = req.body;
      const { email, password } = await loginSchema.validateAsync(body);
      const user = await userService.getUserByEmail(email);

      if (!user) {
        res.status(404).json({
          message: 'email/password is wrong',
        });
        return;
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        res.status(404).json({
          message: 'email/password is wrong',
        });
        return;
      }

      const jwtSecret = process.env.JWT_SECRET || '';

      const token = jwt.sign(
        {
          id: user.id,
        },
        jwtSecret,
        {
          expiresIn: '1h',
        },
      );

      res.cookie('token', token, {
        httpOnly: true,       // ⬅ cookie tidak bisa diakses oleh JS (aman)
        secure: false,        // ⬅ false untuk dev, true kalau pakai HTTPS
        sameSite: 'lax',      // ⬅ aman dan tetap bekerja di dev LAN
        maxAge: 1000 * 60 * 60, // ⬅ 1 jam
      });

      const { password: unusedpassword, ...userResponse } = user;
      res.status(200).send({
        message: 'Login success',
        data: { token, user: userResponse },
      });
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/RegisterDTO"
                    }  
                }
            }
        } 
    */

    try {
      const body = req.body;

      const validated = await registerSchema.validateAsync(body);
      const hashedpassword = await bcrypt.hash(validated.password, 10);
      const registerBody: RegisterDTO = {
        ...validated,
        password: hashedpassword,
      };

      const user = await authService.register(registerBody);
      res.status(200).json({
        message: 'Register success',
        data: { ...user },
      });
    } catch (error) {
      next(error);
    }
  }

  async check(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = (req as any).user;
      const user = await userService.getUserById(payload.id);
      const followersCount = user?.followers.length;
      const followingsCount = user?.followings.length;
      const newUser = {
        ...user,
        followersCount,
        followingsCount,
      };

      if (!user) {
        res.status(404).json({
          message: 'User not found',
        });
        return;
      }

      const { password: unusedpassword, ...userResponse } = newUser;
      res.status(200).json({
        message: 'User check success',
        data: { ...newUser },
      });
    } catch (error) {
      next(error);
    }
  }
  async forgot(req: Request, res: Response, next: NextFunction) {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/ForgotPasswordDTO"
                    }  
                }
            }
        } 
    */

    try {
      const body = req.body;
      const { email } = await forgotPasswordSchema.validateAsync(body);
      const jwtSecret = process.env.JWT_SECRET || '';
      const token = jwt.sign({ email }, jwtSecret, {
        expiresIn: '1 day',
      });

      const frontend = process.env.FRONTEND_BASE_URL || '';
      const resetPasswordLink = `${frontend}/reset-password?token=${token}`;

      const mailOptions = {
        from: 'endranio576@gmail.com',
        to: email,
        subject: 'Circle | Forgot Password',

        html: `<h1>this link nya</h1>
      <a href="${resetPasswordLink}">${resetPasswordLink}/>`,
      };
      await transporter.sendMail(mailOptions);

      await userService.getUserByEmail(email);
      res.status(201).json({
        message: 'forgot password link send',
      });
    } catch (error) {
      next(error);
    }
  }
  async reset(req: Request, res: Response, next: NextFunction) {
    /*  #swagger.requestBody = {
    required: true,
    content: {
        "application/json": {
            schema: {
                $ref: "#/components/schemas/ResetPasswordDTO"
            }  
        }
    }
} 
*/

    try {
      const payload = (req as any).user;
      const body = req.body;
      const { confirmpassword, newpassword } =
        await resetPasswordSchema.validateAsync(body);
      const user = await userService.getUserByEmail(payload.email);

      // if (oldpassword === newpassword) {
      //   res.status(400).json({
      //     message: "Password canot same",
      //   });
      //   return;
      // }

      if (!user) {
        res.status(404).json({
          message: 'User not found',
        });
        return;
      }

      // const isOldPasswordCorect = await bcrypt.compare(
      //   oldpassword,
      //   user.password,
      // );
      const isOldPasswordCorect = confirmpassword === newpassword;
      if (!isOldPasswordCorect) {
        res.status(404).json({
          message: 'Password must be same',
        });
        return;
      }

      const hashedNewPassword = await bcrypt.hash(newpassword, 10);
      const { password, ...updatedUserPassword } =
        await authService.resetPassword(user.email, hashedNewPassword);
      res.status(200).json({
        message: 'Reset password success!',
        data: { ...updatedUserPassword },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
