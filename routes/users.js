const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/database');



//Register route
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser, (err, user)=>{
        if(err){
            res.json({success: false, msg:'Failed to register user'});
        }else{
            res.json({success: true, msg:'User Registered'});
        }
        
    });
});

//Authenicate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    //check for username
    User.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg : 'User not found'});
        }

        //match password if username exists
        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: 604800

                });
                
                //send this responds if pword and username matches
                res.json({
                    success: true,
                    token: 'jwt '+ token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                        }
                });

            }
            else {
                //if username and pword doesnt match send this response
                return res.json({success: false, msg : 'Wrong password'});
            }
        });
    
    });
});

//Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
});


module.exports = router;