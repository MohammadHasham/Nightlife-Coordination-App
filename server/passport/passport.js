const passport = require("passport");
const TwitterStrategy = require("passport-twitter").Strategy;
const mongoose = require("mongoose");

const Places = mongoose.model("places");

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
Places.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(new TwitterStrategy({
    consumerKey: 'kRK7MJACmqPb1K762KQdW5YVV',
    consumerSecret: 'Yr5SwGUW3n2qmBfg9qgpMOpStK5uTCfujrzrscWcfrqxYhpE5R',
    callbackURL: "/auth/twitter/callback"
  },
  async(accessToken,refreshToken,profile,done)=>{
    const existingUser = await Places.findOne({twitterId: profile.id});
    if(existingUser){
      return done(null,existingUser);
    }
    const user = await new Places({twitterId: profile.id}).save();
    return done(null,user);
  }
));
