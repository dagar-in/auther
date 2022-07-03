
import buildURL from "build-url";
import { CONFIG } from "./config";
import {v4 as uuidv4} from 'uuid';
import { storeRedirectCode } from "./redis";

export async function facebookAuthURL(redirect_uri: string = process.env.SITE_URL): Promise<string> {

    const id = uuidv4();
    await storeRedirectCode(redirect_uri, id);
    
    return buildURL(CONFIG.FACEBOOK_AUTH_URL, {
        queryParams: {
                    client_id : process.env.FACEBOOK_CLIENT_ID,
                    redirect_uri : process.env.FACEBOOK_REDIRECT_URI,
                    client_secret : id,
                    code: 'sdf',
                }
            });
}

export async function facebookFetchState(code: string): Promise<string> {
    return'';
}