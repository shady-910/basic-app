/* eslint-disable no-undef */
import { usersApi } from '../constants';

export const getDefaultUserData = (
	role: UserRole = 'client',
	firstName: string = '',
	lastName: string = '',
	email: string = ''
) => {
	const data: UserData = {
		role: role,
		firstName,
		lastName,
		email,
	};
	return data;
};

export const getUserData = async (id: string, token: any) => {
	const url = `${usersApi}/${id}`;
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

export const deleteUserData = async (id: string, token: any) => {
	const url = `${usersApi}/${id}`;
	await fetch(url, {
		method: 'DELETE',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `${'Bearer ' + token}`,
		},
	});
};

export const getUsers = async (token: any) => {
	const url = `${usersApi}`;
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

export const addUserData = async (
	data: any,
	email: string,
	password: string,
	token: any = ''
) => {
	const { firstName, lastName, role } = data;
	const url = `${usersApi}`;
	await fetch(url, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `${'Bearer ' + token}`,
		},
		body: JSON.stringify({ firstName, lastName, role, email, password }),
	});
};

export const setUserData = async (id: string, data: any, token: any) => {
	const { firstName, lastName, role } = data;
	const url = `${usersApi}/${id}`;
	await fetch(url, {
		method: 'PATCH',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `${'Bearer ' + token}`,
		},
		body: JSON.stringify({ firstName, lastName, role }),
	});
};
