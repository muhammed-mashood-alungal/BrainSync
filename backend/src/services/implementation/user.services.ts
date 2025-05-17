import { Multer } from 'multer';
import { UserRepository } from '../../repositories/implementation/user.repository';
import { IUserService } from '../interface/IUserService';
import { deleteImage, handleUpload } from '../../utils/imageUpload.util';
import { Mongoose, Types, Unpacked } from 'mongoose';
import { createHttpsError, HttpError } from '../../utils/httpError.utils';
import { IMappedUser, IUser } from '../../types/user.types';
import { comparePassword, hashPassword } from '../../utils/bcrypt.util';
import { HttpStatus } from '../../constants/status.constants';
import { HttpResponse } from '../../constants/responseMessage.constants';
import { ISessionActivityRepository } from '../../repositories/interface/ISessionActivity.repository';
import { IUserModel } from '../../models/user.model';
import { IGroupRepository } from '../../repositories/interface/IGroupRepository';
import { mapUsers } from '../../mappers/user.mappers';
import { env } from 'process';
export class UserServices implements IUserService {
  constructor(
    private _userRepository: UserRepository,
    private _sessionActiviesRepo: ISessionActivityRepository,
    private _groupRepo?: IGroupRepository
  ) {}

  async changeProfilePic(
    userId: unknown,
    file: Express.Multer.File
  ): Promise<string> {
    console.log(file);
    const response = await handleUpload(file);

    await this._userRepository.findByIdAndUpdate(userId as Types.ObjectId, {
      $set: { profilePicture: response },
    });
    const imageUrl = `${env.PROFILE_IMAGE_URL}/${userId}`
      
    return imageUrl;
  }
  async getUserData(userId: unknown): Promise<IMappedUser> {
    const userData = await this._userRepository.findById(
      userId as Types.ObjectId
    );
    if (!userData) {
      throw createHttpsError(
        HttpStatus.BAD_REQUEST,
        HttpResponse.USER_NOT_FOUND
      );
    }
    return mapUsers(userData);
  }

  async editUsername(userId: unknown, newName: string): Promise<Boolean> {
    await this._userRepository.findByIdAndUpdate(userId as Types.ObjectId, {
      $set: { username: newName },
    });
    return true;
  }

  async updatePassword(
    userId: unknown,
    oldPass: string,
    newPass: string
  ): Promise<Boolean> {
    const user = await this._userRepository.findById(userId as Types.ObjectId);
    const isMatch = await comparePassword(oldPass, user?.password as string);

    if (!isMatch) {
      throw createHttpsError(
        HttpStatus.UNAUTHORIZED,
        HttpResponse.OLD_PASS_NOT_MATCHED
      );
    }

    const hashedPassword = await hashPassword(newPass);

    await this._userRepository.updatePassword(
      user?.email as string,
      hashedPassword
    );
    return true;
  }
  async getAllStudents(
    skip: unknown,
    limit: unknown,
    searchQuery: string
  ): Promise<{ students: IMappedUser[]; count: number }> {
    const sk = (skip as number) ?? 0;
    const lim = (limit as number) ?? 100;

    const [count, students]: [number, IUserModel[]] = await Promise.all([
      this._userRepository.countStudents(searchQuery),
      this._userRepository.findAllStudents(sk, lim, searchQuery),
    ]);

    return { students: students.map(mapUsers), count };
  }

  async blockOrUnblockUser(id: unknown): Promise<boolean> {
    const stud = await this._userRepository.findById(id as Types.ObjectId);
    if (!stud)
      throw createHttpsError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
    stud.isActive = !stud?.isActive;
    stud.save();
    return true;
  }

  async isStudentsBlocked(id: unknown): Promise<boolean> {
    const stud = await this._userRepository.findById(id as Types.ObjectId);
    return stud?.isActive == false;
  }

  async searchUserByEmail(
    query: string
  ): Promise<{ email: string; _id: Types.ObjectId }[]> {
    return await this._userRepository.searchUserByEmail(query);
  }

  async deleteProfilePic(userId: unknown): Promise<Boolean> {
    const publicId = await this._userRepository.deleteAvatar(
      userId as Types.ObjectId
    );
    if (publicId) {
      await deleteImage(publicId);
    } else {
      throw createHttpsError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.SERVER_ERROR
      );
    }

    return true;
  }

  async getProfilePhoto(userId: unknown): Promise<any> {
    const url = await this._userRepository.getUserProfilePhotoUrl(
      userId as Types.ObjectId
    );
    if (!url) {
      return undefined;
    }
    console.log(url);

    const imageRes = await fetch(url);
    return imageRes;
  }

  async getUserSessionProgress(
    userId: unknown,
    filterBy: string
  ): Promise<{ graph: any[] }> {
    return await this._sessionActiviesRepo.getUserSessionProgress(
      userId as Types.ObjectId,
      filterBy
    );
  }

  async getAllPremiumUsers(): Promise<IMappedUser[]> {
    const students = await this._userRepository.getAllPremiumUsers();
    return students.map(mapUsers);
  }

  async getUserOverallStats(
    userId: unknown
  ): Promise<{
    totalGroups: number;
    totalTimeSpend: string;
    totalSessionsAttended: number;
  }> {
    const totalGroups = (await this._groupRepo?.totalGroupsofUser(
      userId as Types.ObjectId
    )) as number;
    const totalTimeSpend = await this._sessionActiviesRepo.totalTimeSendByUser(
      userId as Types.ObjectId
    );
    const totalSessionsAttended =
      (await this._sessionActiviesRepo.totalSessionAttendedByUser(
        userId as Types.ObjectId
      )) as number;
    return { totalGroups, totalTimeSpend, totalSessionsAttended };
  }
  async totalUsersCount(): Promise<number> {
    return await this._userRepository.getTotalUsersCount();
  }
}
