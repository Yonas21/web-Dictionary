var fs = require('fs');
var express = require('express');
var crypto = require('crypto');


var less_token = {};
var app = express();
var dict;
var users;

var cipher = crypto.createCipher('aes192','a password');

app.use(express.static('public'));
app.use(function (req, res, next) {
    console.log("Start");
    next();
});

app.get('/dictionary', function (req, res) {
    res.sendFile(__dirname + '/public/Dictionary.html');
});

app.get('/addWord', function (req, res) {
    res.sendFile(__dirname + '/public/add.html');
});

app.get('/signup', function (req, res) {
    res.sendFile(__dirname + '/public/signup.html');
});
app.get('/login', function (req, res) {
    res.sendFile(__dirname + '/public/login.html');
});
app.get('/editWord',function(req,res){
    res.sendFile(__dirname+'/public/edit.html');
});

fs.readFile('dictionary.json', function (err, data) {
    if (err) {
        return console.error(err);
    }
    dict = JSON.parse(data);
});

fs.readFile('users.json', function (err, data) {
    if (err) {
        return console.error(err);
    }
    users = JSON.parse(data);
});



fs.readFile('token.json',function(err,data){
    if (err){
        return console.error(err);
    }
    less_token = JSON.parse(data);
});

app.get("/dictionary/:name", function (req, res) {
    if (req.params.name in dict) {
        res.send(req.params.name + " : " + dict[req.params.name]);
    }
    else { res.send(req.params.name + " is not in the dictionary."); }

});

app.get("/dictionary/:name/:definition", function (req, res) {
    dict[req.params.name] = req.params.definition;
    res.send("You have added <b>" + req.params.name + " : " + dict[req.params.name] + "</b>");
});

app.get("/edit/:name/:definition", function (req, res) {
    if (req.params.name in dict){
    dict[req.params.name] = req.params.definition;
    res.send("You have Edited <b>" + req.params.name + " : " + dict[req.params.name] + "</b>");}
    else{res.send("Word not found!")}
});

app.get("/suggestion/:word", function (req, res) {
    var matches = []
    for (key in dict) {
        if (key.toLowerCase().search(req.params.word.toLowerCase()) != -1 && matches.length <= 5) { matches.push(key) }
    }
    res.send(JSON.stringify(matches));
});



app.get("/login/:username/:password", function (req, res) {
    if (req.params.username in users && req.params.password == users[req.params.username]) {
        //users[req.params.username] = req.params.password;
        /*
        var encrypted = cipher.update((Math.random()).toString(),'utf-8','hex');
        var apend = encrypted+Math.random()*10;
        apend=cipher.final('hex');
        console.log(apend);*/
        const secret = 'abcdefg';
        var hash = crypto.createHmac('sha256', secret)
                           .update(Math.random().toString())
                           .digest('hex');
        less_token[ req.params.username]=hash;//apend;
        fs.writeFile('token.json',JSON.stringify(less_token),function(err,data){
            if(err){
                throw err;
            }
        });
         res.send("<p style = \" color :green\">You have successfully logged in!</p>");

    }
    else if (req.params.username in users) {
        res.send("<p style=\" color:red;\">Wrong Password " + req.params.username + "!</p>");
    }
    else {
        res.send("<p style=\" color:red;\">Unknown Username!!!<br>If you dont have an accout already, Please <a href = \"http://localhost:8100/signup\">sign up</a>!!!<p style=\" color:red;\">"); }
});

//for signup page
app.get("/signup/:username/:password", function (req, res) {
    if (req.params.username in users) {
        res.send("<p style=\" color:red;\">Username already exists!</p>");
    }
    else if (req.params.password.length < 8 ) {
        res.send("<p style=\" color:red;\">Password has to be atleast 8 characters!</p>");
    }
    else {
        users[req.params.username] = req.params.password;
        res.send("You Have successfully signed up!!! ");
        var psw = JSON.stringify(users);
        fs.writeFile('users.json',psw,function(err,data){
            if(err){
                throw err;
            }
        });
    }
})
app.use(function (req, res, next) {
    console.log("End");
    next();
});
//app.use(express.static("views"));
app.listen(8100);
console.log("listening to :http://localhost:8100");
