import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Button } from 'react-native-paper';
import { Separator } from '@src/components/Separator';
import { Header } from '@src/components/Header';
import { useFiltersDispatch, useFiltersState } from '@src/contexts/filtersContext';
import { isValidPositiveInteger } from '@src/utils/formValidation';

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
	label: {
		color: '#f6f8fa',
		margin: 20,
		marginLeft: 0,
	},
	button: {
		marginTop: 40,
		color: '#f6f8fa',
		height: 40,
		backgroundColor: '#ec5990',
		borderRadius: 4,
	},
	input: {
		backgroundColor: '#f6f8fa',
		borderColor: '#f6f8fa',
		height: 40,
		padding: 10,
		borderRadius: 4,
	},
});

type Props = {
	subtitle: string;
	stateFieldName: 'maxPcmGbp' | 'minSizeSqm' | 'minNumRooms';
	dispatchSetActionType: 'SET_MAX_PCM_GBP' | 'SET_MIN_SIZE_SQM' | 'SET_MIN_NUM_ROOMS';
	onReturnPress: () => void;
	placeHolder: string;
};

export const FilterScreen: React.FC<Props> = React.memo(
	({ subtitle, stateFieldName, dispatchSetActionType, onReturnPress, placeHolder }) => {
		const filtersState = useFiltersState();
		const filtersDispatch = useFiltersDispatch();

		const [value, setValue] = React.useState(
			filtersState[stateFieldName] !== null ? String(filtersState[stateFieldName]) : ''
		);
		const handleValueChange = React.useCallback(
			(newValue: string) => {
				filtersDispatch({
					type: dispatchSetActionType,
					payload: newValue === value ? Number(newValue) : null,
				});
				setTimeout(() => {
					onReturnPress();
				}, 250);
			},
			[value, dispatchSetActionType, filtersDispatch, onReturnPress]
		);

		const handleClearPress = React.useCallback(() => {
			filtersDispatch({ type: dispatchSetActionType, payload: null });
			onReturnPress();
		}, [dispatchSetActionType, filtersDispatch, onReturnPress]);

		const canSubmit = value.trim().length && isValidPositiveInteger(value.trim());

		return (
			<View style={styles.container}>
				<Header title="Filters" subtitle={subtitle} onReturnPress={onReturnPress} />
				<Separator variant="large" />
				<TextInput
					placeholder={placeHolder}
					keyboardType="numeric"
					value={value}
					onChangeText={setValue}
					disableFullscreenUI
					autoCapitalize="none"
				/>
				<Separator />
				<Button
					mode="contained"
					onPress={() => handleValueChange(value)}
					disabled={!canSubmit}
				>
					Filter
				</Button>
				<Separator />
				<Button mode="outlined" onPress={handleClearPress}>
					Clear
				</Button>
			</View>
		);
	}
);
