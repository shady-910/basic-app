/* eslint-disable no-undef */
import { signUpApi } from '@src/constants';
import firebase from '../firebase';

export const signUp = async (
	firstName: string,
	lastName: string,
	email: string,
	password: string,
	role: UserRole
) => {
	const url = `${signUpApi}`;
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ firstName, lastName, role, email, password }),
	});
	return response.json();
};

export const signIn = (email: string, password: string) => {
	return firebase.auth().signInWithEmailAndPassword(email, password);
};

export const signOut = () => {
	return firebase.auth().signOut();
};
