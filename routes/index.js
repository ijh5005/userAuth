var express = require('express');
var router = express.Router();

const DB_USER = 'user';
const DB_PASSWORD = '1234';

const user = require('../lib/users');

var mongoose = require('mongoose');
mongoose.connect('mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@ds147274.mlab.com:47274/database092317');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', (req, res, next) => {
  //cache profile information
  const username = req.body.username;
  const password = req.body.password;

  user.findOne({ username: username }, (err, userObj) => {
    if(err){
      console.log(err);
      return res.status(500).send();
    }
    //if user is not found
    if(!userObj){
      return res.status(404).send();
    }
    // test a hash password
    userObj.comparePassword(password, function(err, isMatch) {
      if(isMatch && isMatch === true){
        //save the user in the session
        req.session.userObj = userObj;
        //if user is found
        return res.status(200).send(userObj);
      } else {
        return res.status(401).send();
      }
    });
  });
});

router.get('/dashboard', (req, res, next) => {
  //if not able to log in
  if(!req.session.userObj){
    return res.status(401).send();
  }
  //if able to log in
  return res.status(200).send('My dashboard');
});

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  return res.status(200).send();
});

router.post('/register', (req, res, next) => {
  //cache profile information
  const username = req.body.username;
  const password = req.body.password;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  //create in instance of the user schema
  let userProfile = new user();
  //set profile information
  userProfile.username = username;
  userProfile.password = password;
  userProfile.firstname = firstname;
  userProfile.lastname = lastname;
  //save profile information
  userProfile.save((err, userObj) => {
    //send status
    if(err){
      console.log(err);
      return res.status(500).send();
    } else {
      return res.status(200).send();
    }
  });
});

module.exports = router;
