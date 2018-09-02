//libs
const
  express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  app = express(),
  cors = require('cors'),
  expressValidator = require('express-validator'),
  fs = require('fs'),
  status = require('./utils/status');

//config
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.urlencoded({extended: true})); //support x-www-form-urlencoded
app.use(bodyParser.json());
app.use(expressValidator());

//set default route
app.get('/', (req, res)=>
  res.send(`<h1>Server is up</h1>`)
);

//loads all route files in routes folder
fs.readdirSync(__dirname + '/routes').forEach(file=> require(__dirname + '/routes/' + file).init(app, status));

let admin = require("firebase-admin");
// let serviceAccount = require("./assets/eye-of-power-firebase-adminsdk-61tjx-8cbad1a372.json");

admin.initializeApp({
  // credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://vampirevillage-1a0e0.firebaseio.com'
});

//start Server
const server = app.listen(3001, ()=>console.log(`Listening to port ${server.address().port}`));
