const asyncHandler = require('express-async-handler');
const LocalStrategy = require('passport-local').Strategy
const { body, validationResult } = require('express-validator')
const { getUserById, getUserByUserName, createUser, getAllPosts, createPost } = require('../db/queries')
const bcrypt = require('bcrypt');

const validator = [
    body('firstname').trim().custom(val => val.split(' ').length == 1 && val != '').withMessage('please fill your first name'),
    body('lastname').trim().custom(val => val.split(' ').length == 1 && val != '').withMessage('please fill your last name'),
    body('email').notEmpty().withMessage('you must provide us an email').isEmail().withMessage('invalid email'),
    body('username').trim().custom(val => val.split(' ').length == 1 && val != '').withMessage('please fill your username').custom(val => {
        return getUserByUserName(val).then(res => {
            if (res) {
                return Promise.reject('')
            } else {
                return Promise.resolve()
            }
        }).catch(err => Promise.reject(err));
    }).withMessage('username already used'),
    body('password').notEmpty().withMessage('you must provide us an password').isStrongPassword({ minLength: 8, minSymbols: 0 }).withMessage('please enter strong password'),
    body('confirmPassword').notEmpty().withMessage('please confirm your password').custom((val, { req }) => {
        return val == req.body.password
    }).withMessage('incorrect confirm password')
]

const getHomePage = async (req, res) => {
    const posts = await getAllPosts();
    res.render('index', { title: '', posts });
}

const getLoginPage = (req, res) => {
    res.render('login', { error_msg: req.session.messages });
}


const logoutUser = async (req, res) => {
    if (req.user) req.logout((err) => res.send(err))
    res.redirect('/')
}


const getSignupPage = (req, res) => {
    res.render('signup', { title: 'Signup members-only', errors: [] });
}

const postSignupPage = asyncHandler(async (req, res) => {
    const validRes = validationResult(req);
    if (!validRes.isEmpty()) {
        res.render('signup', { title: 'Signup members-only', errors: validRes.errors })
        return;
    }
    delete req.body.confirmPassword
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    await createUser({ ...req.body, password: hashedPassword })
    res.redirect('/login');
})


// passport 

const mainPassport = (passport) => {
    passport.use(new LocalStrategy(async (username, password, done) => {
        try {
            const user = await getUserByUserName(username);
            if (!user) return done(null, false, { message: "User not found" });
            const match = await bcrypt.compare(password, user.password);
            if (!match) return done(null, false, { message: "Invalid crendentails" });
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await getUserById(id);
            if (!user) throw new Error("USER NOT FOUND");
            return done(null, user)
        } catch (error) {
            return done(error, null)
        }
    })
}

const getNewPostPage = (req, res) => {
    res.render('newPost', { title: 'new post members-only', errors: [] })
}
const postNewPostPage = async (req, res) => {
    try {
        const validRes = validationResult(req);
        if (!validRes.isEmpty()) {
            res.render('newPost', { title: 'new post members-only', errors: validRes.errors })
            return;
        }
        const postData = { created_at: new Date().getTime(), content: req.body.content, author_name: req.user.username, author_id: req.user.id }
        await createPost(postData);
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    getHomePage, getLoginPage, getSignupPage, postSignupPage, logoutUser, validator, mainPassport, getNewPostPage, postNewPostPage
}