import type { LocalExpenseDB } from 'src/types/interfaces';

export function sortDeductions(a: LocalExpenseDB, b: LocalExpenseDB) {
	if (a.amount > b.amount) {
		return 1;
	} else if (a.amount < b.amount) {
		return -1;
	} else {
		return sortAlphabetically(a, b);
	}
}

export function sortAlphabetically(a: LocalExpenseDB, b: LocalExpenseDB) {
	if (a.name < b.name) {
		return 1;
	} else if (a.name > b.name) {
		return -1;
	} else {
		return 0;
	}
}
