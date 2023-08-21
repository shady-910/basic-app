import React from 'react';
import { RootStackParamList } from '@src/app/AppNavigation';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { RouteProp } from '@react-navigation/native';
import { FilterScreen } from '../screens/FilterScreen';

type Props = {
	route: RouteProp<RootStackParamList, 'FilterRooms'>;
	navigation: NativeStackNavigationProp<RootStackParamList, 'FilterRooms'>;
};

export const FilterRoomsScreen: React.FC<Props> = React.memo(({ navigation }) => {
	const handleReturnPress = React.useCallback(() => {
		navigation.pop();
	}, [navigation]);

	return (
		<FilterScreen
			subtitle="Number of rooms"
			stateFieldName="minNumRooms"
			dispatchSetActionType="SET_MIN_NUM_ROOMS"
			onReturnPress={handleReturnPress}
			placeHolder="Min number of rooms"
		/>
	);
});
