import { DB } from '$lib/database.js'

export const load = async ({ params }) => {
    const client = await DB()
    let data = await client.get('SELECT data, username, bumped_at FROM document WHERE url=?',[params.slug])
    await client.close()

    if (data){
        return {
            url: params.slug,
            success: true,
            username: data.username,
            lastBumped: data.bumped_at,
            data: JSON.parse(data.data),
            reason: null
        }
    } else {
        return {
            url: params.slug,
            success: false,
            username: null,
            lastBumped: null,
            data: null,
            reason: 'Not Found'
        }
    }
}