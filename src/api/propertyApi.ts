/* eslint-disable no-undef */
import { propertiesApi } from '../constants';

export const addPropertyData = async (data: any, id: string, token: any) => {
	const { available, name, description, sizeSqm, pcmGbp, numRooms, coordinate } = data;
	const url = propertiesApi;
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `${'Bearer ' + token}`,
		},
		body: JSON.stringify({
			available,
			name,
			description,
			sizeSqm,
			pcmGbp,
			numRooms,
			coordinate,
			id,
		}),
	});
	return response.json();
};

export const setPropertyData = async (id: string, data: NewPropertyData, token: any) => {
	const {
		available,
		name,
		description,
		pcmGbp,
		sizeSqm,
		numRooms,
		coordinate,
		creatorUserId,
	} = data;

	const url = `${propertiesApi}/${id}`;
	await fetch(url, {
		method: 'PATCH',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `${'Bearer ' + token}`,
		},
		body: JSON.stringify({
			available,
			name,
			description,
			pcmGbp,
			sizeSqm,
			numRooms,
			coordinate,
			creatorUserId,
		}),
	});
};

export const deletePropertyData = async (id: string, token: any) => {
	const url = `${propertiesApi}/${id}`;
	await fetch(url, {
		method: 'DELETE',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `${'Bearer ' + token}`,
		},
	});
};

export const getProperties = async (token: any) => {
	const url = `${propertiesApi}`;
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `${'Bearer ' + token}`,
		},
	});
	return response.json();
};
