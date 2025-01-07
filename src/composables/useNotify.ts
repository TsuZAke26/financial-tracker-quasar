import { Notify } from 'quasar';

export const useNotify = (
	type: 'positive' | 'negative' | 'info' | 'warning',
	message: string,
	caption: string = ''
) => {
	Notify.create({
		type,
		message,
		caption,
		position: 'bottom-right',
		timeout: 2000,
	});
};
