import { stat } from "fs"
import { IuserLogin, IuserSignUp } from "./types/userSignUp.types"
import { IUserType } from "./types/userTypes"

export const validateSignUpForm = (formData: IuserSignUp) => {
    let err: IuserSignUp = { username: '', email: '', password: '', confirmPassword: '' }
    let status = true
    if (formData.username.trim() == "") {
        err.username = 'Please Provide a User Name'
        status = false
    }
    if (formData.email.trim() == '') {
        err.email = 'Please Provide a Email'
        status = false
    }
    const passReg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (formData.password.trim() == '' ||  !passReg.test(formData.password)) {
        err.password = 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).'
        status = false
    }
    if (formData.confirmPassword.trim() == '') {
        err.confirmPassword = 'Please Confirm Your Password'
        status = false
    }
    if (formData.password != formData.confirmPassword && formData.confirmPassword.trim() != '') {
        err.confirmPassword = 'Your Password is NotMatching'
        status = false
    }
    return { status, err }
}

export const validateLoginForm = (formData: IuserLogin) => {
    let err: IuserLogin = { email: '', password: '' }
    let status = true
    if (formData.email.trim() == '') {
        err.email = 'Please Provide a Email'
        status = false
    }
    
    const passReg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    
    if (formData.password.trim() == '' ||  !passReg.test(formData.password)) {
        err.password = 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).'
        status = false
    }
    return { status, err }
}

export const validateAdminForm = (username: string, password: string) => {
    let err: { username: string, password: string } = { username: '', password: '' }
    let status = true
    if (username.trim() == '') {
        err.username = 'Please Provide a Email'
        status = false
    }
    if (password.trim() == '') {
        err.password = 'Please Provide a Password'
        status = false
    }
    return { status, err }
}

export const validateEmail = (email: string) => {
    if (email.trim() == '') {
        return { status: false, err: 'Please Provide a Email' }
    }
    return { status: true, err: '' }
}
export const validateResetPasswords = (password: string, confirmPassword: string) => {
    const err: { password: string, confirmPassword: string } = { password: '', confirmPassword: '' }
    let status = true
       const passReg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (password.trim() == '' || !passReg.test(password)) {
        err.password = 'Please Provide a Password'
        status = false
    }
    if (confirmPassword.trim() == '') {
        err.confirmPassword = 'Please Provide a ConfirmPassword'
        status = false
    }
    if (password != confirmPassword && confirmPassword.trim() != '') {
        err.confirmPassword = 'Your Password is Not Matching'
        status = false
    }
    return { status: status, err }
}

export const validateCreateGroup = (groupName: string, members: IUserType[]) => {
    const err: { groupName: string, members: string } = { groupName: '', members: '' }
    let status = true
    if (groupName.trim() == '') {
        err.groupName = 'Please Provide the a group Name'
        status = false
    }
    if (members.length == 0) {
        err.members = 'Please Atleast add one member to the group.'
        status = false
    }
    return {status : status , err }

}