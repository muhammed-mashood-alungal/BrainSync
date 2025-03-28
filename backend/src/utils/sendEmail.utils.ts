import { env } from "../configs/env.config"
import transporter from "../configs/mail.config"

export const sendOtp = async (email: string, otp: string) => {
    try {
        const options = {
            from: "",
            to: email,
            subject: "Brain Sync OTP Verificaiton",
            html: `
                <h1>OTP Verification</h1>
                <p>Your OTP is: ${otp}</p>
                <p>Use this OTP to verify your email. Do not share it with anyone.</p><br />
                <p>If you did not request this verification, you can ignore this email.</p>
                <p>--- Brain Sync</p>
                  `,
        }
        await transporter.sendMail(options)
    } catch (error) {
        throw new Error("Error Sending otp email")
    }
}

export const sendResetLink = async (email: string, token: string) => {
    try {
        const RESET_URL = `${env.CLIENT_RESET_URL}?token=${token}`
        const options = {
            from: "",
            to: email,
            subject: "Brain Sync Reset Password",
            html: `
                <h1>Reset Password</h1>
                <p>Your link is: ${RESET_URL}</p>
                <p>Use this link to reset your password. Do not share it with anyone.</p><br />
                <p>If you did not request this verification, you can ignore this email.</p>
                <p>--- Brain Sync</p>
                  `,
        }
        await transporter.sendMail(options)
    } catch (error) {
        throw new Error("Error Sending otp email")
    }
}


export const sendSessionLinktoAttendees = async (emails: string[], sessionName: string, sessionLink: string, startTime: Date, endTime: Date) => {
    try {
        const allEmails = emails.map((email) => {
            const options = {
                from: "",
                to: email,
                subject: "You Are Invited ✉️ !!!",
                html: `
                    <h1>Invitation to Session ${sessionName}</h1>
                    <p><b>Your Session Link is: ${sessionLink}</b></p>
                    <p>Start : ${startTime.toLocaleTimeString()} &nbsp; &nbsp;
                     End : ${endTime.toLocaleTimeString()} 
                    </p>
                    <p>Please Enter to the session at time using the provided link or etering the code . Thank you !</p>
                    <p>--- Brain Sync</p>
                      `,
            }
            return transporter.sendMail(options)
        })
        await Promise.all(allEmails)


    } catch (error) {
        console.log(error)
        throw new Error("Error Sending otp email")
    }
} 