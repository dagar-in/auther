import { authCreateJWT } from '../service/auth';
import { twitterAuthURL, twitterFetchState, twitterFetchUser} from '../service/twitter';
import { dataFetchUser } from '../service/database';
import BuildUrl from 'build-url';
import { User } from '../types/user';
import { getRedirectCode } from '../service/redis';
import { checkRedirectUrl } from './auth';


export default function (fastify, _opts, next) {
    /*
    *  /login
    *  Send the user to twitter
    */
    fastify.get('/login', async (_request, reply) => {
        const redirect_uri = checkRedirectUrl(_request.query['redirect_uri']);
    
        console.log({twitter: true, redirect_uri, });
        return reply.redirect(
            await twitterAuthURL(redirect_uri)
        );

    });


    /*
     * /callback
     * Process data from twitter
     */
    fastify.get('/callback', async (request, reply) => {
        return reply.redirect(await (async () => {
            if (!request.query['code'])
                return '/twitter/login';
            if (!request.query['state'])
                return '/';
            const access_token = await twitterFetchState(request.query['code'].toString());

            const twitterUser = await twitterFetchUser(access_token);
            console.log(twitterUser.id);

            const user_instance = await dataFetchUser('twitter', twitterUser.id.toString(), () => User.create(
                {
                    username: twitterUser.name || '',
                    avatar: twitterUser.picture || '',
                    bio: ''
                }
            ))

            return BuildUrl(
                await getRedirectCode(request.query['state'].toString() || ''), {
                queryParams: {
                    'token': authCreateJWT(user_instance)
                }
            }
            );

        })());
    });
    next();
}