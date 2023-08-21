export function getDisplayPrice(price: number) {
	const displayPrice = price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
	return displayPrice.replace('.00', '');
}
