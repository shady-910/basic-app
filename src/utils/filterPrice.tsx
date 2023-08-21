import React from 'react';
import { RootStackParamList } from '@src/app/AppNavigation';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { RouteProp } from '@react-navigation/native';
import { FilterScreen } from '../screens/FilterScreen';

type Props = {
	route: RouteProp<RootStackParamList, 'FilterPrice'>;
	navigation: NativeStackNavigationProp<RootStackParamList, 'FilterPrice'>;
};

export const FilterPriceScreen: React.FC<Props> = React.memo(({ navigation }) => {
	const handleReturnPress = React.useCallback(() => {
		navigation.pop();
	}, [navigation]);

	return (
		<FilterScreen
			subtitle="Price per month"
			stateFieldName="maxPcmGbp"
			dispatchSetActionType="SET_MAX_PCM_GBP"
			onReturnPress={handleReturnPress}
			placeHolder="Max price per month (£)"
		/>
	);
});
