require("dotenv").config()
const axios = require('axios');

const router=require("express").Router()
const{createUser,socialAuth}=require("../controller/userController")
const users=require("../model/usermodel")

router.get("/",async(req,res)=>{
  try { 
    
    if (req.session.user) {
      const email=req.session.user.username            
const user=await users.findOne({username:email})  
if(!user){
 return res.json("user not registered")
}else{ res.json(` Helllo  ${user.firstname } ${user.lastname },. Welcometo my api`);}

       
      } else {
        res.status(401).json('You are not logged in,Kindly log in to perform this action');
      }  
  } catch (error) {
    res.json(error.message)
  }
     
})   
router.post("/signup",createUser) 

//gith login method 1

// router.get("/githublogin",async(req,res)=>{ 
//   res.redirect("http://127.0.0.1:4455/auth/github")
// })


//router.get("/auth/google/callback",callBack)

// router.get("/auth/github/",socialAuth)

// router.get('/auth/github/callback', async (req, res) => {

//   const code = req.query.code;
//   console.log(code)
//   try { 
//     const response = await axios.post('https://github.com/login/oauth/access_token', {
//       client_id: process.env.ClientID,
//       client_secret: process.env.clientsecret,
//       code: code,
//     }, {
//       headers: {
//         Accept: 'application/json',
//       },
//     });
// console.log(response.data)
//     const accessToken = response.data.access_token;

//     const userResponse = await axios.get('https://api.github.com/user', {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     const user = userResponse.data;

//     console.log('GitHub User:', userResponse);

//     res.json('GitHub authentication successful!');

//   } catch (error) {
//     console.error('Error exchanging code for access token:', error.message);
//     res.status(500).send('Error during GitHub authentication.');
//   }
// });




//method 2 ("Not adviseable as it doesnt return github token and as such troubles erver")

const passport=require("passport")

router.get('/githublogIn', async (req, res) => {
  res.redirect("http://localhost:4455/auth/github")

})

// GitHub login route
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub callback route
router.get('/auth/github/callback',
passport.authenticate('github', { 
  successRedirect: "/auth/github/success",
  failureRedirect: "/auth/github/failure"  
}));
router.get("/auth/github/success", (req, res) => {
 
 
  const username = req.user.username;
   console.log(username)

  req.session.user = {username};
  // console.log(req.session.user)
  res.json("user authenticated with github") })

  
module.exports=router  