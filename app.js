const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

mongoose.connect(config.database);
let db = mongoose.connection;

// Chequear conexion
db.once('open', function(){
  console.log('Conectado a MongoDb');
});

// Chequear errores de la BD
db.on('error', function(err){
  console.log(err);
});

// Iniciando sistema
const app = express();

// Trayendo el modelo
let Asiento = require('./models/asiento');

// Cargar motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

//Carpeta Publica
app.use(express.static(path.join(__dirname, 'public')));

//Express Session Middleware
app.use(session({
  secret: 'tortugas ninjas',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg : msg,
      value : value
    };
  }
}));

// Configuracion passport
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();  
});

// Pagina Inicio
app.get('/', function(req, res){
  res.render('index', {
    title: 'Sistema De Gestion Contable'
  });
});

// Archivo de Rutas
let asientos = require('./routes/asientos');
let usuarios = require('./routes/usuarios');

app.use('/asientos', asientos);
app.use('/usuarios', usuarios);




// Ruta Acerca De
app.get('/acercade', function(req, res){
  res.render('acercade', {
    title: 'Sobre el Sistema y sus desarrolladores'
  });
});

// Ruta Contacto
app.get('/contacto', function(req, res){
  res.render('contacto', {
    title: 'Deja tu mensaje'
  });
});



// Iniciar Servidor
app.listen(3000, function(){
    console.log('Server started on port 3000...');
});
