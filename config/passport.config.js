const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.model");
const { USER_ROLE, USER_STATUS } = require("../utils/constants");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || "DEFAULT_GOOGLE_CLIENT_ID",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "DEFAULT_GOOGLE_CLIENT_SECRET",
            callbackURL: process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback"
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
                if (!email) {
                    return done(new Error("No email associated with this Google account"), null);
                }

                let user = await User.findOne({ email });
                if (!user) {
                    user = await User.create({
                        name: profile.displayName || profile.name?.givenName || "Google User",
                        email: email,
                        googleId: profile.id,
                        userRole: USER_ROLE.customer,
                        userStatus: USER_STATUS.approved
                    });
                } else if (!user.googleId) {
                    user.googleId = profile.id;
                    await user.save();
                }

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

module.exports = passport;
