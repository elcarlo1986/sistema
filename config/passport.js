const LocalSatrategy = require('passport-local').Strategy;
const User = require('../models/usuario');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
  // Estrategia Local
  passport.use(new LocalSatrategy(function(username, password, done){
    // Verificar Nombre de Usuario
    let query = {username: username};
    User.findOne(query, function (err, user){
      if(err) throw err;
      if(!user){
        return done(null, false, {message: 'Usuario no existente'});
      }

      //Verificar Password
      bcrypt.compare(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        }else{
          return done(null, false, {message: 'Contraseña incorrecta'});
        }
      });
    });
  }));

  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
      done(err, user);
    });
  });

}
