import * as FirebaseCore from 'expo-firebase-core';
import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/firestore';

export const getFirebaseApp = (name: string = '[DEFAULT]') => {
	const hasInitializedFirebaseApp = firebase.apps.some((item: any) => item.name === name);
	return hasInitializedFirebaseApp
		? firebase.app(name)
		: firebase.initializeApp(FirebaseCore.DEFAULT_WEB_APP_OPTIONS as any, name);
};

export default getFirebaseApp();
