/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import React from 'react';
import { StyleSheet, View, ScrollView, useWindowDimensions } from 'react-native';
import { Title, Paragraph, List, Divider, Caption } from 'react-native-paper';
import formatDistance from 'date-fns/formatDistance';
import { RootStackParamList } from '@src/app/AppNavigation';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Header } from '@src/components/Header';
import { useAccountState } from '@src/contexts/accountContext';
import MapView, { LatLng, Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { getLngDeltaFromLatDelta } from '@src/utils/map';
import { mapStyle } from '../constants/mapStyle';
import { getUserData } from '@src/api/userApi';
import { UserCard } from '@src/components/UserCard';
import { getDisplayPrice } from '@src/utils/price';
import { Separator } from '@src/components/Separator';

const INITIAL_DELTA = 0.005;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f6f8fa',
	},
	scrollContainer: {
		flex: 1,
		zIndex: -1,
	},
	sectionPrimary: {
		paddingVertical: 16 + 8,
		paddingHorizontal: 16 + 8,
		backgroundColor: '#fff',
	},
	sectionSecondary: {
		backgroundColor: '#fff',
	},
	sectionTertiary: {
		paddingHorizontal: 16,
		paddingVertical: 32,
	},
});

type Props = {
	route: RouteProp<RootStackParamList, 'Property'>;
	navigation: NativeStackNavigationProp<RootStackParamList, 'Property'>;
};

export const PropertyScreen: React.FC<Props> = React.memo(({ route, navigation }) => {
	const { item } = route.params;

	const displayRelativeTime = React.useMemo(() => {
		if (!item.data.createTime) {
			return null;
		}
		return `Added ${formatDistance(item.data.createTime, Date.now(), {
			addSuffix: true,
		})}`;
	}, [item.data.createTime]);

	const displayPrice = React.useMemo(() => {
		return getDisplayPrice(item.data.pcmGbp);
	}, [item.data.pcmGbp]);

	const coordinate: LatLng = item.data.coordinate;
	const windowDimensions = useWindowDimensions();
	const mapWidth = Math.round(windowDimensions.width);
	const mapHeight = Math.round(windowDimensions.height * 0.38);
	const initialRegion: Region = {
		latitude: coordinate.latitude,
		longitude: coordinate.longitude,
		latitudeDelta: INITIAL_DELTA,
		longitudeDelta: getLngDeltaFromLatDelta(INITIAL_DELTA, mapWidth, mapHeight),
	};

	const accountState = useAccountState();
	const token = accountState.user?.idToken;
	const canMutateData =
		accountState.user?.data.role === 'admin' ||
		accountState.user?.data.role === 'realtor';

	const [creatorUser, setCreatorUser] = React.useState<User>();
	React.useEffect(() => {
		const load = async () => {
			try {
				let data = await getUserData(item.data.creatorUserId, token);
				data = data.user.data;
				if (data) {
					setCreatorUser({ id: item.data.creatorUserId, data, idToken: token });
				}
			} catch (error) {
				console.log('Error loading user');
			}
		};
		load();
	}, [item.data.creatorUserId]);

	const handleReturnPress = React.useCallback(() => {
		navigation.pop();
	}, [navigation]);

	const handleEditPress = React.useCallback(() => {
		navigation.push('PropertyEdit', { item });
	}, [navigation, item]);

	const handleUserPress = React.useCallback(
		(userItem: User) => {
			navigation.push('User', { item: userItem });
		},
		[navigation]
	);

	return (
		<View style={styles.container}>
			<Header
				title="Property"
				onReturnPress={handleReturnPress}
				onEditPress={canMutateData ? handleEditPress : undefined}
			/>
			<ScrollView style={styles.scrollContainer} directionalLockEnabled>
				<MapView
					style={{ height: mapHeight }}
					provider={PROVIDER_GOOGLE}
					customMapStyle={mapStyle}
					showsUserLocation
					initialRegion={initialRegion}
				>
					<Marker
						coordinate={coordinate}
						pinColor="#1e56d9"
						opacity={item.data.available ? 1 : 0.5}
					/>
				</MapView>
				<Divider />
				<View style={styles.sectionPrimary}>
					<Title>{item.data.name}</Title>
					{item.data.description && <Paragraph>{item.data.description}</Paragraph>}
					{displayRelativeTime && (
						<>
							<Separator />
							<Caption>{displayRelativeTime}</Caption>
						</>
					)}
				</View>
				<Divider />
				<View style={styles.sectionSecondary}>
					<List.Item
						title={item.data.available ? 'Available' : 'Rented'}
						description="Status"
						left={() => (
							<List.Icon
								icon={item.data.available ? 'calendar-check' : 'calendar-remove'}
							/>
						)}
					/>
					<Divider />
					<List.Item
						title={displayPrice}
						description="Price per month"
						left={() => <List.Icon icon="currency-gbp" />}
					/>
					<Divider />
					<List.Item
						title={`${item.data.sizeSqm} sq.m`}
						description="Floor area size"
						left={() => <List.Icon icon="floor-plan" />}
					/>
					<Divider />
					<List.Item
						title={item.data.numRooms}
						description="Number of rooms"
						left={() => <List.Icon icon="home-city" />}
					/>
				</View>
				<Divider />
				{creatorUser && (
					<View style={styles.sectionTertiary}>
						<UserCard item={creatorUser} onPress={handleUserPress} />
					</View>
				)}
			</ScrollView>
		</View>
	);
});
