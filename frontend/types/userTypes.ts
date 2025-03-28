
export interface IUserType {
    _id: string;
    username: string;
    email: string;
    password: string;
    googleId:string;
    role: 'student' | 'admin';
    isAcitve: Boolean;
    profilePicture?: {
        url :string , 
        publicId : string
    };
    createdAt: Date | string;
    updatedAt: Date | string;
} 