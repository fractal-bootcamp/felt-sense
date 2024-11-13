import { authkitMiddleware, getSession } from "@workos-inc/authkit-nextjs";
import { NextRequest, NextFetchEvent, NextResponse } from "next/server";
// import { userQueries } from "./lib/db/queries";
import prisma from "./lib/prisma";

export const runtime = "edge";

authkitMiddleware({
  middlewareAuth: {
    enabled: true,
    unauthenticatedPaths: ["/"],
  },
});
// async function authMiddleware(request: NextRequest, event: NextFetchEvent) {
//   const response = await authkitMiddleware({
//     middlewareAuth: {
//       // Enable the middleware on all routes by default
//       enabled: true,
//       // Allow logged out users to view these paths
//       unauthenticatedPaths: ["/"],
//     },
//   })(request, event);

//   return response;
// }

export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent
): Promise<NextResponse> {
  // authkitMiddleware({
  //   middlewareAuth: {
  //     enabled: true,
  //     unauthenticatedPaths: ["/"],
  //   },
  // });
  console.log("middleware");

  // authkitMiddleware will handle refreshing the session if the access token has expired
  // const response = await authMiddleware(request, event);

  const response = await authkitMiddleware({
    middlewareAuth: {
      enabled: true,
      unauthenticatedPaths: ["/"],
    },
  })(request, event);
  console.log("responsefirst", response);
  if (!response) {
    console.error("response is undefined");
  }
  console.log("response defined");
  console.log(response);

  // If session is undefined, the user is not authenticated
  const session = await getSession(response);

  if (!session || !session.user) {
    console.log("session not found");
    return response;

    // const locationHeader = response.headers.get("location");
    // const redirectUrl = locationHeader
    //   ? new URL(locationHeader)
    //   : new URL("/", request.url);
    // return NextResponse.redirect(redirectUrl);
  }
  console.log("session found");

  response?.headers.set("x-authenticated-user-id", session.user.id);

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: session.user.id,
    },
  }); //await userQueries.getUserByUserId(session.user.id);
  if (!user) {
    await prisma.user.create({
      data: {
        clerkUserId: session.user.id,
      },
    }); //userQueries.createUser(session.user.id);
  }

  // ...add additional middleware logic here

  return response;
}

// Match against pages that require auth
// Leave this out if you want auth on every resource (including images, css etc.)
export const config = { matcher: ["/api/:path*", "/chat"] };
