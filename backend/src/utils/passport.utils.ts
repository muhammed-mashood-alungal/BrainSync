import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserRepository } from '../repositories/implementation/user.repository';
import { env } from '../configs/env.config';
import { Types } from 'mongoose';

const _userRepository = new UserRepository();
const clientID = env.CLIENT_ID as string;
const clientSecret = env.CLIENT_SECRET as string;
const apiBaseUrl = env.API_BASE_URL as string
console.log(env.API_BASE_URL)
passport.use(
  new GoogleStrategy(
    {
      clientID: clientID,
      clientSecret: clientSecret,
     // callbackURL: `${apiBaseUrl}/api/auth/google/callback`,
     callbackURL:`https://api.brainsync.space/api/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await _userRepository.findOrCreateUser(profile);

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: unknown, done) => {
  try {
    const userId = id as Types.ObjectId;
    const user = await _userRepository.findById(userId);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
