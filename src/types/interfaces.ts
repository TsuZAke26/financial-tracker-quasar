export interface LocalExpenseDB {
	id: number;
	budget_id: number;
	name: string;
	amount: number;
	edit: boolean;
}

export interface ReportCategoryData {
	category_first: string;
	category_second: string | null;
	amount: string;
	percent: string;
}
