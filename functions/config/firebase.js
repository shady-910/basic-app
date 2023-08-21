'use strict';

const admin = require('firebase-admin');
exports.admin = admin;
const functions = require('firebase-functions');
admin.initializeApp({
	credential: admin.credential.cert({
		privateKey: functions.config().private.key.replace(/\\n/g, '\n'),
		projectId: functions.config().project.id,
		clientEmail: functions.config().client.email,
	}),
	databaseURL: 'https://manage-apartments-rentals.firebaseio.com',
});
const db = admin.firestore();
exports.db = db;
