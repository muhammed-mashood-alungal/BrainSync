import { JwtPayload } from 'jsonwebtoken';
import { redisClient } from '../../configs/redis.config';
import { HttpResponse } from '../../constants/responseMessage.constants';
import { HttpStatus } from '../../constants/status.constants';
import { IUserModel } from '../../models/user.model';
import { IUserRepository } from '../../repositories/interface/IUserRepository';
import { IMappedSessionUserData, IUser } from '../../types/user.types';
import { comparePassword, hashPassword } from '../../utils/bcrypt.util';
import generateOtp from '../../utils/generate-otp.util';
import { createHttpsError } from '../../utils/httpError.utils';
import {
  generateAccesToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../../utils/jwt.util';
import { sendOtp, sendResetLink } from '../../utils/sendEmail.utils';
import { IAuthService } from '../interface/IAuthService';
import { v4 as uuidv4 } from 'uuid';
import { mapUserSessionData } from '../../mappers/user.mappers';

export class AuthService implements IAuthService {
  constructor(private _userRepository: IUserRepository) {}

  async signup(user: IUser): Promise<string> {
    const isUserExist = await this._userRepository.findUserByEmail(user.email);

    if (isUserExist) {
      throw createHttpsError(HttpStatus.CONFLICT, HttpResponse.USER_EXIST);
    }

    user.password = await hashPassword(user.password as string);

    const otp = generateOtp();
    await sendOtp(user.email, otp);
    const response = await redisClient.set(
      user.email,
      JSON.stringify({
        ...user,
        otp,
      }),
      { EX: 300 }
    );

    if (!response) {
      throw createHttpsError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.SERVER_ERROR
      );
    }
    return user.email;
  }

  async signin(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this._userRepository.findUserByEmail(email);
    if (!user) {
      throw createHttpsError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
    }
    if (!user.isActive) {
      throw createHttpsError(HttpStatus.FORBIDDEN, HttpResponse.USER_BLOCKED);
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      throw createHttpsError(
        HttpStatus.UNAUTHORIZED,
        HttpResponse.INVALID_CREDENTIALS
      );
    }

    const payload = { id: user._id, role: user.role, email: user.email };

    const accessToken = generateAccesToken(payload);
    const refreshToken = generateRefreshToken(payload);
    return { accessToken, refreshToken };
  }
  async verifyOtp(
    otp: string,
    email: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const storedDataString = await redisClient.get(email as string);

    if (!storedDataString) {
      throw createHttpsError(HttpStatus.NOT_FOUND, HttpResponse.OTP_EXPIRED);
    }

    const storedData = JSON.parse(storedDataString);

    if (storedData.otp != otp) {
      throw createHttpsError(
        HttpStatus.BAD_REQUEST,
        HttpResponse.OTP_INCORRECT
      );
    }

    const user = {
      username: storedData.username,
      email: storedData.email,
      password: storedData.password,
      role: 'student',
    };
    const newUser = await this._userRepository.createUser(user as IUserModel);
    await redisClient.del(email);
    if (!newUser)
      throw createHttpsError(
        HttpStatus.CONFLICT,
        HttpResponse.USER_CREATION_FAILED
      );
    const payload = {
      id: newUser._id,
      role: newUser.role,
      email: newUser.email,
    };

    const accessToken = generateAccesToken(payload);
    const refreshToken = generateRefreshToken(payload);
    return { accessToken, refreshToken };
  }
  async resendOtp(email: string): Promise<string> {
    const otp = generateOtp();
    await sendOtp(email, otp);

    let storedDataString = await redisClient.get(email as string);

    const storedData = JSON.parse(storedDataString as string);
    const response = await redisClient.set(
      email,
      JSON.stringify({
        ...storedData,
        otp: otp,
      }),
      { EX: 300 }
    );

    if (!response) {
      throw createHttpsError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.SERVER_ERROR
      );
    }

    return email;
  }
  async refreshAccessToken(
    token: string
  ): Promise<{ newAccessToken: string; payload: JwtPayload }> {
    if (!token) {
      throw createHttpsError(HttpStatus.NOT_FOUND, HttpResponse.NO_TOKEN);
    }

    const decoded = verifyRefreshToken(token) as JwtPayload;
    if (!decoded) {
      throw createHttpsError(HttpStatus.NOT_FOUND, HttpResponse.TOKEN_EXPIRED);
    }
    const user = await this._userRepository.findUserByEmail(
      decoded.email as string
    );

    if (!user?.isActive) {
      throw createHttpsError(HttpStatus.FORBIDDEN, HttpResponse.USER_BLOCKED);
    }

    const payload = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
    };

    const newAccessToken = generateAccesToken(payload);

    return { newAccessToken, payload };
  }
  async authMe(token: string): Promise<IMappedSessionUserData | undefined> {
    const decoded = verifyAccessToken(token) as JwtPayload;

    if (!decoded) {
      throw createHttpsError(HttpStatus.NOT_FOUND, HttpResponse.TOKEN_EXPIRED);
    }

    const user = await this._userRepository.findUserByEmail(
      decoded.email as string
    );
    if (!user) {
      throw createHttpsError(HttpStatus.NOT_FOUND, HttpResponse.TOKEN_EXPIRED);
    }
    if (!user.isActive) {
      throw createHttpsError(HttpStatus.FORBIDDEN, HttpResponse.USER_BLOCKED);
    }
    return mapUserSessionData(user);
  }
  generateTokens(user: IUserModel): {
    accessToken: string;
    refreshToken: string;
  } {
    const payload = { id: user._id, email: user.email, role: user.role };
    const accessToken = generateAccesToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }
  async forgotPassword(email: string): Promise<void> {
    const isExist = await this._userRepository.findUserByEmail(email);

    if (!isExist) {
      throw createHttpsError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
    }
    const resetToken = uuidv4();

    const response = await redisClient.set(resetToken, email, { EX: 300 });
    if (!response) {
      throw createHttpsError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.SERVER_ERROR
      );
    }

    await sendResetLink(email, resetToken);
  }
  async resetPassword(token: string, password: string): Promise<Boolean> {
    const email = await redisClient.get(token);
    if (!email) {
      throw createHttpsError(
        HttpStatus.NOT_FOUND,
        HttpResponse.RESET_PASS_FAILED
      );
    }
    const hashedPassword = await hashPassword(password);

    await this._userRepository.updatePassword(email, hashedPassword);

    return true;
  }
}
