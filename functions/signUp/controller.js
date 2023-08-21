const { admin } = require('../config/firebase');

async function createUserWithoutAuth(req, res) {
	try {
		const { firstName, lastName, email, password, role } = req.body;

		if (!firstName || !lastName || !password || !email || !role) {
			return res.status(400).send({ message: 'Missing fields' });
		}

		if (role === 'admin') return res.status(401).send({ message: 'Unauthorized' });

		const displayName = firstName + ' ' + lastName;

		const user = await admin.auth().createUser({
			displayName,
			password,
			email,
		});

		if (email === 'admin@rentalapp.com') {
			await admin.auth().setCustomUserClaims(user.uid, { role: 'admin' });
		}

		await admin.auth().setCustomUserClaims(user.uid, { role });

		return res.status(201).send({ user: mapUser(user) });
	} catch (err) {
		return handleError(res, err);
	}
}
exports.createUserWithoutAuth = createUserWithoutAuth;

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
