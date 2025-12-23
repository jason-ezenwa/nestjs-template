import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
import { FALLBACK_BASE_URL, FALLBACK_MONGODB_URI } from './constants';

config();

// Create MongoDB connection for Better Auth
const mongoUri = process.env.MONGODB_URI || FALLBACK_MONGODB_URI;

const client = new MongoClient(mongoUri);
const db = client.db();

const redirectURI = process.env.BASE_URL
  ? `${process.env.BASE_URL}/api/auth/callback/google`
  : `${FALLBACK_BASE_URL}/api/auth/callback/google`;

export const auth = betterAuth({
  baseURL: process.env.BASE_URL || FALLBACK_BASE_URL,
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_SSO_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_SSO_CLIENT_SECRET || '',
      redirectURI: redirectURI,
    },
  },
  trustedOrigins: [
    'http://localhost:5173', // Vite dev server
  ],
  user: {
    modelName: 'users',
    additionalFields: {
      role: {
        type: 'string',
        required: true,
        defaultValue: 'customer',
        input: false,
      },
    },
  },
  account: {
    modelName: 'accounts',
  },
  session: {
    modelName: 'sessions',
  },
  verification: {
    modelName: 'verifications',
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          // Check for signup type
          const signupType = ctx?.headers?.get('x-signup-type');

          const adminSignupType = process.env.ADMIN_SIGNUP_TYPE;

          if (!adminSignupType) {
            throw new Error('ADMIN_SIGNUP_TYPE is not set');
          }

          let role = 'customer';

          if (
            signupType === adminSignupType &&
            user.email?.endsWith(`${process.env.ZEN_DOMAIN}`)
          ) {
            role = 'admin';
          } else if (signupType === 'vendor') {
            role = 'vendor';
          }

          return {
            data: {
              ...user,
              role: role,
            },
          };
        },
      },
    },
  },
});
