/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
	Button,
	TextInput,
	Switch,
	Text,
	Divider,
	IconButton,
	RadioButton,
} from 'react-native-paper';
import { RootStackParamList } from '@src/app/AppNavigation';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { Separator } from '@src/components/Separator';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { Header } from '@src/components/Header';
import { useAccountState } from '@src/contexts/accountContext';
import {
	addPropertyData,
	setPropertyData,
	deletePropertyData,
} from '@src/api/propertyApi';
import { isValidPositiveInteger } from '@src/utils/formValidation';
import { getUsers } from '@src/api/userApi';

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
	route: RouteProp<RootStackParamList, 'PropertyEdit'>;
	navigation: NativeStackNavigationProp<RootStackParamList, 'PropertyEdit'>;
};

export const PropertyEditScreen: React.FC<Props> = React.memo(({ route, navigation }) => {
	const accountState = useAccountState();

	const isNew = !route.params?.item;
	const token = accountState.user?.idToken;

	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [available, setAvailable] = React.useState(
		route.params?.item?.data.available !== undefined
			? route.params.item.data.available
			: true
	);
	const [name, setName] = React.useState(route.params?.item?.data.name || '');
	const [description, setDescription] = React.useState(
		route.params?.item?.data.description || ''
	);
	const [pcmGbp, setPcmGbp] = React.useState(
		route.params?.item?.data.pcmGbp !== undefined
			? String(route.params.item.data.pcmGbp)
			: ''
	);
	const [sizeSqm, setSizeSqm] = React.useState(
		route.params?.item?.data.sizeSqm !== undefined
			? String(route.params.item.data.sizeSqm)
			: ''
	);
	const [numRooms, setNumRooms] = React.useState(
		route.params?.item?.data.numRooms !== undefined
			? String(route.params.item.data.numRooms)
			: ''
	);
	const [latitude, setLatitude] = React.useState(
		route.params?.item?.data.coordinate.latitude !== undefined
			? String(route.params.item.data.coordinate.latitude)
			: ''
	);
	const [longitude, setLongitude] = React.useState(
		route.params?.item?.data.coordinate.longitude !== undefined
			? String(route.params.item.data.coordinate.longitude)
			: ''
	);

	const paramCoordinate = route.params?.coordinate;
	React.useEffect(() => {
		if (paramCoordinate) {
			setLatitude(String(paramCoordinate.latitude));
			setLongitude(String(paramCoordinate.longitude));
		}
	}, [paramCoordinate]);

	const [creatorUserId, setCreatorUserId] = React.useState(
		route.params?.item?.data.creatorUserId !== undefined
			? String(route.params.item.data.creatorUserId)
			: ''
	);

	const canSubmit =
		name.trim().length &&
		description.trim().length &&
		pcmGbp.trim().length &&
		isValidPositiveInteger(pcmGbp.trim()) &&
		sizeSqm.trim().length &&
		isValidPositiveInteger(sizeSqm.trim()) &&
		numRooms.trim().length &&
		isValidPositiveInteger(numRooms.trim()) &&
		latitude.trim().length &&
		!isNaN(Number(latitude.trim())) &&
		longitude.trim().length &&
		!isNaN(Number(longitude.trim()));

	const handleReturnPress = React.useCallback(() => {
		navigation.pop();
	}, [navigation]);

	const handleSubmitPress = React.useCallback(() => {
		if (!accountState.authUser?.uid) {
			return;
		}
		const submit = async () => {
			setIsSubmitting(true);
			try {
				const data: NewPropertyData = {
					available,
					name: name.trim(),
					description: description.trim(),
					sizeSqm: Number(sizeSqm.trim()),
					pcmGbp: Number(pcmGbp.trim()),
					numRooms: Number(numRooms.trim()),
					coordinate: {
						latitude: Number(latitude.trim()),
						longitude: Number(longitude.trim()),
					},
					creatorUserId,
				};
				if (route.params?.item?.id) {
					await setPropertyData(route.params.item.id, data, token);
				} else {
					await addPropertyData(data, accountState.authUser!.uid, token);
				}
				navigation.popToTop();
			} catch (error) {
				Alert.alert(error.message);
				setIsSubmitting(false);
			}
		};
		submit();
	}, [
		accountState.authUser,
		available,
		description,
		latitude,
		longitude,
		name,
		navigation,
		numRooms,
		pcmGbp,
		route.params,
		sizeSqm,
		creatorUserId,
	]);

	const [items, setItems] = React.useState<User[]>([]);
	const isAdmin = accountState.user?.data.role === 'admin';

	if (isAdmin) {
		useFocusEffect(
			React.useCallback(() => {
				async function load() {
					try {
						const data = await getUsers(accountState.user?.idToken);
						const filteredData = data.users.filter((user: { data: { role: string } }) => {
							return user.data.role === 'realtor';
						});
						setItems(filteredData);
					} catch (error) {
						console.log('error loading users', error);
					}
				}

				load();
			}, ['realtor'])
		);
	}

	const handleDeletePress = React.useCallback(() => {
		const submit = async () => {
			setIsSubmitting(true);
			try {
				if (!route.params?.item?.id) {
					return;
				}
				await deletePropertyData(route.params.item.id, token);
				navigation.popToTop();
			} catch (error) {
				Alert.alert(error.message);
				setIsSubmitting(false);
			}
		};
		Alert.alert(
			'Are you sure you want to delete this property?',
			undefined,
			[
				{ text: 'Cancel', onPress: () => {}, style: 'cancel' },
				{ text: 'Delete', onPress: submit },
			],
			{ cancelable: false }
		);
	}, [navigation, route.params]);

	const handleSearchPress = React.useCallback(() => {
		navigation.push('LocationSearch');
	}, [navigation]);

	return (
		<View style={styles.container}>
			<Header
				title={`${isNew ? 'Add New' : 'Update'} Property`}
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
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
						paddingHorizontal: 16,
					}}
				>
					<Text style={{ fontSize: 16 }}>Available</Text>
					<Switch value={available} onValueChange={setAvailable} />
				</View>
				<Separator variant="large" />
				<Divider />
				<Separator variant="large" />
				<TextInput label="Name" value={name} onChangeText={setName} disableFullscreenUI />
				<Separator />
				<TextInput
					style={{ paddingBottom: 10 }}
					label="Description"
					value={description}
					onChangeText={setDescription}
					disableFullscreenUI
					multiline
					numberOfLines={6}
				/>
				<Separator variant="large" />
				<Divider />
				<Separator variant="large" />
				<TextInput
					label="Price per month (£)"
					keyboardType="decimal-pad"
					value={pcmGbp}
					onChangeText={setPcmGbp}
					disableFullscreenUI
					autoCapitalize="none"
				/>
				<Separator />
				<TextInput
					label="Floor area size (sq.m)"
					keyboardType="decimal-pad"
					value={sizeSqm}
					onChangeText={setSizeSqm}
					disableFullscreenUI
					autoCapitalize="none"
				/>
				<Separator />
				<TextInput
					label="Number of rooms"
					keyboardType="number-pad"
					value={numRooms}
					onChangeText={setNumRooms}
					disableFullscreenUI
					autoCapitalize="none"
				/>
				<Separator variant="large" />
				<Divider />
				<Separator variant="large" />
				<View style={{ flexDirection: 'row' }}>
					<TextInput
						style={{ flex: 1 }}
						label="Latitude"
						keyboardType="decimal-pad"
						value={latitude}
						onChangeText={setLatitude}
						disableFullscreenUI
						autoCapitalize="none"
					/>
					<Separator />
					<TextInput
						style={{ flex: 1 }}
						label="Longitude"
						keyboardType="number-pad"
						value={longitude}
						onChangeText={setLongitude}
						disableFullscreenUI
						autoCapitalize="none"
					/>
					<IconButton icon="magnify" size={35} onPress={handleSearchPress} />
				</View>
				{isAdmin && (
					<View>
						<Separator />
						<>
							<Separator variant="large" />
							<Divider />
							<Separator variant="large" />
							<RadioButton.Group onValueChange={setCreatorUserId} value={creatorUserId}>
								{items.map((item) => (
									<RadioButton.Item
										key={item.id}
										label={`${item.data.firstName + ' ' + item.data.lastName}`}
										value={item.id}
									/>
								))}
								<Divider />
							</RadioButton.Group>
						</>
					</View>
				)}
				<Separator variant="large" />
				<Button
					mode="contained"
					disabled={!canSubmit}
					onPress={handleSubmitPress}
					loading={isSubmitting}
				>
					Submit
				</Button>
				{!isNew && (
					<>
						<Separator variant="large" />
						<Button mode="outlined" loading={isSubmitting} onPress={handleDeletePress}>
							Delete
						</Button>
					</>
				)}
			</KeyboardAwareScrollView>
		</View>
	);
});
