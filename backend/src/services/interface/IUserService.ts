import { Types } from 'mongoose';
import { IMappedUser, IUser } from '../../types/user.types';
import { IUserModel } from '../../models/user.model';
import { ISubjectStudyTime } from '../../types/sessionActivity.types';

export interface IUserService {
  changeProfilePic(
    userId: unknown,
    fileUrl: Express.Multer.File
  ): Promise<string>;

  getUserData(userId: unknown): Promise<IMappedUser>;

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
  ): Promise<{ students: IMappedUser[]; count: number }>;

  blockOrUnblockUser(id: unknown): Promise<boolean>;

  isStudentsBlocked(id: unknown): Promise<boolean>;
  deleteProfilePic(userId: unknown): Promise<Boolean>;
  getUserSessionProgress(userId : unknown , filterBy : string) : Promise<{graph : any[]}>
  getUserTimeBySubject(userId : unknown , filterBy : string) : Promise<ISubjectStudyTime[]>
  getAllPremiumUsers():Promise<IMappedUser[]>
  getUserOverallStats(userId : unknown) : Promise<{totalGroups : number , totalTimeSpend : string , totalSessionsAttended : number}>
  totalUsersCount(): Promise<number>
  getProfilePhoto(userId : unknown ): Promise<any>
}
