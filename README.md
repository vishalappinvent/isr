# Next.js ISR Example (v13.9.5 - Pages Router)

This is a [Next.js](https://nextjs.org) project demonstrating **Incremental Static Regeneration (ISR)** with 2-minute caching using the Pages Router.

Built with Next.js 13.5.6 (Pages Router)

## Features

- ✅ Pages cached for 2 minutes (120 seconds)
- ✅ Fast static page serving
- ✅ Background regeneration after cache expires
- ✅ No downtime during regeneration
- ✅ Random products change after each revalidation
- ✅ Pages Router implementation with `getStaticProps`

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

> **⚠️ Important Note**: ISR (Incremental Static Regeneration) **does NOT work in development mode**. In `npm run dev`, `getStaticProps` runs on every request, so the `revalidate` timing is ignored. To test ISR locally, you need to build and run in production mode:
>
> ```bash
> npm run build
> npm start
> ```
>
> Then open [http://localhost:3000](http://localhost:3000) - you'll see ISR working with 2-minute caching!

## ISR Implementation

The ISR example is implemented in `pages/index.tsx` using `getStaticProps`:

```typescript
export const getStaticProps: GetStaticProps = async () => {
  // Fetch data from API
  const data = await fetch('/api/products');
  
  return {
    props: {
      products: data.products,
      generatedAt: data.generatedAt,
    },
    // ISR: Revalidate every 120 seconds (2 minutes)
    revalidate: 120,
  };
};
```

### How It Works

1. **First Request**: Page is generated at build time and served statically
2. **Within 2 Minutes**: All subsequent requests receive the cached static page (very fast!)
3. **After 2 Minutes**: The next request triggers background regeneration
4. **During Regeneration**: Users still receive the old cached page (no downtime)
5. **After Regeneration**: Future requests serve the newly generated page with NEW random products

## Project Structure

```
pages/
  ├── index.tsx              # Home page with ISR example
  ├── _app.tsx               # App wrapper
  └── api/
      └── products.ts         # API route for random products
components/
  ├── LocalTimestamp.tsx      # Client component for local time
  └── RegenerationCountdown.tsx # Countdown timer
```

## Differences from App Router

- Uses `getStaticProps` instead of `export const revalidate`
- API routes use `pages/api/` instead of `app/api/`
- Uses `Head` component from `next/head` for metadata
- Layout handled by `_app.tsx` instead of `layout.tsx`

## Learn More

- [Next.js ISR Documentation](https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration)
- [Next.js 13 Documentation](https://nextjs.org/docs)
- [Pages Router Guide](https://nextjs.org/docs/pages)

