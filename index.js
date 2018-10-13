'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const nocache = require('nocache');
const rp = require('request-promise');
const {base64encode, base64decode} = require('nodejs-base64');
const uuid1 = require('uuid/v1');
const _config = require('./_config').config;

const app = express();
const PORT = 8090;
let accessToken = "";

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(nocache());
app.use(express.static('static'));

// controllers
var controller = require('./constroller');

app.listen(PORT, function () {
    console.log("Server is listening on " + PORT);
});



//handle routes
app.get('/', controller.init);
app.get('/callback', controller.callBack);
app.get('/posts', controller.getPost);
app.post('/logout', controller.logout);