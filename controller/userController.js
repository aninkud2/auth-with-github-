const userModel=require("../model/usermodel")
const Joi=require("joi")
const bcrypt=require("bcrypt")
exports.createUser=async(req,res)=>{

    try {
        const userSchema = Joi.object({
            firstname: Joi.string().min(3).max(30).required().regex(/^[a-zA-Z]+$/) .messages({
                'string.pattern.base': 'first name should contain only alphabets.',
              }),
            lastname: Joi.string().min(3).max(30).required().regex(/^[a-zA-Z]+$/) .messages({
                'string.pattern.base': 'last name should contain only alphabets.',
              }),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().messages({
                'string.pattern.base': 'password can only contain a-z min of 3 max of 30',
              }),
          });
        
    
    
    const encryptedPassword= await bcrypt.hashSync(req.body.password,  bcrypt.genSaltSync(10) )

     const data={
         firstname:req.body.firstname,
         lastname:req.body.lastname,
         email:req.body.email.toLowerCase(),
         password:req.body.password}

         const { error }=  userSchema.validate(data);
         if(error){
            return res.json( error.details[0].message)
         }
       
         data.password=encryptedPassword

         const newUser=await userModel.create(data)
         res.status(200).json({
            Status:true,
            newUser

         })
 
        
    } catch (error) {
        res.json(error.message)
    }

}


exports.login=async(req,res)=>{
    try {
        const email=req.body.email
        const findUser=await userModel.findOne({email})
        if(!findUser){
            return res.status(400).json("User doesnt exist")
        }
        const checkpassword=await bcrypt.compare(req.body.password,findUser.password)
        if(!checkpassword){
            
            return res.status(400).json("Incorrect password")
        }
        req.session.user={ username: findUser.email }
        res.status(200).json({
            message:"login succesful",
            findUser
        })
    } catch (error) {
        res.status(500).json(error.message)
    }
}



const passport=require("passport")
exports.socialAuth=passport.authenticate("github",{scope:["user:email"]})







