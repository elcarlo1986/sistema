let mongoose = require('mongoose');

// Esquema del asientos

let asientoSchema = mongoose.Schema({
  fecha:{
    type: String,
    required: true
  },
  cuentaDebe: {
    type: String,
    required: true
  },
  cuentaHaber: {
    type: String,
    required: true
  },
  debe: {
    type: String,
    required: true
  },
  haber: {
    type: String,
    required: true
  }
});

let Asiento = module.exports = mongoose.model('Asiento', asientoSchema);
