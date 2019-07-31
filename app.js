// ----------------- Node modules ------------
 
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const async=require('async');
const assert = require('assert');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Storage = require('dom-storage');
 
var sessionStorage = new Storage('./db.json', { strict: false, ws: '  ' });
var sessionStorage1 = new Storage('./db1.json', { strict: false, ws: '  ' });
// ------- Firebase settings --------------
 
var firebase = require("firebase/app");
 
// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");
require("firebase/database");
 
const firebaseConfig = {
  apiKey: "AIzaSyDnqgkjVefZFr-jHJqFCHkac-tGOdRwJG4",
  authDomain: "udghoshregistration.firebaseapp.com",
  databaseURL: "https://udghoshregistration.firebaseio.com",
  projectId: "udghoshregistration",
  storageBucket: "",
  messagingSenderId: "83845558524",
  appId: "1:83845558524:web:6b073349da2c723c"
};
 
firebase.initializeApp(firebaseConfig);
 
var database = firebase.database();
 
// ---------- firebase cloud store ---------------
 
var firestore = firebase.firestore();
 
// crypto module for random string gen
function encrypt(data, pass) {
  var cipher = crypto.createCipher('aes-256-ecb', pass);
  return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
};
 
function conversion(date){
  for(var i = 0; i < date.length; i++){
    if(date[i] == '/'){
      date = date.substr(0 , i) + '-' + date.substr(i + 1);
    }
  };
  return date;
};
 
// ---------- All setting done --------------
 
// --------- app settings ---------------
var app = express();
app.set('port', (process.env.PORT || 3000));
 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 
var server=app.listen(app.get('port'), function(){
  console.log('Server started on port '+app.get('port'));
});
 
// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
 
// ---------- GET Requests --------------
 
// udg_champ main website
app.get('/56139fb631d586607a3841992148761f78ae3f31', function(req,res,next){
    res.render('udg_champ');
});
 
// nossq main page
app.get('/e365d9caf9b7234a92d04292c74c4891befbbf25', function(req,res,next){
  res.render('nossq');
});
 
// error
app.get('/f62045a5685c29dcc61a2cafae030a68e1389db3', function(req,res,next){
  res.render('404');
});
 
// brochure
app.get('/525299210b55528ffbd19b7a50a4ef386e208f9d', function(req,res,next){
  res.render('brochure');
});
 
// CA
app.get('/4b3cdf59227ae23ae6373b6f95f6b7a7b39baf9e', function(req,res,next){
  res.render('CA');
});
 
// Gallery
app.get('/5e5c68e29abed08823b94f9bf4ad5108514d5100', function(req,res,next){
  res.render('gallery');
});
 
// NossqRegisterForm
app.get('/6d932840157263669f6f378fa14ee190', function(req,res,next){
  res.render('index_4', {msg: ''});
});
 
// Main
app.get('/', function(req,res,next){
  res.render('index');
});
 
// Main form 1
app.get('/acf00010c0c607c79a42343051745191985078f2', function(req,res,next){
  res.render('index_1', {msg: ''});
});
 
// Pronights
app.get('/f2adfb77c515a6bd0f82cf3c65ce60654f7f81b6', function(req,res,next){
  res.render('pronights');
});
 
// Social
app.get('/c6e7f21e897c7313fab5bd1ed06dd234c777e179', function(req,res,next){
  res.render('social');
});
 
// Team
app.get('/fb250db707f26b867234c570dfe12a67b0b4d71e', function(req,res,next){
  res.render('team');
});
 
// events
app.get('/0e2d732613e956976a421343554a49b5e1c76546', function(req,res,next){
  res.render('events');
});
 
// ---------- POST Requests --------------
 
// Main registration
app.post('/f26fe5b7f7a2f27e5458c9cfd5a55580re', function(req,res,next){
 
if(req.body.password1 == req.body.password2) {
  uid = encrypt(req.body.name, req.body.password1);
 
  code = uid.substring(0,6);
 
  const output = `
    <p>We have recieved your message at ${new Date(Date.now()).toLocaleString()}</p>
    <p>Your one time code is: ${code}</p>
    <p>*This is an automatically generated mail. Please do not reply. For any further queries contact Udghosh core team*</p>`
 
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'udghoshiitkresponses@gmail.com',
      pass: 'responses1234'
    },
    tls:{
      rejectUnauthorized:false
    }
  });
 
 
  let mailOptions = {
      from: '"Udghosh" <udghoshiitkresponses@gmail.com>',
      to: req.body.mail,//  list of receivers
      subject: 'Verification Code for Udghosh registration',
      html: output
  };
 
  nameid = encrypt(req.body.name, "udghosh");
 
  mailid = encrypt(req.body.mail, "udghosh");
 
  let ref2 = firestore.collection('udghoshUsernames').doc(nameid);
 
  let ref = firestore.collection('udghoshMails').doc(mailid);
 
  let getDoc = ref2.get()
  .then(doc => {
    if (!doc.exists) {
 
        // unique username
       
        let getDoc = ref.get()
          .then(doc => {
            if (!doc.exists) {
 
              // mail unique
 
              // new user
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  res.render('index_1', {msg: 'Something went wrong, Please try again later.'})
                }
                else{
                  res.render('index_3', {msg: 'Verification mail sent. Please also check your Spam section for the Mail verification code.',  name : req.body.name, mail : req.body.mail, password : req.body.password1, phone: req.body.contact.toString()})
                }
                });
              }
            else{
              res.render('index_1', {msg: 'Sorry, this Mail Id is already Registered.'});
            }
            })
          .catch(err => {
                res.render('index_1', {msg: 'Something went wrong, Please try again later.'});
              });
    }else{
      res.render('index_1', {msg: 'This username already exists, Please try again.'});
    }
  })
  .catch(err => {
      res.render('index_1', {msg: 'Something went wrong, Please try again later.'});
  });
 
  }else{
        res.render('index_1', {msg: 'The Passwords are inconsistent, Please try again.'});
  };
 
});
 
