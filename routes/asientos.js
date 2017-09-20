const express = require('express');
const router = express.Router();

// Traemos el modelo de asientos
let Asiento = require('../models/asiento');

// Ruta Agregar GET
router.get('/agregar', ensureAuthenticated, function(req, res){
  res.render('agregar_asiento', {
    title: 'Agregar Asiento'
  });
});

// Ruta Agregar POST
router.post('/agregar', function(req, res){
  req.checkBody('fecha', 'Debe ingresar la fecha').notEmpty();
  req.checkBody('cuentaDebe', 'Debe ingresar la cuenta debe').notEmpty();
  req.checkBody('cuentaHaber', 'Debe ingresar la cuenta haber').notEmpty();
  req.checkBody('debe', 'Debe ingresar el monto debe').notEmpty();
  req.checkBody('haber', 'Debe ingresar el monto haber').notEmpty();

  // Tratar errores
  let errors = req.validationErrors();

  if(errors){
    res.render('agregar_asiento', {
      title: 'Agregar Asiento',
      errors: errors
    });
  } else {
    let asiento = new Asiento();

    asiento.fecha = req.body.fecha;
    asiento.cuentaDebe = req.body.cuentaDebe;
    asiento.cuentaHaber = req.body.cuentaHaber;
    // let cuentaDebeSeleccionada = document.getElementById('cuentaDebe');
    // asiento.cuentaDebe = cuentaDebeSeleccionada.options[cuentaDebeSeleccionada.index].value;
    // let cuentaHaberSeleccionada = document.getElementById('cuentaHaber');
    // asiento.cuentaHaber = cuentaHaberSeleccionada.options[cuentaHaberSeleccionada.index].value;
    asiento.debe = req.body.debe;
    asiento.haber = req.body.haber;

    asiento.save(function (err) {
      if (err) {
        console.log(err);
        return;
      } else {
        req.flash('success', 'Asiento Agregado');
        res.redirect('/');
      }
    });
  }
});



// Ruta Asiento Realizados
router.get('/realizados', ensureAuthenticated, function(req, res){
  Asiento.find({}, function(err, asientos){
    if (err){
      console.log(err);
    } else {
      res.render('asientos_realizados', {
        title: 'Asientos Realizados',
        asientos: asientos
      });
    }
  });
});


// Ruta Filtrar Asiento
router.get('/filtrar', ensureAuthenticated, function(req, res){
  res.render('filtrar_asientos', {
    title: 'Filtrar Por Cuentas',
  });
});

// Ruta Filtrar Asiento
router.post('/filtrar', function(req, res){
  req.checkBody('cuenta', 'Debe ingresar la cuenta a filtrar').notEmpty();

  // Tratar errores
  let errors = req.validationErrors();

  if(errors){
    res.render('filtrar_asientos', {
      title: 'Filtrar Por Cuentas',
      errors: errors
    });
  } else {
    req.flash('success', 'Usted filtro por ' + req.body.cuenta);
    res.redirect('/');
  }
});

// Control de Acceso
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }else {
    req.flash('danger', 'Por favor inicie sesion');
    res.redirect('/usuarios/login');
  }
}


module.exports = router;
