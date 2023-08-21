import React from 'react';
import { StyleSheet, View, ScrollView, useWindowDimensions } from 'react-native';
import { Title, Divider, List } from 'react-native-paper';
import { RootStackParamList } from '@src/app/AppNavigation';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Header } from '@src/components/Header';
import { useAccountState } from '@src/contexts/accountContext';
import { UserAvatar } from '@src/components/UserAvatar';
import { Separator } from '@src/components/Separator';

const ROLE_LABEL_DICT = {
	client: 'Client',
	realtor: 'Realtor',
	admin: 'Admin',
};

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
		paddingTop: 32 + 8,
		paddingBottom: 32,
		paddingHorizontal: 16 + 8,
		backgroundColor: '#fff',
		alignItems: 'center',
	},
	sectionSecondary: {
		backgroundColor: '#fff',
	},
});

type Props = {
	route: RouteProp<RootStackParamList, 'User'>;
	navigation: NativeStackNavigationProp<RootStackParamList, 'User'>;
};

export const UserScreen: React.FC<Props> = React.memo(({ route, navigation }) => {
	const { item } = route.params;

	const displayName = React.useMemo(() => {
		let value = '';
		if (item.data.firstName) {
			value = (value ? `${value} ` : '') + item.data.firstName;
		}
		if (item.data.lastName) {
			value = (value ? `${value} ` : '') + item.data.lastName;
		}
		return value;
	}, [item.data.firstName, item.data.lastName]);

	const windowDimensions = useWindowDimensions();
	const avatarSize = Math.round(windowDimensions.width * 0.5);

	const accountState = useAccountState();
	const isAdmin = accountState.user?.data.role === 'admin';
	const canMutateData = isAdmin || item.id === accountState.user?.id;

	const handleReturnPress = React.useCallback(() => {
		navigation.pop();
	}, [navigation]);

	const handleEditPress = React.useCallback(() => {
		navigation.push('UserEdit', { item });
	}, [navigation, item]);

	return (
		<View style={styles.container}>
			<Header
				title="User"
				onReturnPress={handleReturnPress}
				onEditPress={canMutateData ? handleEditPress : undefined}
			/>
			<ScrollView style={styles.scrollContainer} directionalLockEnabled>
				<View style={styles.sectionPrimary}>
					<UserAvatar item={item} size={avatarSize} />
					<Separator variant="large" />
					<Title style={{ textAlign: 'center', fontSize: 32, lineHeight: 32 }}>
						{displayName || 'Unknown'}
					</Title>
				</View>
				<Divider />
				<View style={styles.sectionSecondary}>
					<List.Item
						title={ROLE_LABEL_DICT[item.data.role]}
						description="Role"
						left={() => <List.Icon icon="key" />}
					/>
					{item.data.email && (
						<>
							<Divider />
							<List.Item
								title={item.data.email}
								description="Email"
								left={() => <List.Icon icon="email" />}
							/>
						</>
					)}
				</View>
				<Divider />
			</ScrollView>
		</View>
	);
});
