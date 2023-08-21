/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Separator } from '@src/components/Separator';
import { getUsers } from '@src/api/userApi';
import { UserCard } from './UserCard';
import { useAccountState } from '@src/contexts/accountContext';
import { useFocusEffect } from '@react-navigation/native';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f6f8fa',
	},
	content: {
		padding: 16,
	},
});

type Props = {
	role: UserRole;
	onItemPress: (item: User) => void;
};

export const UsersList: React.FC<Props> = React.memo(({ role, onItemPress }) => {
	const accountState = useAccountState();
	const [items, setItems] = React.useState<User[]>([]);

	useFocusEffect(
		React.useCallback(() => {
			async function load() {
				try {
					const data = await getUsers(accountState.user?.idToken);
					const filteredData = data.users.filter((user: { data: { role: string } }) => {
						return user.data.role === role;
					});
					setItems(filteredData);
				} catch (error) {
					console.log('error loading users', error);
				}
			}

			load();
		}, [role])
	);

	const renderItem = React.useCallback(
		({ item }: { item: User }) => {
			return <UserCard item={item} onPress={onItemPress} />;
		},
		[accountState.authUser, accountState.user, onItemPress]
	);

	return (
		<FlatList
			style={styles.container}
			contentContainerStyle={styles.content}
			data={items}
			renderItem={renderItem}
			ItemSeparatorComponent={Separator}
			directionalLockEnabled
			keyExtractor={(item, index) => index.toString()}
			ListFooterComponent={() => <View style={{ height: 68 }} />}
		/>
	);
});
