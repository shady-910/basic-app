/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, Divider, TextInput, RadioButton } from 'react-native-paper';
import { RootStackParamList } from '@src/app/AppNavigation';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { Separator } from '@src/components/Separator';
import { RouteProp } from '@react-navigation/native';
import { Header } from '@src/components/Header';
import { useAccountState, useAccountDispatch } from '@src/contexts/accountContext';
import { setUserData, addUserData, deleteUserData } from '@src/api/userApi';
import { isValidEmail } from '@src/utils/formValidation';
import { useFiltersDispatch } from '@src/contexts/filtersContext';
import { signOut } from '@src/api/authApi';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f6f8fa',
	},
	scrollContainer: {
		flex: 1,
		zIndex: -1,
	},
	scrollContent: {
		paddingHorizontal: 16,
		paddingVertical: 32,
	},
});

type Props = {
	route: RouteProp<RootStackParamList, 'UserEdit'>;
	navigation: NativeStackNavigationProp<RootStackParamList, 'UserEdit'>;
};

export const UserEditScreen: React.FC<Props> = React.memo(({ route, navigation }) => {
	const accountState = useAccountState();
	const accountDispatch = useAccountDispatch();
	const filtersDispatch = useFiltersDispatch();

	const isAdmin = accountState.user?.data.role === 'admin';
	const token = accountState.user?.idToken;

	const isNew = !route.params?.item;

	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [firstName, setFirstName] = React.useState(
		route.params?.item.data.firstName || ''
	);
	const [lastName, setLastName] = React.useState(route.params?.item.data.lastName || '');

	const [email, setEmail] = React.useState(
		accountState.user?.id === route.params?.item.id
			? accountState.authUser?.email || ''
			: ''
	);
	const [role, setRole] = React.useState<UserRole>(
		route.params?.item.data.role || 'client'
	);
	const [password, setPassword] = React.useState('');
	const [confirmedPassword, setConfirmedPassword] = React.useState('');

	let canSubmit = Boolean(firstName.trim().length && lastName.trim().length);
	if (isNew) {
		canSubmit = Boolean(
			canSubmit &&
				email.trim().length &&
				isValidEmail(email.trim()) &&
				password.trim().length &&
				password === confirmedPassword
		);
	}

	const handleReturnPress = React.useCallback(() => {
		navigation.pop();
	}, [navigation]);

	const handleDeletePress = React.useCallback(() => {
		const submit = async () => {
			setIsSubmitting(true);
			try {
				if (!route.params?.item?.id) {
					return;
				}
				await deleteUserData(route.params.item.id, token);
				navigation.popToTop();
				if (route.params.item.id === accountState.authUser?.uid) {
					await signOut();
				}
			} catch (error) {
				Alert.alert(error.message);
				setIsSubmitting(false);
			}
		};
		Alert.alert(
			'Are you sure you want to delete this user?',
			undefined,
			[
				{ text: 'Cancel', onPress: () => {}, style: 'cancel' },
				{ text: 'Delete', onPress: submit },
			],
			{ cancelable: false }
		);
	}, [navigation, route.params]);

	const handleSubmitPress = React.useCallback(() => {
		const submit = async () => {
			setIsSubmitting(true);
			try {
				const data: UserData = {
					firstName: firstName.trim(),
					lastName: lastName.trim(),
					role,
					email,
				};
				if (route.params?.item.id) {
					await setUserData(route.params?.item.id, data, token);
					if (route.params?.item.id === accountState.user?.id) {
						const authUser = accountState.authUser!;
						if (role === 'client') {
							filtersDispatch({ type: 'SET_AVAILABLE', payload: true });
						}
						accountDispatch({
							type: 'SET',
							payload: {
								authUser,
								user: {
									id: authUser.uid,
									data,
									idToken: accountState.user.idToken,
								},
							},
						});
					}
				} else {
					await addUserData(data, email, password, token);
				}
				navigation.popToTop();
			} catch (error) {
				Alert.alert(error.message);
				setIsSubmitting(false);
			}
		};
		submit();
	}, [
		accountDispatch,
		accountState.authUser,
		accountState.user,
		email,
		filtersDispatch,
		firstName,
		lastName,
		navigation,
		password,
		role,
		route.params,
	]);

	return (
		<View style={styles.container}>
			<Header
				title={`${isNew ? 'Add New' : 'Update'} User`}
				onReturnPress={handleReturnPress}
			/>
			<KeyboardAwareScrollView
				style={styles.scrollContainer}
				contentContainerStyle={styles.scrollContent}
				pointerEvents={isSubmitting ? 'none' : 'auto'}
				directionalLockEnabled
				keyboardDismissMode="on-drag"
				extraScrollHeight={16}
			>
				{isAdmin && !isNew && (
					<>
						<Separator variant="large" />
						<Button mode="outlined" loading={isSubmitting} onPress={handleDeletePress}>
							Delete
						</Button>
						<Separator variant="large" />
						<Divider />
						<Separator variant="large" />
					</>
				)}
				<TextInput
					label="First Name"
					value={firstName}
					onChangeText={setFirstName}
					disableFullscreenUI
				/>
				<Separator />
				<TextInput
					label="Last Name"
					value={lastName}
					onChangeText={setLastName}
					disableFullscreenUI
				/>
				{Boolean(isNew || email) && (
					<>
						<Separator />
						<TextInput
							label="Email"
							keyboardType="email-address"
							value={email}
							onChangeText={setEmail}
							editable={isNew}
							disabled={!isNew}
							disableFullscreenUI
							autoCapitalize="none"
						/>
					</>
				)}
				{isNew && (
					<>
						<Separator variant="large" />
						<Divider />
						<Separator variant="large" />
						<TextInput
							label="Password"
							secureTextEntry
							value={password}
							onChangeText={setPassword}
							disableFullscreenUI
							autoCapitalize="none"
						/>
						<Separator />
						<TextInput
							label="Confirm Password"
							secureTextEntry
							value={confirmedPassword}
							onChangeText={setConfirmedPassword}
							disableFullscreenUI
							autoCapitalize="none"
						/>
					</>
				)}

				{isAdmin && (
					<>
						<Separator variant="large" />
						<Divider />
						<Separator variant="large" />
						<RadioButton.Group
							onValueChange={(value) => setRole(value as UserRole)}
							value={role}
						>
							<RadioButton.Item label="Client" value="client" />
							<Divider />
							<RadioButton.Item label="Realtor" value="realtor" />
							<Divider />
							<RadioButton.Item label="Admin" value="admin" />
						</RadioButton.Group>
					</>
				)}
				<Separator variant="large" />
				<Divider />
				<Separator variant="large" />
				<Button
					mode="contained"
					disabled={!canSubmit}
					onPress={handleSubmitPress}
					loading={isSubmitting}
				>
					Submit
				</Button>
			</KeyboardAwareScrollView>
		</View>
	);
});
