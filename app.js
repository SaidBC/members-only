require('dotenv').config();
const express = require('express');
const path = require('path')
const passport = require('passport');
const expressSession = require('express-session');
const pgSession = require('connect-pg-simple')(expressSession);
const router = require('./routes/router');
const pool = require('./db/pool');


const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressSession({
    store: new pgSession({
        pool: pool,
        createTableIfMissing: true
    }),
    secret: process.env.FOO_COOKIE_SECRET,
    resave: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
    secret: 'casts',
    saveUninitialized: false,
}));


app.use(passport.session());

app.use(express.urlencoded({ extended: true }))
app.use(router)

app.listen(PORT, () => {
    console.log('The application is listening at PORT', PORT)
})