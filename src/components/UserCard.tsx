/* eslint-disable no-undef */
import React from 'react';
import { Card } from 'react-native-paper';
import { UserAvatar } from './UserAvatar';
import { StyleSheet } from 'react-native';

const ROLE_LABEL_DICT = {
	client: 'Client',
	realtor: 'Realtor',
	admin: 'Admin',
};

const styles = StyleSheet.create({
	cardTitle: {
		paddingRight: 16,
	},
});

type Props = {
	item: User;
	onPress?: (item: User) => void;
};

export const UserCard: React.FC<Props> = React.memo(({ item, onPress }) => {
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

	const renderLeft = React.useCallback(
		(leftProps: any) => {
			return <UserAvatar {...leftProps} item={item} />;
		},
		[item]
	);

	const handlePress = React.useCallback(() => {
		if (onPress) onPress(item);
	}, [item, onPress]);

	return (
		<Card onPress={onPress ? handlePress : undefined}>
			<Card.Title
				style={styles.cardTitle}
				title={displayName || 'Unknown'}
				subtitle={
					ROLE_LABEL_DICT[item.data.role] +
					(item.data.email ? ` • ${item.data.email}` : '')
				}
				left={renderLeft}
			/>
		</Card>
	);
});
