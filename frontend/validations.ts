import { stat } from "fs"
import { IuserLogin, IuserSignUp } from "./types/userSignUp.types"
import { IUserType } from "./types/userTypes"
import { ISessionTypes } from "./types/sessionTypes"
import { IPlanError, IPlans } from "./types/plans.types"

export const    validateSignUpForm = (formData: IuserSignUp) => {
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
    if (formData.password.trim() == '' || !passReg.test(formData.password)) {
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

    if (formData.password.trim() == '' || !passReg.test(formData.password)) {
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
    return { status: status, err }

}

export const validateSessionForm = (formData: Partial<ISessionTypes>): { status: Boolean, errors: Partial<ISessionTypes> } => {
    const errors: Partial<ISessionTypes> = {
        sessionName: '',
        subject: '',
        date: '',
        startTime: '',
        endTime: '',
        groupId: ''
    }

    let status = true

    if (!formData?.sessionName?.trim()) {
        errors.sessionName = "Session name is required."
        status = false
    }


    if (!formData?.subject?.trim()) {
        errors.subject = "Subject is required.";
        status = false
    }

   
    const currentDate = new Date().toISOString().split("T")[0]; // Get today's date (YYYY-MM-DD)
    if (!formData.date) {
        errors.date = "Date is required.";
        status = false
    } else if (formData.date < currentDate) {
        errors.date = "Date must be in the future.";
        status = false
    }

    // Validate time (should not be empty)
    if (!formData.startTime) {
        errors.startTime = "Start Time is required.";
        status = false
    }
    
    if (formData?.startTime) {
        const currentDate = new Date()
        const [hours, minutes] = (formData.startTime as string).split(":").map(Number)

        const selectedStartTime = new Date(formData.date as Date)
        selectedStartTime.setHours(hours, minutes, 0, 0)

        if (selectedStartTime.getTime() < currentDate.getTime() && currentDate.toISOString().split("T")[0] == formData.date) {
            errors.startTime = "Start Time Cannot be in the Past."
            status = false;
        }
    }

    if (!formData.endTime) {
        errors.endTime = "End Time is required."
        status = false
    }
    if (formData?.startTime && formData.endTime && formData?.startTime > formData.endTime) {
        errors.endTime = "Start Time Should be before end Time."
        status = false
    }
    if (formData?.endTime && formData.startTime && formData?.endTime < formData.startTime) {
        errors.endTime = "End Time Should Not Before Starting Time."
        status = false
    }

    if (!formData.groupId) {
        errors.groupId = "Group selection is required."
        status = false
    }

    return { status, errors }
};


  
  export const validatePlanForm = (plan: Omit<IPlans, '_id'>) => {
    let err: IPlanError = {
      name: '',
      offerPrice: '',
      orginalPrice : '',
      interval: '',
      features: [],
      isActive: '',
      isHighlighted: '',
    }
  
    let status = true
  
    if (plan.name.trim() === '') {
      err.name = 'Please provide a plan name'
      status = false
    }
    if (isNaN(plan.orginalPrice) || plan.orginalPrice <= 0) {
        err.orginalPrice = 'Original Price must be a number greater than 0'
        status = false
      }
  
    if (isNaN(plan.offerPrice) || plan.offerPrice <= 0) {
      err.offerPrice = 'Offer Price must be a number greater than 0'
      status = false
    }
    
    if(Number(plan?.offerPrice) > Number(plan?.orginalPrice)){
        err.offerPrice  = 'Offer Price cannot be greater than Orginal Price'
        status = false
    }
  
    if (!['monthly', 'yearly'].includes(plan.interval)) {
      err.interval = 'Billing interval must be either "monthly" or "yearly"'
      status = false
    }
  
    // Features validation
    if (!Array.isArray(plan.features)) {
      err.features = []
      status = false
    } else {
      err.features = plan.features.map((feature) => {
        const featureError = { title: '', description: '' }
  
        if (feature.title.trim() === '') {
          featureError.title = 'Feature title is required'
          status = false
        }
  
        if (feature.description.trim() === '') {
          featureError.description = 'Feature description is required'
          status = false
        }
  
        return featureError
      })
    }
  
    return { status, err }
  }