export function toISODate(input: Date) {
	// return input.toISOString().split('T')[0];
	const year = input.getUTCFullYear();
	const month = (input.getUTCMonth() + 1).toString().padStart(2, '0');
	const dayOfMonth = input.getUTCDate().toString().padStart(2, '0');
	const delimiter = '-';
	return [year, month, dayOfMonth].join(delimiter);
}
