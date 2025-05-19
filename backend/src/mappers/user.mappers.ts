import { env } from '../configs/env.config';
import { IUserModel } from '../models/user.model';
import { IMappedSessionUserData, IMappedUser } from '../types/user.types';

export const mapUsers = (user: IUserModel): IMappedUser => {
  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    isActive: user.isActive ? true : false,
    role: user.role,
    createdAt: user.createdAt,
    profilePicture: user.profilePicture?.url
      ? `${env.PROFILE_IMAGE_URL}/${user._id}`
      : '',
    subscription: user.subscription,
    googleId: user.googleId,
  };
};

export const mapUserSessionData = (
  user: IUserModel
): IMappedSessionUserData => {
  return {
    id: user._id,
    role: user.role,
    username : user.username,
    email: user.email,
    isPremiumMember: user?.subscription?.isActive ? true : false,
    profilePicture: user.profilePicture?.url
      ? `${env.PROFILE_IMAGE_URL}/${user._id}`
      : '',
  };
};
