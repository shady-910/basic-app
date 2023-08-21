/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { FAB } from 'react-native-paper';
import { FlatList } from 'react-native-gesture-handler';
import { MainTabParamList } from '@src/screens/MainTabScreen';
import { Separator } from '@src/components/Separator';
import { FiltersBar, FilterScreenName } from './FiltersBar';
import { PropertyCard } from './PropertyCard';
import { useAccountState } from '@src/contexts/accountContext';
import {
	RouteProp,
	CompositeNavigationProp,
	useFocusEffect,
} from '@react-navigation/native';
import { RootStackParamList } from '@src/app/AppNavigation';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { getProperties } from '@src/api/propertyApi';
import { useFiltersState } from '@src/contexts/filtersContext';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f6f8fa',
	},
	content: {
		padding: 16,
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
	route: RouteProp<MainTabParamList, 'PropertiesList'>;
	navigation: CompositeNavigationProp<
		MaterialBottomTabNavigationProp<MainTabParamList, 'PropertiesList'>,
		NativeStackNavigationProp<RootStackParamList>
	>;
};

export const PropertiesListTab: React.FC<Props> = React.memo(({ navigation }) => {
	const accountState = useAccountState();
	const canMutateData =
		accountState.user?.data.role === 'admin' ||
		accountState.user?.data.role === 'realtor';

	const filterProperties = accountState.user?.data.role === 'client' ? true : null;

	const filtersState = useFiltersState();
	const token = accountState.user?.idToken;

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
					console.log('Error loading properties', error);
				}
			}
			load();
		}, [filtersState.available])
	);

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

	const renderItem = React.useCallback(
		({ item }: { item: Property }) => {
			return <PropertyCard item={item} onPress={handleItemPress} />;
		},
		[handleItemPress]
	);

	return (
		<View style={styles.container}>
			<FiltersBar onItemPress={handleFilterItemPress} />
			<FlatList
				contentContainerStyle={styles.content}
				data={filteredItems}
				renderItem={renderItem}
				ItemSeparatorComponent={Separator}
				directionalLockEnabled
				ListFooterComponent={() => <View style={{ height: 68 }} />}
			/>
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
