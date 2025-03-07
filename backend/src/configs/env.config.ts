export const env = {
   get PORT(){
     return process.env.PORT
   },
   get CLIENT_ORIGIN(){
      return process.env.CLIENT_ORIGIN
   },
   get MONGO_URI(){
    return process.env.MONGO_URI
   }
}