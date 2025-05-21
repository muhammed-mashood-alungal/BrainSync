import dotenv from 'dotenv';
dotenv.config(); 

export const env = {
  get PORT() {
    return process.env.PORT;
  },
  get CLIENT_ORIGIN() {
    return process.env.CLIENT_ORIGIN;
  },
  get MONGO_URI() {
    return process.env.MONGO_URI;
  },
  get NODEMAILER_PASSKEY() {
    return process.env.NODEMAILER_PASSKEY;
  },
  get SENDER_EMAIL() {
    return process.env.SENDER_EMAIL;
  },
  get REDIS_HOST() {
    return process.env.REDIS_HOST;
  },
  get JWT_ACCESS_KEY() {
    return process.env.JWT_ACCESS_KEY;
  },
  get JWT_REFRESH_KEY() {
    return process.env.JWT_REFRESH_KEY;
  },
  get CLIENT_ID() {
    return process.env.CLIENT_ID;
  },
  get CLIENT_SECRET() {
    return process.env.CLIENT_SECRET;
  },
  get CLIENT_RESET_URL() {
    return process.env.CLIENT_RESET_URL;
  },
  get CLOUD_NAME() {
    return process.env.CLOUD_NAME;
  },
  get CLOUD_API_KEY() {
    return process.env.CLOUD_API_KEY;
  },
  get CLOUD_API_SECRET() {
    return process.env.CLOUD_API_SECRET;
  },
  get SESSION_SECRET() {
    return process.env.SESSION_SECRET;
  },
  get SHARED_CALENDAR_ID() {
    return process.env.SHARED_CALENDAR_ID;
  },
  get RAZORPAY_SECRET_KEY() {
    return process.env.RAZORPAY_SECRET_KEY;
  },
  get RAZORPAY_KEY_ID() {
    return process.env.RAZORPAY_KEY_ID;
  },
  get FIREBASE_API_KEY() {
    return process.env.FIREBASE_API_KEY;
  },
  get FIREBASE_DATABASE_URL() {
    return process.env.FIREBASE_DATABASE_URL;
  },
  get FIREBASE_AUTH_DOMAIN() {
    return process.env.FIREBASE_AUTH_DOMAIN;
  },
  get FIREBASE_PROJECT_ID() {
    return process.env.FIREBASE_PROJECT_ID;
  },
  get FIREBASE_STORAGE_BUCKET() {
    return process.env.FIREBASE_STORAGE_BUCKET;
  },
  get FIREBASE_MESSSAGE_SENDER_ID() {
    return process.env.FIREBASE_MESSSAGE_SENDER_ID;
  },
  get FIREBASE_APP_ID() {
    return process.env.FIREBASE_APP_ID;
  },
  get FIREBASE_MEASUREMENT_ID() {
    return process.env.FIREBASE_MEASUREMENT_ID;
  },
  get REDIS_PORT(){
    return process.env.REDIS_PORT
  },
  get REDIS_USERNAME(){
    return process.env.REDIS_USERNAME
  },
  get REDIS_PASSWORD(){
    return process.env.REDIS_PASSWORD
  },
  get NODE_ENV(){
    return process.env.NODE_ENV
  },
  get API_BASE_URL(){
    return process.env.API_BASE_URL
  },
  get PROFILE_IMAGE_URL(){
    return process.env.PROFILE_IMAGE_URL
  },
  get PUPPETEER_EXECUTABLE_PATH(){
    return process.env.PUPPETEER_EXECUTABLE_PATH
  }
};
