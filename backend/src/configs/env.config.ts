export const env = {
   get PORT(){
     return process.env.PORT
   },
   get CLIENT_ORIGIN(){
      return process.env.CLIENT_ORIGIN
   },
   get MONGO_URI(){ 
    return process.env.MONGO_URI
   },
   get NODEMAILER_PASSKEY(){
      return process.env.NODEMAILER_PASSKEY
   },
   get SENDER_EMAIL(){
      return process.env.SENDER_EMAIL
   },
   get REDIS_HOST(){
      return process.env.REDIS_HOST
   },
   get JWT_ACCESS_KEY(){
      return process.env.JWT_ACCESS_KEY
   },
   get JWT_REFRESH_KEY(){
      return process.env.JWT_REFRESH_KEY
   }
}