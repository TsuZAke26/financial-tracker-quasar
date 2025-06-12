import bigDecimal from 'js-big-decimal';

import { storeUser } from 'src/stores/user';

const userStore = storeUser();
const { currencySymbol } = userStore;

export const formatAmount = (amount: number) => {
	if (amount === undefined) return '0';

	const prefixChar = amount < 0 ? '-' : '';
	const amountRounded = bigDecimal.round(Math.abs(amount), 2);
	const amountFormatted = bigDecimal.getPrettyValue(amountRounded);

	return prefixChar.concat(currencySymbol).concat(amountFormatted);
};

export const formatAmountString = (amount: string) => {
	const amountAsBigDec = new bigDecimal(amount).abs();

	const prefixChar = amount[0] === '-' ? amount[0] : '';
	const amountFormatted = amountAsBigDec.round(2).getPrettyValue();

	return prefixChar.concat(currencySymbol).concat(amountFormatted);
};

export const styleAmount = (amount: number) => {
	const textColor = amount < 0 ? 'text-red' : null;
	return textColor;
};
