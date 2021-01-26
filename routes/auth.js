const router = require('express').Router();
const User = require('../model/User');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) =>{
    
    // validation 
    const {error} = registerValidation(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    //check if user already exist; emailExist has all user info
    const emailExist = await User.findOne({email:req.body.email});
    if (emailExist) {
        return res.status(400).send('email already exist');
    }
    
    // hash passwords
    const salt = await bcrypt.genSalt(10); 
    const hashedpass = await bcrypt.hash(req.body.password, salt);
    //create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedpass
    });
    try {

        const userSignup = await user.save();
        res.send({user: userSignup._id});
    } catch (err) {
        res.status(400).send(err);
    }
});

//LOGIN

router.post('/login', async (req,res) =>{
    const {error} = loginValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    //check if email already exist
    const user = await User.findOne({email:req.body.email});
    if (!user) {
        return res.status(400).send("email is not registered");
    }

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
        return res.status(400).send('Invalid password');       
    }


    //token creation and assign
    const jwttoken = jwt.sign({_id: user._id}, process.env.SECRET_TOKEN);
    res.header('auth-token', jwttoken).send(jwttoken);
});

module.exports = router;