// step 2
app.post('/22d9e9c7277c9857eedb195d410018d6rs', function(req,res,next){
 
  var item ={
    Username : req.body.name,
    Mail : req.body.mail,
    password : req.body.password.toString(),
    Contengency_Leader_Name : '',
    Head_Coach : '',
    Contact1: req.body.contact.toString(),
    Contact2: '',
    College: '',
    City: '',
    PIN: '',
    Atheletics : '',
    Badminton : '',
    Cricket : '',
    Volleyball : '',
    Basketball : '',
    Skating : '',
    Chess : '',
    Hockey : '',
    Table_Tennis : '',
    Lawn_Tennis : '',
    Squash : '',
    Kho_Kho : '',
    Handball : '',
    Weightlifting: '',
    Powerlifting: '',
    Activity: 'False',
    Time: conversion(new Date(Date.now()).toLocaleString())
  };
 
  uid = encrypt(req.body.name, req.body.password);
 
  mailid = encrypt(req.body.mail, "udghosh");
 
  nameid = encrypt(req.body.name, "udghosh");
 
  truecode = uid.substring(0,6);
 
  let ref = firestore.collection('udghoshRegisteration').doc(uid);
 
  let ref2 = firestore.collection('udghoshMails').doc(mailid);
 
  let ref3 = firestore.collection('udghoshUsernames').doc(nameid);
 
  let getDoc = ref.get()
  .then(doc => {
    if (!doc.exists) {
 
      // user is unique
 
      if (truecode == req.body.code){
        ref.set(item).then(function(){
          // registered
 
          let getDoc2 = ref2.get()
          .then(doc2 => {
           
            // vulnerable to console attacks
 
            var item7 = {
              Mail: req.body.mail
            };
 
            var item8 = {
              Username: req.body.name
            };
 
            // chod
            ref2.set(item7).then(function(){
              ref3.set(item8).then(function(){
                res.render('index_1', {msg: 'Sucessfully Registered'});
              })
              .catch(function(error){
                res.render('index_3', {msg: 'Something went wrong, Please try again.',name : req.body.name, mail : req.body.mail, password : req.body.password, phone: req.body.contact.toString()});
              });
            }).catch(function(error){
                res.render('index_3', {msg: 'Something went wrong, Please try again.',name : req.body.name, mail : req.body.mail, password : req.body.password, phone: req.body.contact.toString()});
              });
 
          })
          .catch(err => {
              // chod
              res.render('index_1', {msg: 'Something went wrong, Please try again later.'});
          });
        }).catch(function(error){
          res.render('index_3', {msg: 'Something went wrong, Please try again later.',name : req.body.name, mail : req.body.mail, password : req.body.password, phone: req.body.contact.toString()});
        });
      }
      else{
        res.render('index_3', {msg: 'Verification Code is inconsistent, Please try again.',name : req.body.name, mail : req.body.mail, password : req.body.password, phone: req.body.contact.toString()});
      }
    }else{
        res.render('index_1', {msg: 'Something went wrong, Please try again later.'});
    }
  })
  .catch(err => {
      res.render('index_3', {msg: 'Something went wrong, Please try again later.',name : req.body.name, mail : req.body.mail, password : req.body.password, phone: req.body.contact.toString()});
  });
 
});
 
 // resend code
