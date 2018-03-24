var express = require('express');

var userRouter = express.Router();


var app = express();

app.use(express.static('public'));


userRouter.get('/login',function(){

});

userRouter.get('/changePassword',function(){

});

userRouter.get('/register',function(){

});
module.exports = userRouter; 