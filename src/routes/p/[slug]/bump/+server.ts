import { HCAPTCHA_SECRET } from '$env/static/private';
import { DB } from '$lib/database.js'
import pwdEncrypt from '$lib/password'
import type { RequestHandler } from '@sveltejs/kit'
async function validateToken(token: string, secret: string) {
    const response = await fetch(
        'https://api.hcaptcha.com/siteverify',
        {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                response: token,
                secret: secret
              }).toString(),
        },
    );

    const data: TokenValidateResponse = await response.json();

    return {
        // Return the status
        success: data.success,
        error: data['error-codes']?.length ? data['error-codes'][0] : null,
    };
}
export const POST: RequestHandler = async ({ request, params }) => {
    const requestBody = await request.json()

    const HCAPTCHA = await validateToken(requestBody.token, HCAPTCHA_SECRET)
    if (!HCAPTCHA.success){
        return new Response(JSON.stringify({success: false, reason: 'CAPTCHA Error'}), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
    if (requestBody.password == ""){
        return new Response(JSON.stringify({success: false, reason: 'Wrong Password'}), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
    const client = await DB()
    const document = await client.get(`select * from document where url=?`, [params.slug])
    const hashed = await pwdEncrypt(requestBody.password, document.password_salt).hashedPwd
    console.log(document.password_salt, document.password_plain)
    if (hashed == document.password_plain){
        await client.run(`UPDATE document SET bumped_at=(datetime('now', 'localtime')) WHERE url=?`, [params.slug])
        await client.close()
    } else {
        await client.close()
        return new Response(JSON.stringify({success: false, reason: 'Wrong Password'}), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
    return new Response(JSON.stringify({success: true}), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}