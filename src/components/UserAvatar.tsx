/* eslint-disable no-undef */
import React from 'react';
import { StyleSheet, View, PixelRatio } from 'react-native';
import { Avatar } from 'react-native-paper';
import md5 from 'md5';

type Props = {
	item: User;
	email?: string;
	size?: number;
};

export const UserAvatar: React.FC<Props> = React.memo(({ item, email, size }) => {
	const nameInitials = React.useMemo(() => {
		let value = '';
		if (item.data.firstName) {
			value += item.data.firstName[0];
		}
		if (item.data.lastName) {
			value += item.data.lastName[0];
		}
		return value;
	}, [item.data.firstName, item.data.lastName]);

	const imageUrl = React.useMemo(() => {
		let value: string | null = null;
		if (email) {
			value = `https://www.gravatar.com/avatar/${md5(
				email
			)}?s=${PixelRatio.getPixelSizeForLayoutSize(
				size || 40
			)}&d=iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII`;
		}
		return value;
	}, [email, size]);

	return (
		<View>
			{nameInitials ? (
				<Avatar.Text
					size={size}
					style={{ backgroundColor: '#1e56d9' }}
					color="#fff"
					label={nameInitials}
				/>
			) : (
				<Avatar.Icon
					size={size}
					style={{ backgroundColor: '#1e56d9' }}
					color="#fff"
					icon="account"
				/>
			)}
			{imageUrl && (
				<Avatar.Image
					size={size}
					style={[StyleSheet.absoluteFill, { backgroundColor: 'transparent' }]}
					source={{ uri: imageUrl }}
				/>
			)}
		</View>
	);
});
