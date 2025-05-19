
export interface IUserType {
    _id: string;
    username: string;
    email: string;
    password: string;
    googleId:string;
    role: 'student' | 'admin';
    isActive: Boolean;
    profilePicture?: string;
    subscription?: {
    planId : string,
    isActive : boolean
  }
    createdAt: Date | string;
    updatedAt: Date | string;
} 

export interface IDecodedUserType{
    id : string,
    email : string,
    username : string,
    role : string,
    isPremiumMember? : boolean
    profileImg? :string
    profilePicture?:string
}

