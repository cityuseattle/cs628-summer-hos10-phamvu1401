import express from 'express';
import cors from 'cors';
import "./loadEnvironment.mjs";
import records from './routes/record.mjs';

import session from "express-session";
import passport from "passport"
import passportFacebook from "passport-facebook"

const FacebookStrategy = passportFacebook.Strategy;
const FACEBOOK_APP_ID = "955526268847909"
const FACEBOOK_APP_SECRET = "4b42069d8927e1017af3ae507f823eba"

passport.use(
    new FacebookStrategy(
      {
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        // Your callback URL
        callbackURL: 'https://orange-space-engine-7r4wp4w79rwhxgp5-5050.app.github.dev/facebook/callback', 
        // Fields you want to access from the user's Facebook profile
        profileFields: ['id', 'displayName', 'email'], 
      },
      async (accessToken, refreshToken, profile, done) => {
        //logic for using accessToken and RefreshToken
        return done(null, profile);
      }
    )
  );
  
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/record", records);

app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Add Passport Facebook routes
app.get('/facebook', passport.authenticate('facebook'));
app.get('/facebook/callback', passport.authenticate('facebook', {
  // Redirect to the main page upon successful login.
  successRedirect: 'https://orange-space-engine-7r4wp4w79rwhxgp5-3000.app.github.dev/home', 
  // Redirect to login page on authentication failure.
  failureRedirect: 'https://orange-space-engine-7r4wp4w79rwhxgp5-5050.app.github.dev/', 
}));

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});