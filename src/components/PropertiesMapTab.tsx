/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import React from 'react';
import { StyleSheet, View, Platform, PixelRatio } from 'react-native';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { FAB, Text } from 'react-native-paper';
import MapView, {
	Marker,
	LatLng,
	EdgePadding,
	Callout,
	PROVIDER_GOOGLE,
} from 'react-native-maps';
import { MainTabParamList } from '@src/screens/MainTabScreen';
import { FiltersBar, FilterScreenName } from './FiltersBar';
import { useAccountState } from '@src/contexts/accountContext';
import {
	RouteProp,
	CompositeNavigationProp,
	useFocusEffect,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { RootStackParamList } from '@src/app/AppNavigation';
import { getProperties } from '@src/api/propertyApi';
import { mapStyle } from '../constants/mapStyle';
import { useFiltersState } from '@src/contexts/filtersContext';

const EDGE_PADDING: EdgePadding = Platform.select({
	android: {
		top: PixelRatio.getPixelSizeForLayoutSize(64),
		bottom: PixelRatio.getPixelSizeForLayoutSize(64),
		left: PixelRatio.getPixelSizeForLayoutSize(32),
		right: PixelRatio.getPixelSizeForLayoutSize(32),
	},
	default: {
		top: 64 * 2,
		bottom: 64 * 2,
		left: 32 * 2,
		right: 32 * 2,
	},
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f6f8fa',
	},
	content: {
		flex: 1,
	},
	addButton: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 0,
		backgroundColor: '#1e56d9',
		color: 'white',
	},
});

type Props = {
	route: RouteProp<MainTabParamList, 'PropertiesMap'>;
	navigation: CompositeNavigationProp<
		MaterialBottomTabNavigationProp<MainTabParamList, 'PropertiesMap'>,
		NativeStackNavigationProp<RootStackParamList>
	>;
};

export const PropertiesMapTab: React.FC<Props> = React.memo(({ navigation }) => {
	const accountState = useAccountState();
	const canMutateData =
		accountState.user?.data.role === 'admin' ||
		accountState.user?.data.role === 'realtor';

	const filterProperties = accountState.user?.data.role === 'client' ? true : null;

	const filtersState = useFiltersState();
	const token = accountState.user?.idToken;

	const mapViewRef = React.useRef<MapView>(null);

	const [items, setItems] = React.useState<Property[]>([]);
	const filteredItems = React.useMemo(() => {
		let value = items;
		if (filtersState.maxPcmGbp !== null) {
			value = value.filter((item) => item.data.pcmGbp <= filtersState.maxPcmGbp!);
		}
		if (filtersState.minSizeSqm !== null) {
			value = value.filter((item) => item.data.sizeSqm >= filtersState.minSizeSqm!);
		}
		if (filtersState.minNumRooms !== null) {
			value = value.filter((item) => item.data.numRooms >= filtersState.minNumRooms!);
		}
		return value;
	}, [filtersState.maxPcmGbp, filtersState.minNumRooms, filtersState.minSizeSqm, items]);

	useFocusEffect(
		React.useCallback(() => {
			async function load() {
				try {
					const data = await getProperties(token);
					const filteredProperties = data.items.filter((property: any) => {
						return filterProperties ? property.data.available === filterProperties : true;
					});
					setItems(filteredProperties);
				} catch (error) {
					console.log('Error loading property', error);
				}
			}
			load();
		}, [filtersState.available])
	);

	React.useLayoutEffect(() => {
		if (!filteredItems.length) {
			return;
		}
		const coordinates: LatLng[] = filteredItems.map((item) => item.data.coordinate);
		mapViewRef.current?.fitToCoordinates(coordinates, {
			edgePadding: EDGE_PADDING,
			animated: true,
		});
	}, [filteredItems]);

	const handleFilterItemPress = React.useCallback(
		(filterScreenName: FilterScreenName) => {
			navigation.push(filterScreenName);
		},
		[navigation]
	);

	const handleItemPress = React.useCallback(
		(item: Property) => {
			navigation.push('Property', { item });
		},
		[navigation]
	);

	const handleAddPress = React.useCallback(() => {
		navigation.push('PropertyEdit');
	}, [navigation]);

	return (
		<View style={styles.container}>
			<FiltersBar onItemPress={handleFilterItemPress} />
			<MapView
				ref={mapViewRef}
				provider={PROVIDER_GOOGLE}
				customMapStyle={mapStyle}
				style={styles.content}
				showsUserLocation
			>
				{filteredItems.map((item) => {
					return (
						<Marker
							key={item.id}
							coordinate={item.data.coordinate}
							pinColor="#1e56d9"
							opacity={item.data.available ? 1 : 0.5}
						>
							<Callout onPress={() => handleItemPress(item)}>
								<Text style={{ textAlign: 'center', maxWidth: 125 }}>
									{item.data.name}
								</Text>
							</Callout>
						</Marker>
					);
				})}
			</MapView>
			{canMutateData && (
				<FAB
					style={styles.addButton}
					icon="map-marker-plus"
					color="#FFFFFF"
					label="Add"
					onPress={handleAddPress}
				/>
			)}
		</View>
	);
});
