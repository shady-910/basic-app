/* eslint-disable no-undef */
import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { Button } from 'react-native-paper';
import { MainTabParamList } from '@src/screens/MainTabScreen';
import { Separator } from '@src/components/Separator';
import { useAccountState } from '@src/contexts/accountContext';
import { RouteProp, CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { RootStackParamList } from '@src/app/AppNavigation';
import { signOut } from '@src/api/authApi';
import { UserCard } from '@src/components/UserCard';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f6f8fa',
		padding: 16,
		justifyContent: 'center',
	},
});

type Props = {
	route: RouteProp<MainTabParamList, 'Settings'>;
	navigation: CompositeNavigationProp<
		MaterialBottomTabNavigationProp<MainTabParamList, 'Settings'>,
		NativeStackNavigationProp<RootStackParamList>
	>;
};

export const SettingsScreen: React.FC<Props> = React.memo(({ navigation }) => {
	const accountState = useAccountState();

	const handleUserPress = React.useCallback(
		(userItem: User) => {
			navigation.push('User', { item: userItem });
		},
		[navigation]
	);

	const handleSignOutPress = React.useCallback(() => {
		const submit = async () => {
			try {
				await signOut();
			} catch (error) {
				Alert.alert(error.message);
			}
		};
		Alert.alert(
			'Are you sure you want to sign out from your account?',
			undefined,
			[
				{ text: 'Cancel', onPress: () => {}, style: 'cancel' },
				{ text: 'Sign out', onPress: submit },
			],
			{ cancelable: false }
		);
	}, []);

	return (
		<View style={styles.container}>
			<UserCard item={accountState.user!} onPress={handleUserPress} />
			<Separator variant="large" />
			<Button mode="contained" onPress={handleSignOutPress}>
				Sign Out
			</Button>
		</View>
	);
});
