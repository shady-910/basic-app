/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import React from 'react';
import { StyleSheet, Alert, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { Button, TextInput, Divider, RadioButton } from 'react-native-paper';
import { Separator } from '@src/components/Separator';
import { RootStackParamList } from '@src/app/AppNavigation';
import { RouteProp } from '@react-navigation/native';
import { signIn, signUp } from '@src/api/authApi';
import { isValidEmail } from '@src/utils/formValidation';
import { Header } from '@src/components/Header';

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
	route: RouteProp<RootStackParamList, 'SignUp'>;
	navigation: NativeStackNavigationProp<RootStackParamList, 'SignUp'>;
};

export const SignUpScreen: React.FC<Props> = React.memo(({ navigation }) => {
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [firstName, setFirstName] = React.useState('');
	const [lastName, setLastName] = React.useState('');
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [confirmedPassword, setConfirmedPassword] = React.useState('');
	const [role, setRole] = React.useState<UserRole>('client');

	const canSubmit =
		firstName.trim().length &&
		lastName.trim().length &&
		email.trim().length &&
		isValidEmail(email.trim()) &&
		password.trim().length &&
		password === confirmedPassword;

	const handleReturnPress = React.useCallback(() => {
		navigation.pop();
	}, [navigation]);

	const handleSubmitPress = React.useCallback(() => {
		const submit = async () => {
			setIsSubmitting(true);
			try {
				const response = await signUp(
					firstName.trim(),
					lastName.trim(),
					email.trim(),
					password,
					role
				);

				if (response.user) {
					signIn(email.trim(), password.trim());
				} else {
					throw response;
				}
			} catch (error) {
				Alert.alert(error.message);
				setIsSubmitting(false);
			}
		};
		submit();
	}, [firstName, lastName, email, password, role, navigation]);

	return (
		<View style={styles.container}>
			<Header title="Sign Up" onReturnPress={handleReturnPress} />
			<KeyboardAwareScrollView
				style={styles.scrollContainer}
				contentContainerStyle={styles.scrollContent}
				pointerEvents={isSubmitting ? 'none' : 'auto'}
				directionalLockEnabled
				keyboardDismissMode="on-drag"
				extraScrollHeight={16}
			>
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
				<Separator />
				<TextInput
					label="Email"
					keyboardType="email-address"
					value={email}
					onChangeText={setEmail}
					disableFullscreenUI
					autoCapitalize="none"
				/>
				<Separator />
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
				<Separator />
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
					</RadioButton.Group>
				</>
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
