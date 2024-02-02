const express =require("express")
require("dotenv").config()
const db=require("./db/db")
const router=require("./router/router")
const session=require("express-session")
const passport = require('passport');
const GithubStrategy = require("passport-github2").Strategy;
const port=process.env.port
const app=express()
app.use(express.json())
app.use(session({
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: false 

}))
const myModel=require("./model/usermodel")
const userModel = require("./model/usermodel")

app.use(passport.initialize());    
app.use(passport.session()); 
passport.use(new GithubStrategy({
  clientID: process.env.clientID,
  clientSecret: process.env.clientSecret,
  callbackURL: process.env.callbackURL, 
  
},
async(accessToken, refreshToken, profile, done) => { 
 
 const checkuser=await userModel.findOne({username:profile.username})

 if(!checkuser){
const createUser=await userModel.create({
firstname:profile.displayName.split(" ")[0],
lastname:profile.displayName.split(" ")[1],
username:profile.username,
profilePicture:profile.photos[0].value,
isVerified:true


}) 
console.log(checkuser)
return done(null,createUser)
 }
 else{
 
    return done(null, profile);
}

}
 

))



passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((user, done) => {
  done(null, user);
});
app.use(router) 
 
app.listen(port,()=>{
    console.log("server is running on port "+ port)
})
