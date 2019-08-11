import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { doesNotReject } from 'assert';
import { prisma } from '../generated/prisma-client';

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

async function verifyUser(payload, done) {
  try {
    const user = await prisma.user({ id: payload.id });
    if (user !== null) {
      return done(null, user);
    } else {
      return doesNotReject(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
}

export function authenticateJwt(req, res, next) {
  return passport.authenticate('jwt', { sessions: false }, function(error, user) {
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);
}

passport.use(new Strategy(jwtOptions, verifyUser));
passport.initialize();
