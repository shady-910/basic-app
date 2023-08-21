import React from 'react';
import { View } from 'react-native';

const VARIANTS = {
	small: 8,
	medium: 16,
	large: 32,
};

type VariantNames = keyof typeof VARIANTS;

type Props = {
	variant?: VariantNames;
};

export const Separator: React.FC<Props> = React.memo(({ variant = 'medium' }) => {
	const size = VARIANTS[variant];
	return <View style={{ width: size, height: size }} />;
});
