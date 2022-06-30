import buildURL from "build-url";
import { CONFIG } from "./config";
import { v4 as uuidv4 } from 'uuid';
import fetch, { BodyInit, HeaderInit } from "node-fetch";
import FormData from "form-data";
import { storeRedirectCode } from "./redis";

export async function twitterAuthURL(redirect_uri: string = process.env.SITE_URL): Promise<string> {
    const id = uuidv4();
    await storeRedirectCode(redirect_uri, id);
    const data = await twitterGetRequestToken(id);

    console.log({ data })

    return buildURL(
        CONFIG.TWITTER_URL, {
        queryParams: {
            oauth_token: 'oauth_token',
        }
    }
    )
}

function hmac_sha1_signature(data: string, secret: string): string {
    return 'HMAC-SHA1';
}

function encodeComp(parameters) {
    let ordered = {};
    Object.keys(parameters).sort().forEach(function (key) {
        ordered[key] = parameters[key];
    });
    let encodedParameters = '';
    for (const kl in ordered) {
        const encodedValue = escape(ordered[kl]);
        const encodedKey = encodeURIComponent(kl);
        if (encodedParameters === '') {
            encodedParameters += encodeURIComponent(`${encodedKey}=${encodedValue}`)
        }
        else {
            encodedParameters += encodeURIComponent(`&${encodedKey}=${encodedValue}`);
        }
    }
    return encodedParameters;

}

export async function twitterGetRequestToken(uuid) {

    const timestamp = Date.now().toString();

    var params = encodeComp({
        oauth_callback: process.env.TWITTER_REDIRECT_URI,
        oauth_consumer_key: process.env.TWITTER_API_KEY,
        oauth_token: process.env.TWITTER_API_SECRET,
        oauth_signature_method: "HMAC-SHA1",
        oauth_timestamp: timestamp,
        oauth_nonce: uuid.toString(),
        oauth_version: "1.0",
    });

    const signature_base_string = `$POST&${encodeURI("https://api.twitter.com/oauth/request_token")}&${encodeComp(params)}`

    const sign = hmac_sha1_signature(signature_base_string, process.env.TWITTER_API_SECRET); 

    return await fetch(buildURL(
        "https://api.twitter.com/oauth/request_token", {
        queryParams: {
            oauth_callback: process.env.TWITTER_REDIRECT_URI,
            oauth_consumer_key: process.env.TWITTER_API_KEY,
            oauth_token: process.env.TWITTER_API_SECRET,
            oauth_signature_method: "HMAC-SHA1",
            oauth_timestamp: timestamp,
            oauth_nonce: uuid,
            oauth_version: "1.0",
            oauth_signature: sign
        }
    }
    ), {
        method: 'POST',
    }).then(response => response.text());
}
/**
 * Converts the Twitter OAuthCode into their User ID
 * @param code Twitter Code
 * @returns Twitter User ID
 */
export async function twitterFetchState(code: string): Promise<string> {
    return await("example");
}

export async function twitterFetchUser(access_token: string): Promise<String> {
    return await("example");
}