import { IuserLogin, IuserSignUp } from "./types/userSignUp.types"

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
    if (formData.password.trim() == '') {
        err.password = 'Please Provide a Password'
        status = false
    }
    if (formData.confirmPassword.trim() == '') {
        err.confirmPassword = 'Please Provide a ConfirmPassword'
        status = false
    }
    if (formData.password != formData.confirmPassword && formData.confirmPassword.trim() != '') {
        err.confirmPassword = 'Your Password is Matching'
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
    if (formData.password.trim() == '') {
        err.password = 'Please Provide a Password'
        status = false
    }
    return { status, err }
}

export const validateAdminForm = (username: string, password: string) => {
    let err : {username : string , password : string} = {username : '' , password : ''}
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
    if (password.trim() == '') {
        err.password = 'Please Provide a Password'
        status = false
    }
    if (confirmPassword.trim() == '') {
        err.confirmPassword = 'Please Provide a ConfirmPassword'
        status = false
    }
    if (password != confirmPassword && confirmPassword.trim() != '') {
        err.confirmPassword = 'Your Password is Matching'
        status = false
    }
    return { status: status, err }
}