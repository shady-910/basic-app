import './fixAndroidFirebaseWarning';
import React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import firebase from '../firebase';
import { useAccountDispatch } from '@src/contexts/accountContext';
import { useFiltersDispatch } from '@src/contexts/filtersContext';
import { getDefaultUserData, setUserData, getUserData } from '@src/api/userApi';
import { Provider as PaperProvider } from 'react-native-paper';
import { AppProvider } from './AppProvider';
import { AppNavigation } from './AppNavigation';
import { theme } from '@src/constants/theme';

const App: React.FC = React.memo(() => {
	const accountDispatch = useAccountDispatch();
	const filtersDispatch = useFiltersDispatch();
	const [isAppReady, setIsAppReady] = React.useState(false);

	// Prevent native splash screen from autohiding on mount
	React.useEffect(() => {
		SplashScreen.preventAutoHideAsync();
	}, []);

	// Update user context when signing in/out
	React.useEffect(() => {
		let hasStartedApp = false;
		const unsubscriber = firebase.auth().onAuthStateChanged(async (authUser: any) => {
			if (authUser) {
				let token = await authUser?.getIdToken().then((data: any) => {
					return data;
				});
				token = JSON.stringify(token).slice(1, -1);
				let data = await getUserData(authUser?.uid, token);
				data = data.user.data;
				if (!data) {
					data = getDefaultUserData();
					await setUserData(authUser?.uid, data, token);
				}
				if (data.role === 'client') {
					filtersDispatch({ type: 'SET_AVAILABLE', payload: true });
				}
				accountDispatch({
					type: 'SET',
					payload: {
						authUser: {
							uid: authUser.uid,
							email: authUser.email || '',
						},
						user: {
							id: authUser.uid,
							data: {
								role: data.role || '',
								firstName: data.firstName || '',
								lastName: data.lastName || '',
								email: data.email || '',
							},
							idToken: token || '',
						},
					},
				});
			} else {
				accountDispatch({ type: 'RESET' });
				filtersDispatch({ type: 'RESET' });
			}

			// Hide splash screen and show app navigation after first auth state change
			if (!hasStartedApp) {
				hasStartedApp = true;
				setIsAppReady(true);
				setTimeout(() => {
					SplashScreen.hideAsync();
				}, 200);
			}
		});
		return () => {
			unsubscriber();
		};
	}, [accountDispatch, filtersDispatch]);

	if (!isAppReady) {
		return null;
	}

	return <AppNavigation />;
});

export const AppWithProvider: React.FC = React.memo(() => {
	return (
		<AppProvider>
			<PaperProvider theme={theme}>
				<App />
			</PaperProvider>
		</AppProvider>
	);
});
