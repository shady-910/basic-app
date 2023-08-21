'use strict';

function hasRole(roles) {
	return (req, res, next) => {
		const { role, email } = res.locals;
		if (email === 'admin@rentalapp.com') return next();
		if (!role) return res.status(403).send();
		if (roles.includes(role)) {
			return next();
		} else {
			return res.status(403).send();
		}
	};
}
exports.hasRole = hasRole;

function isAuthorized(opts) {
	return (req, res, next) => {
		const { role, email, uid } = res.locals;
		const { id } = req.params;
		if (email === 'admin@rentalapp.com') return next();
		if (opts.allowSameUser && id && uid === id) return next();
		if (!role) return res.status(403).send();
		if (opts.hasRole.includes(role)) return next();
		return res.status(403).send();
	};
}
exports.isAuthorized = isAuthorized;
