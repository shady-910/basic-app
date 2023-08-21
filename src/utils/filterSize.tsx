import React from 'react';
import { RootStackParamList } from '@src/app/AppNavigation';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { RouteProp } from '@react-navigation/native';
import { FilterScreen } from '../screens/FilterScreen';

type Props = {
	route: RouteProp<RootStackParamList, 'FilterSize'>;
	navigation: NativeStackNavigationProp<RootStackParamList, 'FilterSize'>;
};

export const FilterSizeScreen: React.FC<Props> = React.memo(({ navigation }) => {
	const handleReturnPress = React.useCallback(() => {
		navigation.pop();
	}, [navigation]);

	return (
		<FilterScreen
			subtitle="Floor area size"
			stateFieldName="minSizeSqm"
			dispatchSetActionType="SET_MIN_SIZE_SQM"
			onReturnPress={handleReturnPress}
			placeHolder="Min sqm size"
		/>
	);
});