app.post('/6a9e12b1307853e8776aaa71549687d7', function(req,res){
  var input1 = req.body.name;
  var input2 = req.body.password;
 
  var uid = encrypt(input1, input2);
 
  var code = uid.substr(0,6);
 
  const output = `
    <p>We have recieved your message at ${new Date(Date.now()).toLocaleString()}</p>
    <p>Your one time code is: ${code}</p>
    <p>*This is an automatically generated mail. Please do not reply. For any further queries contact Udghosh core team*</p>`
 
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'udghoshiitkresponses@gmail.com',
      pass: 'responses1234'
    },
    tls:{
      rejectUnauthorized:false
    }
  });
 
 
  let mailOptions = {
      from: '"Udghosh" <udghoshiitkresponses@gmail.com>',
      to: req.body.mail,//  list of receivers
      subject: 'Verification Code for Udghosh registration',
      html: output
  };
 
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.render('index_3', {msg: 'Something went wrong, Please try again later.',name : req.body.name, mail : req.body.mail, password : req.body.password})
    }
    else{
      res.render('index_3', {msg: 'Verification mail successfully resent. Please also check your Spam section for the Mail verification code.',  name : req.body.name, mail : req.body.mail, password : req.body.password1 })
    }
    });
});
 
 
// login
app.post('/766d1e56a1f66f223807ad61d106097flo', function(req,res){
 
  // Taking inputs
  var inputusername = req.body.uname;
  var inputuserpassword = req.body.upassword;
 
  // generating user Id
  uid = encrypt(inputusername, inputuserpassword);
 
  let ref = firestore.collection('udghoshRegisteration').doc(uid);
 
  let getDoc = ref.get()
  .then(doc => {
    if (!doc.exists) {
 
      // no such user exists
      res.render('index_1', {msg: 'User not Found'});
 
    } else {
        // user exists
        var item2 = {
          Activity : 'True'
        }
        var updates = { password: inputuserpassword };
 
        var keys = encrypt(inputusername, "udghosh");
 
        sessionStorage.setItem(keys, updates);
 
        ref.update(item2).then(function(){
 
        let getDoc2 = ref.get()
        .then(doc2 => {
     
            var datausers = doc2.data();
 
            res.render('dashboard', {c_l_n: datausers['Contengency_Leader_Name'],
                                     h_c:  datausers['Head_Coach'],
                                     p_c_n: datausers['Contact1'] ,
                                     a_c_n:  datausers['Contact2'],
                                     c_f_n:  datausers['College'],
                                     e_m_i:  datausers['Mail'],
                                     c_s:  datausers['City'],
                                     p_c:  datausers['PIN'],
                                     at: datausers['Atheletics'],
                                     ba:datausers['Badminton'],
                                     bb:datausers['Basketball'],
                                     fb:datausers['Football'],
                                     hk:datausers['Hockey'],
                                     vb:datausers['Volleyball'],
                                     kk:datausers['Kho_Kho'],
                                     tt:datausers['Table_Tennis'],
                                     lt:datausers['Lawn_Tennis'],
                                     sq:datausers['Squash'],
                                     cs:datausers['Chess'],
                                     wl:datausers['Weightlifting'],
                                     pl:datausers['Powerlifting'],
                                     hk:datausers['Hockey'],
                                     sk: datausers['Skating'],
                                     ck:datausers['Cricket'],
                                     hb:datausers['Handball'],
                                     wdv: encrypt(inputusername, "udghosh")});
            });
  })
  };
  })
  .catch(err => {
    res.render('index_1', {msg: 'Something went wrong, Please try again later.'});
  });
});
 
 
 
