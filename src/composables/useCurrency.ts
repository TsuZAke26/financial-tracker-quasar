export const formatAmount = (currency: string, amount: number) => {
	if (amount === undefined) return 0;

	const prefixChar = amount < 0 ? '-' : '';

	// Determine number of trailing zeros to add for rendering
	const amountDelim = amount.toString().split('.');
	let zeroPadding = '';
	// only tenths place
	if (amountDelim.length > 1 && amountDelim[1]?.length === 1) {
		zeroPadding = '0';
	}
	// no decimal at all
	else if (amountDelim.length === 1) {
		zeroPadding = '.00';
	}

	return prefixChar
		.concat(currency)
		.concat(Math.abs(amount).toString())
		.concat(zeroPadding);
};

export const styleAmount = (amount: number) => {
	const textColor = amount < 0 ? 'color: red' : null;
	return textColor;
};
