import bigDecimal from 'js-big-decimal';

export function addNumbers(numbers: number[]) {
	let total = '0';
	numbers.forEach((number) => {
		total = bigDecimal.add(total, number);
	});
	return bigDecimal.getPrettyValue(bigDecimal.round(total, 2));
}
