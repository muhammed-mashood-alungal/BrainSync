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
    return {status ,err}
}

export const validateLoginForm = (formData: IuserLogin) => {
    let err: IuserLogin = { email: '', password: ''}
    let status = true
    if (formData.email.trim() == '') {
        err.email = 'Please Provide a Email'
        status = false
    }
    if (formData.password.trim() == '') {
        err.password = 'Please Provide a Password'
        status = false
    }
    return {status ,err}
}