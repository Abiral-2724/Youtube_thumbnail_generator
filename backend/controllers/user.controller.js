const bcrypt = require('bcryptjs');
const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');


module.exports.register = async(req,res) => {
    try{
        const {username ,email,password ,confirmPassword ,gender ,youtubeChannelName ,youtubeChannelLink} = req.body ;
        if(!username || !email || !password || !confirmPassword || !gender){
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        }
        if(password != confirmPassword){
            return res.status(400).json({
                message: "Password do not match",
                success: false,
            });
        }

        const user = await User.findOne({email}) ;
        if(user){
            return res.status(400).json({
                message: "User already exists with this email",
                success: false,
            });
        }

        //hash of password 
        const hashedPassword = await bcrypt.hash(password,10) ;


        // creating user 
        await User.create({
            username ,
            email,
            password:hashedPassword,
            confirmPassword:hashedPassword,
            gender,
            youtubeChannelLink,
            youtubeChannelName

        })


        return res.status(201).json({
            message: "Account created successfully !!",
            success: true,
            user
        });

    }
    catch(e){
        console.log('Error while Registering user:', e);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}

module.exports.login = async(req,res) => {
    try{
        const {email ,password} = req.body ;
        if( !email || !password ){
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        // Generating token
        const tokenData = {
            userId: user._id,
        };

        // Returning user data
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });
console.log(user) ;
        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.username}`,
            user,
            success: true,
        });


    }
    catch(e){
        console.log('Error while Logging user:', e);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}

module.exports.logout = async(req,res) => {
    try{
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logout successfully",
            success: true,
        });
    }
    catch(e){
        console.log('Error while logging out user:', e);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}

module.exports.getUserProfile = async (req, res) => {
    try {
      const userId = req.user._id; // Assuming you decode the token and store the user ID in req.user
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  module.exports.updateUserProfile = async (req, res) => {
    try {
      const { email, username, newEmail, password } = req.body;
      if (!email) {
        return res.status(400).json({ message: 'Current email is required' });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update fields if provided
      if (username) user.username = username;
      if (newEmail) user.email = newEmail;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }
  
      await user.save();
  
      // Send back the updated user info (excluding password)
      const updatedUser = await User.findById(user._id).select('-password');
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  