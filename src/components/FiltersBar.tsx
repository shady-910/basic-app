import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Chip, Text, Divider } from 'react-native-paper';
import { useSafeArea } from 'react-native-safe-area-context';
import { Separator } from '@src/components/Separator';
import { useFiltersDispatch, useFiltersState } from '@src/contexts/filtersContext';

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFFFFF',
	},
	content: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		alignItems: 'center',
	},
});

export type FilterScreenName = 'FilterPrice' | 'FilterSize' | 'FilterRooms';

type Props = {
	onItemPress: (filterScreenName: FilterScreenName) => void;
};

export const FiltersBar: React.FC<Props> = React.memo(({ onItemPress }) => {
	const insets = useSafeArea();
	const filtersState = useFiltersState();
	const filtersDispatch = useFiltersDispatch();

	const handleClearPress = React.useCallback(() => {
		filtersDispatch({ type: 'RESET' });
	}, [filtersDispatch]);

	return (
		<View style={styles.container}>
			<ScrollView
				contentContainerStyle={[styles.content, { marginTop: insets.top - 1 }]}
				horizontal
				showsHorizontalScrollIndicator={false}
				directionalLockEnabled
			>
				<Text>Filter by:</Text>
				<Separator />
				<Chip
					mode="flat"
					icon="currency-gbp"
					selectedColor={filtersState.maxPcmGbp !== null ? '#1e56d9' : undefined}
					onPress={() => onItemPress('FilterPrice')}
				>
					{filtersState.maxPcmGbp === null
						? 'Price'
						: `Max £${filtersState.maxPcmGbp} p/m`}
				</Chip>
				<Separator variant="small" />
				<Chip
					mode="flat"
					icon="floor-plan"
					selectedColor={filtersState.minSizeSqm !== null ? '#1e56d9' : undefined}
					onPress={() => onItemPress('FilterSize')}
				>
					{filtersState.minSizeSqm === null
						? 'Floor area'
						: `Min ${filtersState.minSizeSqm} sq.m`}
				</Chip>
				<Separator variant="small" />
				<Chip
					mode="flat"
					icon="home-city"
					selectedColor={filtersState.minNumRooms !== null ? '#1e56d9' : undefined}
					onPress={() => onItemPress('FilterRooms')}
				>
					{filtersState.minNumRooms === null
						? 'Num. of rooms'
						: `Min ${filtersState.minNumRooms}`}
				</Chip>
				{(filtersState.maxPcmGbp !== null ||
					filtersState.minSizeSqm !== null ||
					filtersState.minNumRooms !== null) && (
					<>
						<Separator />
						<Chip mode="outlined" icon="close-circle" onPress={handleClearPress}>
							Clear
						</Chip>
					</>
				)}
			</ScrollView>
			<Divider />
		</View>
	);
});
