const User = require('../db/userSchema');
const jwt = require('jsonwebtoken');

const Authenticate = async (req,res,next) => {
    try{
        // console.log('found');
        const token = req.cookies.jwtoken;
        // console.log(token);
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        const rootUser = await User.findOne({_id: verifyToken._id, 'tokens.token':token});
        if(rootUser){
            
        }

        if(!rootUser){throw new Error('User not found');}

        req.token=token;
        req.rootUser=rootUser;
        req.user_id=rootUser._id;
        
        next();
    }
    catch(error){
        res.status(401).json({message:'Unauthorised'});
    }
}

module.exports = Authenticate;