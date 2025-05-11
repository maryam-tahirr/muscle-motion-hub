
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback',
            proxy: true
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists
                const existingUser = await User.findOne({ googleId: profile.id });
                
                if (existingUser) {
                    return done(null, existingUser);
                }
                
                // Check if email already exists
                const userWithEmail = await User.findOne({ email: profile.emails[0].value });
                
                if (userWithEmail) {
                    // Link Google ID to existing account
                    userWithEmail.googleId = profile.id;
                    if (!userWithEmail.profilePicture && profile.photos && profile.photos.length > 0) {
                        userWithEmail.profilePicture = profile.photos[0].value;
                    }
                    await userWithEmail.save();
                    return done(null, userWithEmail);
                }
                
                // Create new user
                const newUser = await new User({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    profilePicture: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '',
                    isAdmin: false
                }).save();
                
                done(null, newUser);
            } catch (error) {
                console.error('Google auth error:', error);
                done(error, null);
            }
        }
    )
);

module.exports = passport;
