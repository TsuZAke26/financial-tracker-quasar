import { defineBoot } from '@quasar/app-vite/wrappers';
import { anonClient } from 'src/supabase/anon-client';

export default defineBoot(async ({ redirect, urlPath }) => {
	const isAuthorized = (await anonClient.auth.getSession()).data.session;
	if (!isAuthorized && !urlPath.startsWith('/auth')) {
		redirect({ name: 'auth' });
		return;
	}
});
