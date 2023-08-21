/* eslint-disable no-undef */
import React from 'react';
import { Card, Avatar, Chip } from 'react-native-paper';
import { Separator } from '@src/components/Separator';
import { StyleSheet } from 'react-native';
import { getDisplayPrice } from '@src/utils/price';

const styles = StyleSheet.create({
	content: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	cardTitle: {
		paddingRight: 16,
	},
	columnWide: {
		flex: 1.75,
		alignItems: 'center',
	},
	columnNarrow: {
		flex: 1,
		alignItems: 'center',
	},
});

type Props = {
	item: Property;
	onPress: (item: Property) => void;
};

export const PropertyCard: React.FC<Props> = React.memo(({ item, onPress }) => {
	const displayPrice = React.useMemo(() => {
		return getDisplayPrice(item.data.pcmGbp);
	}, [item.data.pcmGbp]);

	const renderLeft = React.useCallback(
		(leftProps: any) => {
			return (
				<Avatar.Icon
					{...leftProps}
					icon={item.data.available ? 'map-marker' : 'map-marker-off'}
					backgroundColor={item.data.available ? '#1e56d9' : '#b8b0ca'}
				/>
			);
		},
		[item.data.available]
	);

	const handlePress = React.useCallback(() => {
		onPress(item);
	}, [item, onPress]);

	return (
		<Card onPress={handlePress}>
			<Card.Title
				style={styles.cardTitle}
				title={item.data.name}
				subtitle={item.data.description}
				left={renderLeft}
			/>
			<Card.Content style={styles.content}>
				<Chip style={styles.columnWide} icon="currency-gbp">
					{displayPrice} p/m
				</Chip>
				<Separator variant="small" />
				<Chip style={styles.columnWide} icon="floor-plan">
					{item.data.sizeSqm} sq.m
				</Chip>
				<Separator variant="small" />
				<Chip style={styles.columnNarrow} icon="home-city">
					{item.data.numRooms}
				</Chip>
			</Card.Content>
		</Card>
	);
});
