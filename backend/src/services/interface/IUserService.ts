import { Types } from 'mongoose';
import { IUser } from '../../types/user.types';

export interface IUserService {
  changeProfilePic(
    userId: unknown,
    fileUrl: Express.Multer.File
  ): Promise<Boolean>;

  getUserData(userId: unknown): Promise<Omit<IUser, 'password'> | null>;

  editUsername(userId: unknown, newName: string): Promise<Boolean>;

  updatePassword(
    userId: unknown,
    oldPass: string,
    newPass: string
  ): Promise<Boolean>;

  getAllStudents(
    skip: unknown,
    limit: unknown,
    searchQuery: string
  ): Promise<{ students: IUser[]; count: number }>;

  blockOrUnblockUser(id: unknown): Promise<boolean>;

  isStudentsBlocked(id: unknown): Promise<boolean>;

  searchUserByEmail(
    query: string
  ): Promise<{ email: string; _id: Types.ObjectId }[]>;

  deleteProfilePic(userId: unknown): Promise<Boolean>;
  getUserSessionProgress(userId : unknown , filterBy : string) : Promise<{graph : any[]}>
}
