import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { PropertiesListTab } from '@src/components/PropertiesListTab';
import { PropertiesMapTab } from '@src/components/PropertiesMapTab';
import { UsersTabScreen } from '@src/components/UsersTab';
import { SettingsScreen } from '@src/screens/SettingsScreen';
import { RootStackParamList } from '../app/AppNavigation';
import { useAccountState } from '@src/contexts/accountContext';
import { RouteProp } from '@react-navigation/native';

export type MainTabParamList = {
	PropertiesList: undefined;
	PropertiesMap: undefined;
	UsersTab: undefined;
	Settings: undefined;
};

const MainTab = createMaterialBottomTabNavigator<MainTabParamList>();

type Props = {
	route: RouteProp<RootStackParamList, 'MainTab'>;
	navigation: NativeStackNavigationProp<RootStackParamList, 'MainTab'>;
};

export const MainTabScreen: React.FC<Props> = React.memo(() => {
	const accountState = useAccountState();

	return (
		<MainTab.Navigator activeColor="#FFFFFF" barStyle={{ backgroundColor: '#1e56d9' }}>
			<MainTab.Screen
				name="PropertiesList"
				component={PropertiesListTab}
				options={{ tabBarIcon: 'home-city', title: 'Properties' }}
			/>
			<MainTab.Screen
				name="PropertiesMap"
				component={PropertiesMapTab}
				options={{ tabBarIcon: 'map', title: 'Map' }}
			/>
			{accountState.user?.data.role === 'admin' && (
				<MainTab.Screen
					name="UsersTab"
					component={UsersTabScreen}
					options={{ tabBarIcon: 'account-group', title: 'Users' }}
				/>
			)}
			<MainTab.Screen
				name="Settings"
				component={SettingsScreen}
				options={{
					tabBarIcon: 'account-settings',
					title: 'Settings',
				}}
			/>
		</MainTab.Navigator>
	);
});
