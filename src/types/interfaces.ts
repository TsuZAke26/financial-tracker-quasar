export interface LocalExpenseDB {
	id: number;
	budget_id: number;
	name: string;
	amount: number;
	edit: boolean;
}

export interface ReportCategoryData {
	category_main: string;
	category_misc: string | null;
	amount: string;
	percent: string;
}
