import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AccountProvider } from '@src/contexts/accountContext';
import { FiltersProvider } from '@src/contexts/filtersContext';

export const AppProvider: React.FC = React.memo(({ children }) => {
	return (
		<SafeAreaProvider>
			<AccountProvider>
				<FiltersProvider>{children}</FiltersProvider>
			</AccountProvider>
		</SafeAreaProvider>
	);
});
