'use strict';

const {
	createUser,
	getUser,
	allUsers,
	patchUser,
	removeUser,
} = require('./users/controller');
const { createUserWithoutAuth } = require('./signUp/controller');
const {
	createProperty,
	allProperties,
	patchProperty,
	removeProperty,
} = require('./properties/controller');
const { isAuthenticated } = require('./auth/authenticated');
const { isAuthorized } = require('./auth/authorized');
function routesConfig(app) {
	app.post('/signUp', createUserWithoutAuth);
	app.post('/users', isAuthenticated, isAuthorized({ hasRole: ['admin'] }), createUser);
	app.get('/users/:id', [
		isAuthenticated,
		isAuthorized({ hasRole: ['admin', 'realtor', 'client'], allowSameUser: true }),
		getUser,
	]);
	app.get('/users', [isAuthenticated, isAuthorized({ hasRole: ['admin'] }), allUsers]);
	app.patch('/users/:id', [
		isAuthenticated,
		isAuthorized({
			hasRole: ['admin', 'realtor', 'client'],
			allowSameUser: true,
		}),
		patchUser,
	]);
	app.delete('/users/:id', [
		isAuthenticated,
		isAuthorized({ hasRole: ['admin'] }),
		removeUser,
	]);
	app.post(
		'/properties',
		isAuthenticated,
		isAuthorized({ hasRole: ['admin', 'realtor'] }),
		createProperty
	);
	app.get('/properties', [isAuthenticated, allProperties]);
	app.patch('/properties/:id', [
		isAuthenticated,
		isAuthorized({ hasRole: ['admin', 'realtor'] }),
		patchProperty,
	]);
	app.delete('/properties/:id', [
		isAuthenticated,
		isAuthorized({ hasRole: ['admin', 'realtor'] }),
		removeProperty,
	]);
}
exports.routesConfig = routesConfig;
