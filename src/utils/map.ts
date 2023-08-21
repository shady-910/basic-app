export const getLngDeltaFromLatDelta = (
	latitudeDelta: number,
	width: number,
	height: number
) => {
	const aspectRatio = width / height;
	return latitudeDelta * aspectRatio;
};
