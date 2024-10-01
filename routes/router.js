const express = require('express');
const passport = require('passport');
const { body, validationResult } = require('express-validator')
const { getHomePage, getLoginPage, getSignupPage, postSignupPage, validator, mainPassport, logoutUser, getNewPostPage, postNewPostPage, getMembershipGet, getAdminChecker, getMembershipPost, postAdminChecker, deletePost } = require('../controllers/controller');
const { getUserByUserName, getUserById } = require('../db/queries');
const router = express.Router();

mainPassport(passport);

router.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

const unauthrized = (req, res, next) => {
    if (req.user) {
        return res.redirect('/');
    } else {
        next()
    }
}
const authrized = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/');
    } else {
        next()
    }
}
router.route('/').get(getHomePage)
router.route('/login').get(unauthrized, getLoginPage).post(passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureMessage: 'INVALID CRENDENTIALS'
}))
router.route('/signup').get(unauthrized, getSignupPage).post(validator, postSignupPage)
router.get("/logout", logoutUser);
router.route("/new").get(authrized, getNewPostPage).post(authrized, body('content').isLength({ min: 5 }).withMessage('POST CONTENT MUST BE MORE THAN 5 CHARACTERS'), postNewPostPage);


router.route('/get-membership').get(authrized, getMembershipGet).post(authrized, getMembershipPost)
router.route('/admin-checker').get(authrized, getAdminChecker).post(authrized, body('password').notEmpty().withMessage('Please Enter Admin Password').custom(val => val == "admin"), postAdminChecker)

router.post('/posts/:postId/delete', deletePost)
module.exports = router;