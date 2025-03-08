import bcrypt from 'bcryptjs'

export async function  hashPassword(pass:string) {
    const salt = 10
    return await bcrypt.hash(pass , salt)
}

export async function  comparePassword(pass:string,hashedPassword: string) : Promise<boolean> {
    return await bcrypt.compare(pass , hashedPassword)
}