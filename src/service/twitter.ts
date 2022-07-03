import buildURL from "build-url";
import { CONFIG } from "./config";
import { v4 as uuidv4 } from 'uuid';
import fetch from "node-fetch";
import { storeRedirectCode } from "./redis";
import { Client, auth } from "twitter-api-sdk";

export async function twitterAuthURL(redirect_uri: string = process.env.SITE_URL): Promise<string> {
    const id = uuidv4();
    await storeRedirectCode(redirect_uri, id);
    const data = await twitterGetRequestToken(id);
    const authClient = encodeComp()
    return authClient.generateAuthURL({
        state: id,
        code_challenge_method: "s256",
      });
}

function encodeComp(): any {
    return new auth.OAuth2User({
        client_id: process.env.TWITTER_CLIENT_ID as string,
        client_secret: process.env.TWITTER_CLIENT_SECRET as string,
        callback: process.env.TWITTER_REDIRECT_URI as string,
        scopes: ["tweet.read", "users.read"],
      });
}

export async function twitterGetRequestToken(uuid: { toString: () => any; }) {

    const authClient = encodeComp();
    const client = new Client(authClient);
    return await authClient.requestAccessToken(uuid as string);

}
/**
 * Converts the Twitter OAuthCode into their User ID
 * @param code Twitter Code
 * @returns Twitter User ID
 */
export async function twitterFetchState(code: string): Promise<string> {
    return await ("example");
}

export async function twitterFetchUser(access_token: string): Promise<String> {
    return await ("example");
}