// NOSSQ registration
app.post('/6d932840157263669f6f378fa14ee190', function(req,res,next){
 
    if(req.body.password1 == req.body.password2) {
      var uid = encrypt(req.body.name, req.body.password1);
   
      var code = uid.substring(0,6);
   
      const output = `
        <p>We have recieved your message at ${new Date(Date.now()).toLocaleString()}</p>
        <p>Your one time code is: ${code}</p>
        <p>*This is an automatically generated mail. Please do not reply. For any further queries contact Udghosh core team*</p>`
   
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'udghoshiitkresponses@gmail.com',
          pass: 'responses1234'
        },
        tls:{
          rejectUnauthorized:false
        }
      });
   
   
      let mailOptions = {
          from: '"Udghosh" <udghoshiitkresponses@gmail.com>',
          to: req.body.mail,//  list of receivers
          subject: 'NOSSQ Code ',
          html: output
      };
   
      var nameid = encrypt(req.body.name, "nossq");
   
      var mailid = encrypt(req.body.mail, "nossq");
   
      let ref2 = firestore.collection('nossqUsernames').doc(nameid);
   
      let ref = firestore.collection('nossqMails').doc(mailid);
      let getDoc = ref2.get()
      .then(doc => {
        if (!doc.exists) {
   
            // unique username
           
            let getDoc = ref.get()
              .then(doc => {
                if (!doc.exists) {
   
                  // mail unique
   
                  // new user
                  transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                      res.render('index_4', {msg: 'Something went wrong, Please try again later.'})
                    }
                    else{
                      res.render('index_5', {msg: 'Verification mail sent. Please also check your Spam section for the Mail verification code.',  name : req.body.name, mail : req.body.mail, password : req.body.password1 })
                    }
                    });
                  }
                else{
                  res.render('index_4', {msg: 'Sorry, this Mail Id is already Registered.'});
                }
                })
              .catch(err => {
                    res.render('index_4', {msg: 'Something went wrong, Please try again later.'});
                  });
        }else{
          res.render('index_4', {msg: 'This username already exists, Please try again.'});
        }
      })
      .catch(err => {
          res.render('index_4', {msg: 'Something went wrong, Please try again later.'});
      });
   
      }else{
            res.render('index_4', {msg: 'The Passwords are inconsistent, Please try again.'});
      };
   
    });
 
 
  // step 2
  app.post('/84109960b0739040331574376a4d759f', function(req,res,next){
 
    var item ={
      PrincipalName : '',
      userName : req.body.name,
      Mail : req.body.mail,
      password : req.body.password.toString(),
      NameOfSchool: '',
      NoOfStudents: '',
      Contact1: '',
      Contact2: '',
      City: '',
      PIN: '',
      Activity: 'False',
      Time: conversion(new Date(Date.now()).toLocaleString())
    };
 
    uid = encrypt(req.body.name, req.body.password);
 
    mailid = encrypt(req.body.mail, "nossq");
 
    nameid = encrypt(req.body.name, "nossq");
 
    truecode = uid.substring(0,6);
 
    let ref = firestore.collection('nossqregistration').doc(uid);
 
    let ref2 = firestore.collection('nossqMails').doc(mailid);
 
    let ref3 = firestore.collection('nossqUsernames').doc(nameid);
 
    let getDoc = ref.get()
    .then(doc => {
      if (!doc.exists) {
 
        // user is unique
 
        if (truecode == req.body.code){
          ref.set(item).then(function(){
            // registered
 
            let getDoc2 = ref2.get()
            .then(doc2 => {
             
              // vulnerable to console attacks
 
              var item7 = {
                Mail: req.body.mail
              };
 
              var item8 = {
                Username: req.body.name
              };
 
              // chod
              ref2.set(item7).then(function(){
                ref3.set(item8).then(function(){
                  res.render('index_4', {msg: 'Sucessfully Registered'});
                })
                .catch(function(error){
                  res.render('index_5', {msg: 'Something went wrong, Please try again.',name : req.body.name, mail : req.body.mail, password : req.body.password});
                });
              }).catch(function(error){
                  res.render('index_5', {msg: 'Something went wrong, Please try again.',name : req.body.name, mail : req.body.mail, password : req.body.password});
                });
 
            })
            .catch(err => {
                // chod
                res.render('index_4', {msg: 'Something went wrong, Please try again later.'});
            });
          }).catch(function(error){
            res.render('index_5', {msg: 'Something went wrong, Please try again later.',name : req.body.name, mail : req.body.mail, password : req.body.password});
          });
        }
        else{
          res.render('index_5', {msg: 'Verification Code is inconsistent, Please try again.',name : req.body.name, mail : req.body.mail, password : req.body.password});
        }
      }else{
          res.render('index_4', {msg: 'Something went wrong, Please try again later.'});
      }
    })
    .catch(err => {
        res.render('index_5', {msg: 'Something went wrong, Please try again later.',name : req.body.name, mail : req.body.mail, password : req.body.password});
    });
 
  });
 
 // nossq resend
  app.post('/81de12b13078s1e8776aaa71549688a4', function(req,res){
    var input1 = req.body.name;
    var input2 = req.body.password;
 
    var uid = encrypt(input1, input2);
 
    var code = uid.substr(0,6);
 
    const output = `
      <p>We have recieved your message at ${new Date(Date.now()).toLocaleString()}</p>
      <p>Your one time code is: ${code}</p>
      <p>*This is an automatically generated mail. Please do not reply. For any further queries contact Udghosh core team*</p>`
 
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'udghoshiitkresponses@gmail.com',
        pass: 'responses1234'
      },
      tls:{
        rejectUnauthorized:false
      }
    });
 
 
    let mailOptions = {
        from: '"Udghosh" <udghoshiitkresponses@gmail.com>',
        to: req.body.mail,//  list of receivers
        subject: 'Verification Code for NOSSQ registration',
        html: output
    };
 
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.render('index_5', {msg: 'Something went wrong, Please try again later.',name : req.body.name, mail : req.body.mail, password : req.body.password})
      }
      else{
        res.render('index_5', {msg: 'Verification mail successfully resent. Please also check your Spam section for the Mail verification code.',  name : req.body.name, mail : req.body.mail, password : req.body.password1 })
      }
      });
  });
 
  // nossq login
  app.post('/7c80234d705934bf8855f208d834ae3b', function(req,res){
   
    // Taking inputs
    var inputusername = req.body.uname;
    var inputuserpassword = req.body.upassword;
 
    // generating user Id
    uid = encrypt(inputusername, inputuserpassword);
 
    let ref = firestore.collection('nossqregistration').doc(uid);
 
    let getDoc = ref.get()
    .then(doc => {    
      if (!doc.exists) {
 
        // no such user exists
        res.render('index_4', {msg: 'User not Found'});
 
      } else {
          // user exists
          var item2 = {
            Activity : 'True'
          }
          var updates = { password: inputuserpassword };
 
          var keys = encrypt(inputusername, "nossq");
 
          sessionStorage1.setItem(keys, updates);
 
          ref.update(item2).then(function(){
 
          let getDoc2 = ref.get()
          .then(doc2 => {
       
              var datausers = doc2.data();
 
              res.render('dashboardNossq', {p_n: datausers['PrincipalName'],
                                       e_m_i:  datausers['Mail'],
                                       p_c_n: datausers['Contact1'] ,
                                       a_c_n:  datausers['Contact2'],
                                       p_s_d:  datausers['Password'],
                                       n_o_s:  datausers['NameOfSchool'],
                                       c_s:  datausers['City'],
                                       p_c:  datausers['PIN'],
                                       n_o_st: datausers['NoOfStudents'],
                                       wdv: encrypt(inputusername, "nossq")});
              });
    })
    };
    })
    .catch(err => {
      res.render('index_4', {msg: 'Something went wrong, Please try again later.'});
    });
  });
 
 
