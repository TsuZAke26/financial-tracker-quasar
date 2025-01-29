/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import Papa from 'papaparse';
import type { Database } from 'src/supabase/types';

const TRANSACTION_IMPORT_COLUMN_HEADERS = [
	'category_main',
	'category_misc',
	'date',
	'name',
	'amount',
];

// https://stackoverflow.com/questions/31375531/how-to-use-promises-with-papaparse
export const convertCSVRowsToJSON = async (
	file: File
): Promise<{ data: any[]; errors: any[]; meta: Record<string, unknown> }> => {
	return new Promise(function (complete, error) {
		Papa.parse(file, {
			worker: true,
			header: true,
			columns: TRANSACTION_IMPORT_COLUMN_HEADERS,
			dynamicTyping: true,
			complete,
			error,
		});
	});
};

export const createTransactionRows = (accountId: number, csvRows: any[]) => {
	const transactionsToInsert: Database['public']['Tables']['transactions']['Insert'][] =
		[];
	csvRows.forEach((csvRowJSON) => {
		const supabaseTransactionToInsert: Database['public']['Tables']['transactions']['Insert'] =
			{
				...csvRowJSON,
			};
		supabaseTransactionToInsert.account_id = accountId;
		transactionsToInsert.push(supabaseTransactionToInsert);
	});
	return transactionsToInsert;
};

const createImportTemplateCSV = () => {
	return Papa.unparse({ fields: TRANSACTION_IMPORT_COLUMN_HEADERS, data: [] });
};

const downloadFile = (file: Blob, filename: string) => {
	// https://www.geeksforgeeks.org/how-to-export-html-table-to-csv-using-javascript/
	const tempLink = document.createElement('a');

	tempLink.download = filename;
	const templateUrl = window.URL.createObjectURL(file);
	tempLink.href = templateUrl;

	tempLink.style.display = 'none';
	document.body.appendChild(tempLink);

	tempLink.click();
	document.body.removeChild(tempLink);
};

export const generateImportTemplate = () => {
	const template = new Blob([createImportTemplateCSV()], { type: 'text/csv' });
	downloadFile(template, 'import_template.csv');
};

export const createTransactionExport = (transactions: any[]) => {
	const exportFileCSVString = Papa.unparse({
		fields: TRANSACTION_IMPORT_COLUMN_HEADERS,
		data: transactions,
	});
	const exportFile = new Blob([exportFileCSVString], { type: 'text/csv' });
	downloadFile(exportFile, 'transaction_export.csv');
};
