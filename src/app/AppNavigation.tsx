/* eslint-disable no-undef */
import React from 'react';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { useAccountState } from '@src/contexts/accountContext';
import { IntroScreen } from '@src/screens/IntroScreen';
import { SignInScreen } from '@src/screens/SignInScreen';
import { SignUpScreen } from '@src/screens/SignUpScreen';
import { MainTabScreen } from '../screens/MainTabScreen';
import { PropertyScreen } from '@src/screens/PropertyScreen';
import { PropertyEditScreen } from '@src/screens/PropertyEditScreen';
import { UserScreen } from '@src/screens/UserScreen';
import { UserEditScreen } from '@src/screens/UserEditScreen';
import { FilterPriceScreen } from '@src/utils/filterPrice';
import { FilterSizeScreen } from '@src/utils/filterSize';
import { FilterRoomsScreen } from '@src/utils/filterRooms';
import { LocationSearchScreen } from '@src/screens/LocationSearchScreen';

enableScreens();

export type RootStackParamList = {
	// Screens before signing in
	Intro: undefined;
	SignIn: undefined;
	SignUp: undefined;
	ResetPassword: undefined;
	// Screens after signing in
	MainTab: undefined;
	Property: { item: Property };
	PropertyEdit:
		| {
				item?: Property;
				coordinate?: {
					latitude: number;
					longitude: number;
				};
		  }
		| undefined;
	User: { item: User };
	UserEdit: { item: User } | undefined;
	FilterPrice: undefined;
	FilterSize: undefined;
	FilterRooms: undefined;
	LocationSearch: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigation: React.FC = React.memo(() => {
	const accountState = useAccountState();

	const isSignedIn = React.useMemo(() => {
		return !!accountState.user;
	}, [accountState.user]);

	return (
		<NavigationContainer>
			<RootStack.Navigator
				screenOptions={{ stackPresentation: 'modal', headerShown: false }}
			>
				{!isSignedIn && (
					<>
						<RootStack.Screen name="Intro" component={IntroScreen} />
						<RootStack.Screen name="SignIn" component={SignInScreen} />
						<RootStack.Screen name="SignUp" component={SignUpScreen} />
					</>
				)}
				{isSignedIn && (
					<>
						<RootStack.Screen name="MainTab" component={MainTabScreen} />
						<RootStack.Screen name="Property" component={PropertyScreen} />
						<RootStack.Screen name="PropertyEdit" component={PropertyEditScreen} />
						<RootStack.Screen name="User" component={UserScreen} />
						<RootStack.Screen name="UserEdit" component={UserEditScreen} />
						<RootStack.Screen name="FilterPrice" component={FilterPriceScreen} />
						<RootStack.Screen name="FilterSize" component={FilterSizeScreen} />
						<RootStack.Screen name="FilterRooms" component={FilterRoomsScreen} />
						<RootStack.Screen name="LocationSearch" component={LocationSearchScreen} />
					</>
				)}
			</RootStack.Navigator>
		</NavigationContainer>
	);
});