/////
////////////////////////////////////////////
///////////////////////////////////////////////////////////////  
 
//nossq details editing rights
app.post('/2309bdf3ebe438023410df8f15e52e94', function(req,res){
 
  var check = encrypt(req.body.name, "nossq");
  if(sessionStorage1.getItem(check) === null || sessionStorage1.getItem(check) === undefined){
    res.render('index_4', {msg: 'Your session expired, please login again'});
  }else{
 
  var item = {};
 
  if(req.body.p_n != ''){
    item['PrincipalName'] = req.body.p_n;
  };
  if(req.body.n_o_s != ''){
    item['NameOfSchool'] = req.body.n_o_s;
  };
  if(req.body.n_o_st != ''){
    item['NoOfStudents'] = req.body.n_o_st;
  };
  if(req.body.p_c_n != ''){
    item['Contact1'] = req.body.p_c_n;
  };
  if(req.body.a_c_n != ''){
    item['Contact2'] = req.body.a_c_n;
  };
  if(req.body.c_s != ''){
    item['City'] = req.body.c_s;
  };
  if(req.body.p_c != ''){
    item['PIN'] = req.body.p_c;
  };
 
  var keys = encrypt(req.body.name, "nossq");
  var pass = sessionStorage1.getItem(keys);
 
  // generating user Id
  var uid = encrypt(req.body.name, pass['password']);
 
  let ref = firestore.collection('nossqregistration').doc(uid);
 
  let getDoc = ref.get()
  .then(doc => {
    if (!doc.exists) {
 
      // no such user exists
      res.render('index_4', {msg: 'Invalid Credentials while updating Registration details'});
      sessionStorage1.removeItem(keys);
 
    } else {
     
      ref.update(item).then(function(){
 
        let getDoc2 = ref.get()
        .then(doc => {
          var datausers = doc.data();
          res.render('dashboardNossq', {p_n: datausers['PrincipalName'],
                                       e_m_i:  datausers['Mail'],
                                       p_c_n: datausers['Contact1'] ,
                                       a_c_n:  datausers['Contact2'],
                                       p_s_d:  datausers['Password'],
                                       n_o_s:  datausers['NameOfSchool'],
                                       c_s:  datausers['City'],
                                       p_c:  datausers['PIN'],
                                       n_o_st: datausers['NoOfStudents'],
                                       wdv: encrypt(req.body.name, "nossq")});
              });
  })
  .catch(err => {
    console.log('Error getting document', err);
    sessionStorage1.removeItem(keys);
    res.render('index_4', {msg: 'Something went wrong, Please try again later.'});
});
}
});
}
 
});
 
