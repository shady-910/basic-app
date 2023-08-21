'use strict';

const { db } = require('../config/firebase');
async function createProperty(req, res) {
	try {
		const { available, name, description, sizeSqm, pcmGbp, numRooms, coordinate, id } =
			req.body;
		if (!id || !name || !description || !pcmGbp || !sizeSqm || !numRooms || !coordinate) {
			return res.status(400).send({ message: 'Missing fields' });
		}
		const data = {
			available,
			name,
			description,
			pcmGbp,
			sizeSqm,
			numRooms,
			coordinate,
			createTime: Date.now(),
			creatorUserId: id,
		};
		return res.status(201).send(await db.collection('properties').add(data));
	} catch (err) {
		return handleError(res, err);
	}
}
exports.createProperty = createProperty;

async function allProperties(req, res) {
	try {
		const items = [];
		const collectionRef = db.collection('properties');
		const querySnapshot = await collectionRef.orderBy('createTime', 'desc').get();
		querySnapshot.docs.map((documentSnapshot) => {
			items.push({
				id: documentSnapshot.id,
				data: documentSnapshot.data(),
			});
		});
		return res.status(200).send({ items });
	} catch (err) {
		return handleError(res, err);
	}
}
exports.allProperties = allProperties;

async function patchProperty(req, res) {
	try {
		const { id } = req.params;
		const {
			available,
			name,
			description,
			pcmGbp,
			sizeSqm,
			numRooms,
			coordinate,
			creatorUserId,
		} = req.body;

		if (
			!creatorUserId ||
			!name ||
			!description ||
			!pcmGbp ||
			!sizeSqm ||
			!numRooms ||
			!coordinate
		) {
			return res.status(400).send({ message: 'Missing fields' });
		}
		const data = {
			available,
			name,
			description,
			pcmGbp,
			sizeSqm,
			numRooms,
			coordinate,
			creatorUserId,
		};
		return res
			.status(204)
			.send(await db.collection('properties').doc(id).set(data, { merge: true }));
	} catch (err) {
		return handleError(res, err);
	}
}
exports.patchProperty = patchProperty;

async function removeProperty(req, res) {
	try {
		const { id } = req.params;
		await db.collection('properties').doc(id).delete();
		return res.status(204).send({});
	} catch (err) {
		return handleError(res, err);
	}
}
exports.removeProperty = removeProperty;

function handleError(res, err) {
	return res.status(500).send({ message: `${err.code} - ${err.message}` });
}
