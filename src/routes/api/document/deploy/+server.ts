import { CF_TURNSTILE_SECRET, HCAPTCHA_SECRET } from '$env/static/private';
import { DB } from '$lib/database'
import pwdEncrypt from '$lib/password';
import type { RequestHandler } from '@sveltejs/kit'
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';


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


export const POST: RequestHandler = async ({ request }) => {
    const requestBody = await request.json()
    if (requestBody.username == "" || requestBody.password == ""){
        return new Response(JSON.stringify({success: false}), {
            status: 405,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
    const CAPTCHA = await validateToken(requestBody.token, HCAPTCHA_SECRET)
    console.log(CAPTCHA)
    if (!CAPTCHA.success){
        return new Response(JSON.stringify({success: false}), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
    const lowerCaseName: string = uniqueNamesGenerator({
        dictionaries: [colors, adjectives, animals],
        style: 'lowerCase'
    }); //
    const client = await DB()
    const passwordData = pwdEncrypt(requestBody.password)
    await client.run(`INSERT INTO document (url, password_plain, password_salt, username, data) VALUES (?,?,?,?,?)`, [lowerCaseName, passwordData.hashedPwd, passwordData.salt, requestBody.username, JSON.stringify(requestBody.data)])
    await client.close()
    return new Response(JSON.stringify({success: true, url: `page.cply.io/p/${lowerCaseName}`}), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}