'use strict';

const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { routesConfig } = require('./routes-config');
const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: true }));
routesConfig(app);

exports.api = functions.https.onRequest(app);
