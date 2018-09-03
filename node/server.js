'use strict';
//libs
const
    express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    app = express(),
    cors = require('cors'),
    expressValidator = require('express-validator'),
    fs = require('fs');

//config
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.urlencoded({extended: true})); //support x-www-form-urlencoded
app.use(bodyParser.json());
app.use(expressValidator());

let admin = require("firebase-admin");
let serviceAccount = require("./assets/vampirevillage-1a0e0-firebase-adminsdk-f1s2v-0922455e1a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://vampirevillage-1a0e0.firebaseio.com/"
});

//set default route
app.get('/', (req, res)=>
    res.send(`<h1>Server is up</h1>`)
);

//loads all route files in routes folder
fs.readdirSync(__dirname + '/routes').forEach(file=> require(__dirname + '/routes/' + file)(app));

//start Server
const server = app.listen(3001, ()=>console.log(`Listening to port ${server.address().port}`));