// registration details editing rights
app.post('/d23df4d956a710e48bbd0290d09728abrc', function(req,res){
 
  var check = encrypt(req.body.name, "udghosh");
  if(sessionStorage.getItem(check) === null || sessionStorage.getItem(check) === undefined){
    res.render('index_1', {msg: 'Your session expired, please login again'});
  }else{
 
  var item = {};
 
  if(req.body.c_l_n != ''){
    item['Contengency_Leader_Name'] = req.body.c_l_n;
  };
  if(req.body.h_c != ''){
    item['Head_Coach'] = req.body.h_c;
  };
  if(req.body.c_f_n != ''){
    item['College'] = req.body.c_f_n;
  };
   /*
  if(req.body.p_c_n != ''){
    item['Contact1'] = req.body.p_c_n;
  };
  */
  if(req.body.a_c_n != ''){
    item['Contact2'] = req.body.a_c_n;
  };
  if(req.body.c_s != ''){
    item['City'] = req.body.c_s;
  };
  if(req.body.p_c != ''){
    item['PIN'] = req.body.p_c;
  };
 
  var keys = encrypt(req.body.name, "udghosh");
  var pass = sessionStorage.getItem(keys);
 
  // generating user Id
  uid = encrypt(req.body.name, pass['password']);
 
  let ref = firestore.collection('udghoshRegisteration').doc(uid);
 
  let getDoc = ref.get()
  .then(doc => {
    if (!doc.exists) {
 
      // no such user exists
      res.render('index_1', {msg: 'Invalid Credentials while updating Registration details'});
      sessionStorage.removeItem(keys);
 
    } else {
     
      ref.update(item).then(function(){
 
        let getDoc2 = ref.get()
        .then(doc => {
          var datausers = doc.data();
          res.render('dashboard', {c_l_n: datausers['Contengency_Leader_Name'],
                                     h_c:  datausers['Head_Coach'],
                                     p_c_n: datausers['Contact1'] ,
                                     a_c_n:  datausers['Contact2'],
                                     c_f_n:  datausers['College'],
                                     e_m_i:  datausers['Mail'],
                                     c_s:  datausers['City'],
                                     p_c:  datausers['PIN'],
                                     at: datausers['Atheletics'],
                                     ba:datausers['Badminton'],
                                     bb:datausers['Basketball'],
                                     fb:datausers['Football'],
                                     hk:datausers['Hockey'],
                                     vb:datausers['Volleyball'],
                                     kk:datausers['Kho_Kho'],
                                     tt:datausers['Table_Tennis'],
                                     lt:datausers['Lawn_Tennis'],
                                     sq:datausers['Squash'],
                                     cs:datausers['Chess'],
                                     wl:datausers['Weightlifting'],
                                     pl:datausers['Powerlifting'],
                                     hk:datausers['Hockey'],
                                     sk: datausers['Skating'],
                                     ck:datausers['Cricket'],
                                     hb:datausers['Handball'],
                                     wdv: encrypt(req.body.name, "udghosh")});
        });
  })
  .catch(err => {
    console.log('Error getting document', err);
    sessionStorage.removeItem(keys);
    res.render('index_1', {msg: 'Something went wrong, Please try again later.'});
});
}
});
}
 
});
 
// events change details rights
app.post('/b073f1087455e888a841bc3e3eb5eb6cec', function(req,res,next){
 
  var check = encrypt(req.body.name, "udghosh");
  if(sessionStorage.getItem(check) === null || sessionStorage.getItem(check) === undefined){
    res.render('index_1', {msg: 'Your session expired, please login again'});
  }else{
  var item = {};
 
  if(req.body.atheletics != ''){
    item['Atheletics'] = req.body.atheletics;
  };
 
  if(req.body.badminton != ''){
    item['Badminton'] = req.body.badminton;
  };
 
  if(req.body.football != ''){
    item['Football'] = req.body.football;
  };
 
  if(req.body.volleyball != ''){
    item['Volleyball'] = req.body.volleyball;
  };
 
  if(req.body.cricket != ''){
    item['Cricket'] = req.body.cricket;
  };
 
  if(req.body.skating != ''){
    item['Skating'] = req.body.skating;
  };
 
  if(req.body.lawn != ''){
    item['Lawn_Tennis'] = req.body.lawn;
  };
 
  if(req.body.tt != ''){
    item['Table_Tennis'] = req.body.tt;
  };
 
  if(req.body.squash != ''){
    item['Squash'] = req.body.squash;
  };
 
  if(req.body.handball != ''){
    item['Handball'] = req.body.handball;
  };
 
  if(req.body.powerlifting != ''){
    item['Powerlifting'] = req.body.powerlifting;
  };
 
  if(req.body.weightlifting != ''){
    item['Weightlifting'] = req.body.weightlifting;
  };
 
  if(req.body.chess != ''){
    item['Chess'] = req.body.chess;
  };
 
  if(req.body.hockey != ''){
    item['Hockey'] = req.body.hockey;
  };
 
  if(req.body.basketball != ''){
    item['Basketball'] = req.body.basketball;
  };
 
  if(req.body.kho != ''){
    item['Kho_Kho'] = req.body.kho;
  };
 
  var keys = encrypt(req.body.name, "udghosh");
  var pass = sessionStorage.getItem(keys);
 
  // generating user Id
  uid = encrypt(req.body.name, pass['password']);
 
  let ref = firestore.collection('udghoshRegisteration').doc(uid);
 
  let getDoc = ref.get()
  .then(doc => {
    if (!doc.exists) {
 
      // no such user exists
      res.render('index_1', {msg: 'Invalid Credentials while updating Events details'});
      sessionStorage.removeItem(keys);
 
    } else {
     
      ref.update(item).then(function(){
 
        let getDoc2 = ref.get()
        .then(doc => {
          var datausers = doc.data();
          res.render('dashboard', {c_l_n: datausers['Contengency_Leader_Name'],
                                     h_c:  datausers['Head_Coach'],
                                     p_c_n: datausers['Contact1'] ,
                                     a_c_n:  datausers['Contact2'],
                                     c_f_n:  datausers['College'],
                                     e_m_i:  datausers['Mail'],
                                     c_s:  datausers['City'],
                                     p_c:  datausers['PIN'],
                                     at: datausers['Atheletics'],
                                     ba:datausers['Badminton'],
                                     bb:datausers['Basketball'],
                                     fb:datausers['Football'],
                                     hk:datausers['Hockey'],
                                     vb:datausers['Volleyball'],
                                     kk:datausers['Kho_Kho'],
                                     tt:datausers['Table_Tennis'],
                                     lt:datausers['Lawn_Tennis'],
                                     sq:datausers['Squash'],
                                     cs:datausers['Chess'],
                                     wl:datausers['Weightlifting'],
                                     pl:datausers['Powerlifting'],
                                     hk:datausers['Hockey'],
                                     sk: datausers['Skating'],
                                     ck:datausers['Cricket'],
                                     hb:datausers['Handball'],
                                     wdv: encrypt(req.body.name, "udghosh")});
        });
  })
  .catch(err => {
    console.log('Error getting document', err);
    sessionStorage.removeItem(keys);
    res.render('index_1', {msg: 'Some Error occured, Please try again later.'});
});
}
});
}
});
 
 
 
