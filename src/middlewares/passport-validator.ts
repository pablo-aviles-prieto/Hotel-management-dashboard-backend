import passport from 'passport';

export const passportValidator = passport.authenticate('jwt', { session: false });
