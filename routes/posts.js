const router = require('express').Router();
const verify = require('./tokenVerify');

router.get('/', verify, (req,res)=>{
    res.json({
        posts:{
            title: "hello",
            description: "go to hell"
        }
    });
});

module.exports = router;