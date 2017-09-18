const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Traemos el modelo de usuario
let Usuario = require('../models/usuario');

//Ruta registro
router.get('/registrar', function(req, res){
  res.render('registro_usuario', {
    title: 'Registrarse en el Sistema'
  });
});

// Proceso de registro
router.post('/registrar', function(req, res){
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'Debe ingresar su nombre').notEmpty();
  req.checkBody('email', 'Debe ingresar su email').notEmpty();
  req.checkBody('email', 'Debe ingresar un email valido').isEmail();
  req.checkBody('username', 'Debe ingresar su nombre de usuario').notEmpty();
  req.checkBody('password', 'Debe ingresar su contraseña').notEmpty();
  req.checkBody('password', 'Las contraseñas no coinciden').equals(req.body.password);

  let errors = req.validationErrors();

  if(errors){
    res.render('registro_usuario', {
      errors: errors
    });
  }else{
    let nuevoUsuario = new User({
      name: name,
      email: email,
      username: username,
      password: password
    });

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(nuevoUsuario.password, salt, function(err, hasg){
        if(err){
          console.log(err);
        }
        nuevoUsuario.password = hash;
        nuevoUsuario.save(function(err){
          if(err){
            console.log(err);
            return;
          }else{
            req.flash('success', 'Usuario creado y puede iniciar sesion');
            req.redirect('/usuarios/login');
          }
        });
      });
    });
  }
});

//Ruta Inicio Sesion
router.get('/login', function(req, res){
  res.render('login');
});

// Proceso Login
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/usuarios/login',
    failureFlash: true
  })(req, res, next);
});

// Ruta Cerrar Sesion
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'Cerraste sesion');
  res.redirect('/usuarios/login');
});


module.exports = router;
