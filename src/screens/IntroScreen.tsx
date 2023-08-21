import React from 'react';
import { StyleSheet, View, Image, useWindowDimensions, PixelRatio } from 'react-native';
import { Title, Headline, Button, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { Separator } from '@src/components/Separator';
import { RootStackParamList } from '@src/app/AppNavigation';
import { RouteProp } from '@react-navigation/native';
import { useSafeArea } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#1e56d9',
	},
	background: {
		...StyleSheet.absoluteFillObject,
		opacity: 0.4,
	},
	foreground: {
		flex: 1,
	},
	space: {
		flex: 1,
	},
	content: {
		alignItems: 'center',
	},
	title: {
		color: '#FFFFFF',
		textAlign: 'center',
		fontSize: 52,
		fontWeight: 'bold',
		lineHeight: 52,
		letterSpacing: 5,
	},
	headline: {
		color: '#FFFFFF',
		textAlign: 'center',
	},
});

type Props = {
	route: RouteProp<RootStackParamList, 'Intro'>;
	navigation: NativeStackNavigationProp<RootStackParamList, 'Intro'>;
};

export const IntroScreen: React.FC<Props> = React.memo(({ navigation }) => {
	const windowDimensions = useWindowDimensions();
	const insets = useSafeArea();

	const handleSignInPress = React.useCallback(() => {
		navigation.navigate('SignIn');
	}, [navigation]);

	const handleSignUpPress = React.useCallback(() => {
		navigation.navigate('SignUp');
	}, [navigation]);

	return (
		<View style={styles.container}>
			<Image
				style={styles.background}
				source={{
					uri: `https://source.unsplash.com/${PixelRatio.getPixelSizeForLayoutSize(
						windowDimensions.width
					)}x${PixelRatio.getPixelSizeForLayoutSize(
						windowDimensions.height
					)}?home,interior,living room,bright`,
				}}
				resizeMode="cover"
			/>
			<LinearGradient
				style={[
					styles.foreground,
					{
						paddingTop: insets.top + 32,
						paddingBottom: insets.bottom + 32,
						paddingLeft: insets.left + 16,
						paddingRight: insets.right + 16,
					},
				]}
				colors={['rgba(97,0,238,0)', '#004bee66', 'rgba(30, 86, 217, 0)']}
				locations={[0, 0.8, 1]}
			>
				<View style={styles.space} />
				<View style={styles.content}>
					<IconButton
						icon="home-city"
						color="#fff"
						size={windowDimensions.width * 0.23}
					/>
					<Title style={styles.title}>Apartments Rentals</Title>
					<Separator />
					<Headline style={styles.headline}>Rent an apartment.</Headline>
				</View>
				<View style={styles.space} />
				<View>
					<Button mode="contained" color="#FFFFFF" onPress={handleSignInPress}>
						Sign In
					</Button>
					<Separator />
					<Button mode="outlined" color="#FFFFFF" onPress={handleSignUpPress}>
						Sign Up
					</Button>
				</View>
			</LinearGradient>
		</View>
	);
});
