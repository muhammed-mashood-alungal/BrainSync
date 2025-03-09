export interface IuserLogin {
    email : string ,
    password : string 
}
export interface IuserSignUp extends IuserLogin {
    username : string ,
    confirmPassword : string
}