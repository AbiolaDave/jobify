This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Backend configuration

Add these server-only variables to `.env.local`:

```env
URI=mongodb+srv://...
JWT_SECRET=a-random-secret-at-least-32-characters-long
GMAIL_USER=your-gmail-address
GMAIL_APP_PASSWORD=your-google-app-password
JOBBLE_API=your-jooble-api-key
```

`JOBBLE_API` is the API key used by Jooble's `https://jooble.org/api/{key}` jobs endpoint. When configured, listings and featured jobs come from Jooble, and an authenticated Jobify application is recorded before the user can continue to the original listing. If the API key is absent, the existing sample listings are shown for local development.

Sign-up and sign-in use a one-time code sent by Gmail. MongoDB stores accounts, short-lived verification challenges, and applications. The session is held in an HTTP-only cookie; never expose these environment variables through a `NEXT_PUBLIC_` variable or commit their values.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
