import { Router } from 'express';
import { ROBLOX_CLIENT_ID, ROBLOX_SECRET } from '../config.js';
import { HttpError } from '../classes/http-error.js';

const router = Router();

interface TokenResponse {
    "access_token": string,
    "refresh_token": string,
    "token_type": string,
    "expires_in": number,
    "scope": string
}

interface UserInfoResponse {
    "sub": string, //roblox user id
    "name": string, //roblox display name
    "nickname": string, //roblox display name
    "preferred_username": string, //roblox username
    "created_at": number, //unix timestamp
    "profile": string, //link to profile
    "picture": string //link to profile thumbnail
}

const TOKEN_URL = 'https://apis.roblox.com/oauth/v1/token';
const USER_INFO_URL = 'https://apis.roblox.com/oauth/v1/userinfo';
const REVOKE_URL = 'https://apis.roblox.com/oauth/v1/token/revoke';

//todo: add code_verifier to getToken params
const getToken = async (code: string): Promise<TokenResponse> => {
    const params = new URLSearchParams();
    params.append('client_id', ROBLOX_CLIENT_ID);
    params.append('client_secret', ROBLOX_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);

    const response: Response = await fetch(TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString()
    });

    const text = await response.text()
    if (!response.ok) {
        throw new HttpError(response.status, `Token exchange failed ${response.status}: ${text}`);
    }

    return await JSON.parse(text) as TokenResponse;
}

const getUserInfo = async (token: string): Promise<UserInfoResponse> => {
    const response = await fetch(USER_INFO_URL, {
		headers: { "Authorization": `Bearer ${token}` }
	});

    const text = await response.text();
    if (!response.ok) {
        throw new HttpError(response.status, `User info request failed ${response.status}: ${text}`);
    }

    return await JSON.parse(text) as UserInfoResponse;
}

const revokeRefreshToken = async (refreshToken: string): Promise<void> => {
    const params = new URLSearchParams();
    params.append('token', refreshToken);
    params.append('client_id', ROBLOX_CLIENT_ID);
    params.append('client_secret', ROBLOX_SECRET);

    await fetch(REVOKE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString()
    });
}

//todo: verify statecode
export default router.get('/', async (req, res) => {
    const code = req.query.code as string;
    console.log("Sucess! Re-direct page was reached!");

    const { access_token: accessToken, refresh_token: refreshToken } = await getToken(code);

    res.status(200);
    res.send('Success!');

    const { sub: userId } = await getUserInfo(accessToken);
    console.log(userId);

    await revokeRefreshToken(refreshToken);
    // const introspectParams = new URLSearchParams();
    // introspectParams.append('token', refreshToken);
    // introspectParams.append('client_id', ROBLOX_CLIENT_ID);
    // introspectParams.append('client_secret', ROBLOX_SECRET);

    // const introspectResponse = await fetch('https://apis.roblox.com/oauth/v1/token/introspect',{
    //     method: "POST",
    //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //     body: introspectParams.toString()
    // });

    // const introspectData = await introspectResponse.json() as JSON;
    // console.log(introspectData);
});
