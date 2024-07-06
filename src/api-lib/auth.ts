import NextAuth from "next-auth";
// import GitHub from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import gs from "./db"; // -full
import GongoAuthAdapter, { AdapterUser } from "./gongoAuthAdapter";
import { ObjectId } from "gongo-server-db-mongo";
import { ipFromReq } from "./ipCheck";

interface Service {
  service: string;
  id: string;
  profile: {
    id: string;
    displayName: string;
    name?: {
      familyName: string;
      givenName: string;
    };
    emails: { value: string; verified: boolean }[];
    photos: { value: string }[];
    provider: string;
    _json: Record<string, unknown>;
  };
}

function newUserFromService<T extends Record<string, unknown>>(
  service: Service,
  overrides: T = {} as T
) {
  return {
    id: service.id,
    displayName: service.profile.displayName,
    name: service.profile.name
      ? service.profile.name.givenName + " " + service.profile.name.familyName
      : service.profile.displayName,
    emails: service.profile.emails,
    email: service.profile.emails[0].value,
    emailVerified: service.profile.emails[0].verified,
    photos: service.profile.photos,
    image: service.profile.photos[0].value,
    services: [service],
    createdAt: new Date(),
    ...overrides,
  };
}

const authOptions = {
  adapter: GongoAuthAdapter(gs),

  callbacks: {
    // async session() <-- further below since it needs req/res access
    /*
    redirect: async (...args) => {
      console.log(args);
      return;
    },
    */
  },

  providers: [
    /*
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      // scope: "user:email",
      // allRawEmails: true,
      profile(profile) {
        const service = {
          service: "github",
          id: profile.id.toString(),
          profile: {
            id: profile.id.toString(),
            displayName: profile.name || "No GitHub name",
            username: profile.login,
            profileUrl: profile.html_url,

            // Note, this relies on our custom GithubProvider
            emails: profile.emails.map((email) => ({
              value: email.email,
              verified: email.verified,
              primary: email.primary,
              visibility: email.visibility,
            })),
            // [{ value: profile.email }],

            photos: [{ value: profile.avatar_url }],
            provider: "github",
            _json: profile,
          },
        };

        return newUserFromService(service, {
          name: profile.name, // <-- full name in one string
        });
      },
    }),
    */
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        const service: Service = {
          service: "google",
          id: profile.sub,
          profile: {
            id: profile.sub,
            displayName: profile.name,
            name: {
              familyName: profile.family_name || "",
              givenName: profile.given_name,
            },
            emails: [
              { value: profile.email, verified: profile.email_verified },
            ],
            photos: [{ value: profile.picture }],
            provider: "google",
            _json: profile,
          },
        };

        return newUserFromService(service, {
          name: profile.name, // <-- full name in one string
        });
      },
    }),
    /*
    TwitterProvider({
      clientId: process.env.TWITTER_CONSUMER_KEY!,
      clientSecret: process.env.TWITTER_CONSUMER_SECRET!,
      // TwitterLegacyProfile unless { options: { version: "2.0" } }
      profile(profile: TwitterLegacyProfile) {
        const service: Service = {
          service: "twitter",
          id: profile.id_str,
          profile: {
            username: profile.screen_name,
            displayName: profile.name,
            // @ts-expect-error: "Request email address from users" in app perms
            emails: [{ value: profile.email }],
            // @ts-expect-error: "Request email address from users" in app perms
            email: profile.email,
            photos: [{ value: profile.profile_image_url_https }],
            image: profile.profile_image_url_https,
            provider: "twitter",
            _json: profile as unknown as Record<string, unknown>,
          },
        };

        return newUserFromService(service, {
          name: profile.name, // <-- full name in one string
        });
      },
    }),
    */
  ],
};

export const { auth, handlers, signIn, signOut } = NextAuth((req) => {
  if (!req) return authOptions;

  return {
    ...authOptions,
    callbacks: {
      ...authOptions.callbacks,
      async session({ session, user }) {
        session.user.id = user.id;
        // console.log("session", session);

        // Note, session called not only during session creation.  Should we
        // or should we not overwrite these values?
        await gs.dba.collection("sessions").updateOne(
          {
            userId: new ObjectId(user.id),
            expires: new Date(session.expires),
          },
          {
            $set: {
              ip: ipFromReq(req),
              userAgent:
                req.headers instanceof Headers
                  ? req.headers.get("user-agent")
                  : req.headers["user-agent"],
            },
          }
        );

        return session;
      },
    },
  };
});
