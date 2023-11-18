import {DBInit, DB} from '$lib/database'
import type { Handle } from '@sveltejs/kit'
export const handle: Handle = async ({ event, resolve }) => {
    return resolve(event);
}


DBInit()