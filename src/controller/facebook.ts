import { authCreateJWT } from "../service/auth";
import {
    facebookAuthURL,
    facebookFetchState,
  } from "../service/facebook";
  import { checkRedirectUrl } from "./auth";

export default function (fastify, _opts, next) {

  fastify.get("/login", async (_request, reply) => {

    const redirect_uri = checkRedirectUrl(_request.query['redirect_uri']);

    console.log({redirect_uri});

    return reply
      .redirect(
        await facebookAuthURL(redirect_uri),
      );

  });

}
