const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const nodemailer = require("nodemailer")
// const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    phoneNo: req.body.phoneNo
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    res.send({ message: "User was registered successfully!" });

    let transporter = nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      port: 587,
      secure: false, 
      auth: {
        user: "testfypuser@outlook.com", 
        pass: "1234567FYP!", 
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    },
    });

    var mailOptions = {
      from: "testfypuser@outlook.com",
      to: user.email,
      subject: 'Thanks for registering with Movie App',
      text: 'Blah Blah blah'
    };

    transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);
  });

  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      // var authorities = [];

      // for (let i = 0; i < user.roles.length; i++) {
      //   authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      // }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        phoneNo: user.phoneNo,
        // roles: authorities,
        accessToken: token
      });
    });
};

exports.update = (req, res) => {
  const user = User.findById({id: req.body._id})

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.username || user.email;
    user.phoneNo = req.body.username || user.phoneNo;
    user.bio = req.body.bio || user.bio;

    if (req.body.password) {
      user.password=req.body.password
    }

    const updatedUser = User.save()

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      phoneNo: updatedUser.phoneNo,
      bio: updatedUser.bio,
      filePath: updatedUser.filePath,
      accessToken: token
    })

  }else {
    res.status(404).send({ message: "User Not found." });
  }
   
};