import React from 'react';
import { StyleSheet, Alert, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { Button, TextInput } from 'react-native-paper';
import { Separator } from '@src/components/Separator';
import { RootStackParamList } from '@src/app/AppNavigation';
import { RouteProp } from '@react-navigation/native';
import { signIn } from '@src/api/authApi';
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
	route: RouteProp<RootStackParamList, 'SignIn'>;
	navigation: NativeStackNavigationProp<RootStackParamList, 'SignIn'>;
};

export const SignInScreen: React.FC<Props> = React.memo(({ navigation }) => {
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');

	const canSubmit =
		email.trim().length && isValidEmail(email.trim()) && password.trim().length;

	const handleReturnPress = React.useCallback(() => {
		navigation.pop();
	}, [navigation]);

	const handleSubmitPress = React.useCallback(() => {
		const submit = async () => {
			setIsSubmitting(true);
			try {
				await signIn(email.trim(), password);
			} catch (error) {
				Alert.alert(error.message);
				setIsSubmitting(false);
			}
		};
		submit();
	}, [email, password]);

	return (
		<View style={styles.container}>
			<Header title="Sign In" onReturnPress={handleReturnPress} />
			<KeyboardAwareScrollView
				style={styles.scrollContainer}
				contentContainerStyle={styles.scrollContent}
				pointerEvents={isSubmitting ? 'none' : 'auto'}
				directionalLockEnabled
				keyboardDismissMode="on-drag"
				extraScrollHeight={16}
			>
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
