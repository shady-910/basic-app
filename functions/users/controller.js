'use strict';

const { admin, db } = require('../config/firebase');
async function createUser(req, res) {
	try {
		const { firstName, lastName, email, password, role } = req.body;

		if (!firstName || !lastName || !password || !email || !role) {
			return res.status(400).send({ message: 'Missing fields' });
		}

		const displayName = firstName + ' ' + lastName;

		const user = await admin.auth().createUser({
			displayName,
			password,
			email,
		});

		await admin.auth().setCustomUserClaims(user.uid, { role });

		return res.status(201).send({ user: mapUser(user) });
	} catch (err) {
		return handleError(res, err);
	}
}
exports.createUser = createUser;

async function getUser(req, res) {
	try {
		const { id } = req.params;
		if (!id) {
			return res.status(400).send({ message: 'Missing fields' });
		}
		const user = await admin.auth().getUser(id);
		return res.status(200).send({ user: mapUser(user) });
	} catch (err) {
		return handleError(res, err);
	}
}
exports.getUser = getUser;

async function allUsers(req, res) {
	try {
		const listUsers = await admin.auth().listUsers();
		const users = listUsers.users.map(mapUser);
		return res.status(200).send({ users });
	} catch (err) {
		return handleError(res, err);
	}
}
exports.allUsers = allUsers;

async function patchUser(req, res) {
	try {
		const { id } = req.params;
		const { firstName, lastName, role } = req.body;

		if (!id || !firstName || !lastName || !role) {
			return res.status(400).send({ message: 'Missing fields' });
		}
		await admin.auth().setCustomUserClaims(id, { role });
		await admin.auth().updateUser(id, { displayName: `${firstName + ' ' + lastName}` });
		return res.status(204).send({});
	} catch (err) {
		return handleError(res, err);
	}
}
exports.patchUser = patchUser;

async function removeUser(req, res) {
	try {
		const { id } = req.params;
		const user = await admin.auth().getUser(id);
		const role = user.customClaims.role;

		if (role !== 'client') {
			db.collection('properties')
				.get()
				.then((properties) => {
					properties.forEach(async (property) => {
						if (property.data().creatorUserId === id) {
							await db.collection('properties').doc(property.id).delete();
						}
					});
				});
		}

		await admin.auth().deleteUser(id);

		return res.status(204).send({});
	} catch (err) {
		return handleError(res, err);
	}
}
exports.removeUser = removeUser;

function handleError(res, err) {
	return res.status(500).send({ message: `${err.code} - ${err.message}` });
}

function mapUser(user) {
	const customClaims = user.customClaims || { role: '' };
	const role = customClaims.role ? customClaims.role : '';
	const username = user.displayName ? user.displayName.split(' ') : '';
	return {
		id: user.uid,
		data: {
			firstName: username[0] || '',
			lastName: username[1] || '',
			role,
			email: user.email,
		},
	};
}
