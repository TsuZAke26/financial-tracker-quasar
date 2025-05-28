import { storeAccounts } from 'src/stores/accounts';

const accounts = storeAccounts();
const { loadAccounts } = accounts;

export async function updateAccountBalances() {
	await loadAccounts();
}
