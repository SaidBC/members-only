require('dotenv').config();
const express = require('express');
const path = require('path')
const passport = require('passport');
const session = require('express-session')
const router = require('./routes/router');


const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());

app.use(express.urlencoded({ extended: true }))
app.use(router)

app.listen(PORT, () => {
    console.log('The application is listening at PORT', PORT)
})