import React from 'react';
import Constants from 'expo-constants';
import { StyleSheet, View } from 'react-native';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { RootStackParamList } from '@src/app/AppNavigation';
import { RouteProp } from '@react-navigation/native';
import {
	GooglePlacesAutocomplete,
	GooglePlaceData,
	GooglePlaceDetail,
	Query,
} from 'react-native-google-places-autocomplete';
import { Header } from '@src/components/Header';

const QUERY: Query = {
	key: Constants.manifest?.extra?.googleMapsApiKey,
	language: 'en',
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f6f8fa',
	},
});

type Props = {
	route: RouteProp<RootStackParamList, 'LocationSearch'>;
	navigation: NativeStackNavigationProp<RootStackParamList, 'LocationSearch'>;
};

export const LocationSearchScreen: React.FC<Props> = React.memo(({ navigation }) => {
	const handleReturnPress = React.useCallback(() => {
		navigation.pop();
	}, [navigation]);

	const handlePress = React.useCallback(
		(_: GooglePlaceData, details: GooglePlaceDetail | null) => {
			if (details) {
				const { location } = details.geometry;
				navigation.navigate('PropertyEdit', {
					coordinate: {
						latitude: location.lat,
						longitude: location.lng,
					},
				});
			}
		},
		[navigation]
	);

	return (
		<View style={styles.container}>
			<Header title="Set Location" onReturnPress={handleReturnPress} />
			<GooglePlacesAutocomplete
				placeholder="Search"
				onPress={handlePress}
				query={QUERY}
				debounce={300}
				minLength={2}
				fetchDetails
				enablePoweredByContainer={false}
				textInputProps={{
					disableFullscreenUI: false,
				}}
				styles={{
					textInputContainer: {
						height: 80,
						backgroundColor: '#fff',
						alignItems: 'center',
					},
					textInput: {
						margin: 0,
						padding: 0,
						height: 32 * 1.5,
						fontSize: 32,
					},
				}}
			/>
		</View>
	);
});
