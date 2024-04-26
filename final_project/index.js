const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

let users = [];

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    if(req.session.authorization) {
        token = req.session.authorization['accessToken'];
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next();
            }
            else {
                return res.status(403).json({message: "User not authenticated."});
            }
        })
    }
    else {
        return res.status(403).json({message: "User not logged in."})
    }    
});

app.post("/register", (req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    
    const checkifexists = (username) => {
        let existinguser = users.filter((user) => user.username === username)
        if (existinguser.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }

    if (!username || !password) {
        return res.status(404).json({message: "Please input a valid username and password."})
    }
    else {
        if (!checkifexists(username)) {
            users.push({"username": username,"password": password});
            return res.status(200).json({message: "User successfully registered. You may now login"});
        }
        else {
            return res.status(404).json({message: "Username already exists."})
        }
    }
})
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
