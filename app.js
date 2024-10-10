const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const Data = require('./model/model');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');


mongoose.connect('mongodb://127.0.0.1:27017/T2t')
    .then(() => {
        console.log("Connected to database");
    })
    .catch((err) => {
        console.log("Error connecting to database", err);
    });


app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({ secret: 'hello', resave: false, saveUninitialized: false }));
app.use(flash());
app.set('view engine', 'ejs');


app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


app.get('/home', (req, res) => {
    res.render('index.ejs');
});

app.get('/home/register', (req, res) => {
    res.render('register.ejs');
});

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hash = await bcrypt.hash(password, 12);
        const newUser =await new Data({
            username,
            password: hash
        });

        await newUser.save();
        req.session.user_id = newUser._id;
        req.flash('success', 'You have successfully registered');
        res.redirect('/home');
    } catch (error) {
        console.error("Error during registration:", error);
        req.flash('error_msg', 'Registration failed. Please try again.');
        res.redirect('/home/register');
    }
});

app.get('/home/login', (req, res) => {
    res.render('login.ejs');
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await Data.findOne({username: username });

        if (!user) {
            req.flash('error', 'Invalid username or password');
            return res.redirect('/home/login');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('error', 'Invalid username or password');
            return res.redirect('/home/login');
        }

        req.session.user_id = user._id;
        req.flash('success', 'You have been logged in successfully');
        res.redirect('/home');
    } catch (error) {
        console.error("Error during login:", error);
        req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/home/login');
    }
});

app.get('/home/forpw', (req, res) => {
    res.render('forpw.ejs');
});

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});