// --------- forms ---------------
 
 
// Send data from form to mail and datbase
app.post("/c9d3bd7a2d649424b8296368c82d5fe2fr",function(req,res){
  const output = `
  <style>
  table, td, th {  
    border: 1px solid #ddd;
    text-align: left;
  }
 
  table {
    border-collapse: collapse;
    width: 100%;
  }
 
  th, td {
    padding: 15px;
  }
  </style>
  <p>We have recieved your message at ${new Date(Date.now()).toLocaleString()}</p>
  <table border="2px">  
    <tr> <th>Name</th><td> ${req.body.name}</td></tr>
    <tr><th>Email</th><td> ${req.body.email}</td></tr>
    <tr><th>Message</th><td> ${req.body.message}</td></tr>
  </table>
  <p>*This is an automatically generated mail. Please do not reply. For any further queries contact Udghosh core team*</p>
 `;
 let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
      user: 'udghoshiitkresponses@gmail.com',
      pass: "responses1234"
  },
  tls:{
    rejectUnauthorized:false
  }
});
 
 
let mailOptions = {
    from: '"Udghosh" <udghoshiitkresponses@gmail.com>',
    to: req.body.email,//  list of receivers
    subject: 'Message Sucessfully recieved',
    html: output
};
// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    });
  savemsg(req.body.name, req.body.email, req.body.message,)
  res.redirect("/");
});
 
 
function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
 
function savemsg(name, email, password){
    var uid = makeid(16);
    var pos1 = Math.floor(Math.random() * 16);
    var add1 = makeid(2);
    uid = uid.substring(0,pos1) + add1 + uid.substring(pos1);
    var pos2 = Math.floor(Math.random() * 18);
    var add2 = makeid(2);
    uid = uid.substring(0,pos2) + add2 + uid.substring(pos2);
 
    var date = new Date(Date.now()).toLocaleString();
 
    for(var i = 0; i < date.length; i++){
      if(date[i] == '/'){
        date = date.substr(0 , i) + '-' + date.substr(i + 1);
      }
    };
 
    uid = date + uid;
 
    var newMessageRef= database.ref('forms_responses').child(uid);
    newMessageRef.set({
      name : name,
      date : new Date(Date.now()).toLocaleString(),
      email : email,
      message : password
    });
}
 
// -------- more post reqs -----------
 
app.post('/a3d96738d3a6c3c6b1f9571b680ba99c', function(req,res,next){     // dashboard
  // logout code
 
  var key = req.body.rdx;
  sessionStorage.removeItem(key);
 
  res.redirect('/');      //home
});
 
app.post('/1378950eae52994823daf87092150d84', function(req,res,next){     // dashboard
  // logout code
 
  var key = req.body.rdx;
  sessionStorage.removeItem(key);
  res.redirect('/e365d9caf9b7234a92d04292c74c4891befbbf25');      //noosq
});
app.post('/278c4289711e58413eb96c52f4256385', function(req,res,next){     // dashboard
  // logout code
 
  var key = req.body.rdx;
  sessionStorage.removeItem(key);
  res.redirect('/56139fb631d586607a3841992148761f78ae3f31');      //udgchamps
});
 
app.post('/8zfd732617ac56976a421343554a49b5gae76546', function(req,res,next){
  var key = req.body.rdx;
  sessionStorage.removeItem(key);     // dashboard
  res.redirect('/events');      //events
});
 
