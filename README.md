<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

## Description

A NestJS template with MongoDB integration and Better Auth authentication system. This starter repository provides a solid foundation for building secure, scalable backend applications with role-based access control and comprehensive user management.

## Features

- **MongoDB Integration**: Ready-to-use MongoDB connection with Better Auth adapter
- **Better Auth**: Comprehensive authentication system with session management, email/password auth, google sign on and more
- **Role-Based Access Control**: Multi-role system (admin, vendor, customer) with custom signup logic
- **AWS S3 Storage**: File upload and management service with pre-signed URLs and validation
- **Stripe Integration**: Payment processing with checkout sessions and webhook handling
- **Security**: Built-in security features with secure session handling and user verification
- **TypeScript**: Full TypeScript support for type safety
- **Modular Architecture**: Clean, modular structure following NestJS best practices

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Authentication Setup

The template includes Better Auth, a comprehensive authentication solution:

- Email and password authentication
- Session-based authentication with secure cookies
- Role-based permissions (admin, vendor, customer)
- Custom user creation hooks with role assignment
- Database integration with MongoDB adapter
- Support for multiple authentication methods and providers

## Storage Setup

The template includes AWS S3 integration for file storage:

- File upload with validation (PDF, images up to 10MB)
- Secure file management with pre-signed URLs
- Automatic file key generation using nanoid
- Support for organized folder structure
- File deletion capabilities
- MIME type validation and size limits

## Stripe Setup

The template includes Stripe integration for payment processing:

- Checkout session creation for secure payments
- Webhook signature verification for event processing
- Support for multiple currencies
- Automatic amount conversion to lowest currency unit (cents/kobo)
- Transaction reference tracking via metadata
- Customizable success and cancel URLs

### Local Development with Stripe CLI

To test Stripe webhooks locally, use the Stripe CLI to forward events to your local server:

1. Install the Stripe CLI: https://stripe.com/docs/stripe-cli

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. Copy the webhook signing secret from the CLI output and set it as `STRIPE_WEBHOOK_SECRET` in your `.env` file.

5. In a separate terminal, run your server:
   ```bash
   npm run start:dev
   ```

The webhook endpoint at `/api/webhooks/stripe` will now receive Stripe events for testing checkout sessions, payment completions, and other payment flows.

## Database Migrations

The template uses migrate-mongo for database schema migrations, allowing you to manage MongoDB collection changes and data transformations in a controlled manner.

### Creating a Migration

To create a new migration file:

```bash
$ npm run create-db-migration migration-name
```

This will generate a timestamped migration file in the `migrations/` directory with the following structure:

```javascript
module.exports = {
  async up(db, client) {
    // Migration logic goes here
  },

  async down(db, client) {
    // Rollback logic goes here
  },
};
```

### Running Migrations

Migrations are automatically run when starting the application. The `migrate-db` script executes all pending migrations:

```bash
$ npm run migrate-db
```

### Migration Workflow

1. Create a migration: `npm run create-db-migration your-migration-name`
2. Edit the generated migration file with your database changes
3. Implement both `up` and `down` (optional) methods for forward and rollback operations
4. Start your application - migrations will run automatically

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/your-database
DB_NAME=your-database
BASE_URL=http://localhost:3000
ADMIN_SIGNUP_TYPE=admin-secret-key
ZEN_DOMAIN=@yourdomain.com
BETTER_AUTH_SECRET=your-auth-secret

#AWS
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_REGION=region
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_BUCKET_NAME=bucket-name

#Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
