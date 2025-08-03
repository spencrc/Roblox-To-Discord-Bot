import { ROBLOX_API_KEY } from "../config.js"

interface GetUserResponse {
    path: string,
    createTime: string,
    id: string,
    name: string,
    displayName: string,
    about: string,
    locale: string,
    premium: boolean
    socialNetworkProfiles: {
        facebook: string,
        twitter: string,
        youtube: string,
        twitch: string,
        guilded: string
    }
}

export const getUser = async (userId: string): Promise<GetUserResponse> => {
    const response: Response = await fetch(`https://apis.roblox.com/cloud/v2/users/${userId}`, {
        method: 'GET',
        headers: { 'x-api-key': ROBLOX_API_KEY }
    });

    const data = await response.json() as GetUserResponse;
	if (!response.ok) {
		throw new Error(`Get User request failed ${response.status}: ${JSON.stringify(data)}`);
	}

    return data;
}

export const getUserThumbnail = async (userId: string): Promise<string> => {
    const response = await fetch(`https://apis.roblox.com/cloud/v2/users/${userId}:generateThumbnail?size=420&format=PNG&shape=ROUND`, {
        method: 'GET',
        headers: { 'x-api-key': ROBLOX_API_KEY }
    });

	if (!response.ok) {
        const text = await response.text();
		throw new Error(`Generate User Thumbnail request failed ${response.status}: ${text}`);
	}

    const data = await response.json() as { response: { imageUri: string } };
    return data.response.imageUri;
}