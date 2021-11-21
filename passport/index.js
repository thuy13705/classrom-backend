const passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const userService=require('./../components/users/userService');
const User = require('./../components/users/UserModel');


passport.use(new LocalStrategy(
    async function(username, password, done){
        const user = await userService.checkLogin(username, password);
        if (!user)
            return done(null, false, {message: 'Incorrect username or password.'});
        else{
            return done(null, user);
        }
    }
));

const opts={}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(new JwtStrategy(opts, function(jwt_payload, done){
    return done(null, {id: jwt_payload.id, email: jwt_payload.email});
}));

passport.serializeUser(function(user, done)
{
    console.log(user._id)
    done(null,user._id);
});

passport.deserializeUser(function(id,done)
{
    console.log(id)
    const user=User.findById(id).exec();
    done(null, user);
})


module.exports = passport;