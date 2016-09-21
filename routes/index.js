var express = require('express');
var passport = require('passport');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
var upload = multer({ storage: storage })
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
})
  .post('/', passport.authenticate('local-login', {  
        successRedirect: '/profile',
        failureRedirect: '/',
        failureFlash: true,
      }));

router.get('/login', function(req, res, next) {  
  res.render('login.ejs', { message: req.flash('loginMessage') });
})
    .post('/login', passport.authenticate('local-login', {  
      successRedirect: '/profile',
      failureRedirect: '/login',
      failureFlash: true,
    }));

router.get('/signup', function(req, res) {  
  res.render('signup.ejs', { message: req.flash('loginMessage') });
})
    .post('/signup', upload.single('stateID'), passport.authenticate('local-signup', {  
      successRedirect: '/profile',
      failureRedirect: '/signup',
      failureFlash: true,
    }));

router.get('/profile', isLoggedIn, function(req, res) {  
  res.render('profile.ejs', { user: req.user });
});

router.get('/logout', function(req, res) {  
  req.logout();
  res.redirect('/');
});

module.exports = router;

function isLoggedIn(req, res, next) {  
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}