app.post('/e9d0861b5a2cfbd95c2da252aecc7941', function(req,res,next){     // dashboard
  // logout code
 
  var key = req.body.rdx;
  sessionStorage.removeItem(key);
  res.redirect('/c6e7f21e897c7313fab5bd1ed06dd234c777e179');      //social
});
app.post('/b0615d8ce8ea8d73e33c48103cca252b', function(req,res,next){     // dashboard
  // logout code
 
  var key = req.body.rdx;
  sessionStorage.removeItem(key);
  res.redirect('/4b3cdf59227ae23ae6373b6f95f6b7a7b39baf9e');      //CA
});
 
app.post('/18c2d8d0e3d6293a44828dc223d66a72', function(req,res,next){     // dashboard
  // logout code
 
  var key = req.body.rdx;
  sessionStorage.removeItem(key);
  res.redirect('/5e5c68e29abed08823b94f9bf4ad5108514d5100');      //gallery
});
 
app.post('/067488b6cb869ee496849a0dc02fd4a7', function(req,res,next){     // dashboard
  // logout code
 
  var key = req.body.rdx;
  sessionStorage.removeItem(key);
  res.redirect('/f2adfb77c515a6bd0f82cf3c65ce60654f7f81b6');      //pronights
});
 
app.post('/f0ab7b2ad394d1b39df81b81c759417e', function(req,res,next){     // dashboard
  // logout code
 
  var key = req.body.rdx;
  sessionStorage.removeItem(key);
  res.redirect('/fb250db707f26b867234c570dfe12a67b0b4d71e');      //team
});
 
app.post('/e558b2c957c59a6c9999d7f54947176e', function(req,res,next){     // dashboard
  // logout code
 
  var key = req.body.rdx;
  sessionStorage.removeItem(key);
  res.redirect('/');      //team
});
 
// ----------------Nossq post reqs for logout--------------
app.post('/a73d96738d3a6c3c6b1f9571b680ba99c5', function(req,res,next){     // dashboard
  // logout code
 
  var key = req.body.rdx;
  sessionStorage1.removeItem(key);
 
  res.redirect('/');      //home
});
 
/*
app.post('/17378950eae52994823daf87092150d845', function(req,res,next){     // dashboard
  // logout code
 
  var key = req.body.rdx;
  sessionStorage1.removeItem(key);
  res.redirect('/e365d9caf9b7234a92d04292c74c4891befbbf25');      //noosq
});
*/
 
app.post('/2778c4289711e58413eb96c52f42563855', function(req,res,next){     // dashboard
  // logout code
 
  var key = req.body.rdx;
  sessionStorage1.removeItem(key);
  res.redirect('/56139fb631d586607a3841992148761f78ae3f31');      //udgchamps
});
 
app.post('/87zfd732617ac56976a421343554a49b5gae765465', function(req,res,next){
  var key = req.body.rdx;
  sessionStorage1.removeItem(key);     // dashboard
  res.redirect('/events');      //events
});
 
app.post('/e79d0861b5a2cfbd95c2da252aecc79415', function(req,res,next){     // dashboard
  // logout code
 
  var key = req.body.rdx;
  sessionStorage1.removeItem(key);
  res.redirect('/c6e7f21e897c7313fab5bd1ed06dd234c777e179');      //social
});
app.post('/b70615d8ce8ea8d73e33c48103cca252b5', function(req,res,next){     // dashboard
  // logout code
 
  var key = req.body.rdx;
  sessionStorage1.removeItem(key);
  res.redirect('/4b3cdf59227ae23ae6373b6f95f6b7a7b39baf9e');      //CA
});
 
app.post('/178c2d8d0e3d6293a44828dc223d66a725', function(req,res,next){     // dashboard
  // logout code
 
  var key = req.body.rdx;
  sessionStorage1.removeItem(key);
  res.redirect('/5e5c68e29abed08823b94f9bf4ad5108514d5100');      //gallery
});
 
app.post('/0767488b6cb869ee496849a0dc02fd4a75', function(req,res,next){     // dashboard
  // logout code
 
  var key = req.body.rdx;
  sessionStorage1.removeItem(key);
  res.redirect('/f2adfb77c515a6bd0f82cf3c65ce60654f7f81b6');      //pronights
});
 
app.post('/f70ab7b2ad394d1b39df81b81c759417e5', function(req,res,next){     // dashboard
  // logout code
 
  var key = req.body.rdx;
  sessionStorage1.removeItem(key);
  res.redirect('/fb250db707f26b867234c570dfe12a67b0b4d71e');      //team
});
 
app.post('/e7558b2c957c59a6c9999d7f54947176e5', function(req,res,next){     // dashboard
  // logout code
 
  var key = req.body.rdx;
  sessionStorage1.removeItem(key);
  res.redirect('/');      //team
});
