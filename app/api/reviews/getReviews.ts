import { notFound } from 'next/navigation';
import type { Review } from './review';

// `server-only` guarantees any modules that import code in file
// will never run on the client. Even though this particular api
// doesn't currently use sensitive environment variables, it's
// good practise to add `server-only` preemptively.
import 'server-only';
import { headers } from 'next/headers';

export async function GET() {
  try {
    console.log('headers', headers());
    const headersList = headers();
    console.log('headers', headersList);
    const referer = headersList.get('referer');
    console.log('referer', referer);
  } catch (e) {
    // @ts-ignore
    console.log('error', e.message);
  }

  const res = await fetch(`https://app-playground-api.vercel.app/api/reviews`);

  if (!res.ok) {
    // Render the closest `error.js` Error Boundary
    throw new Error('Something went wrong!');
  }

  const reviews = (await res.json()) as Review[];

  if (reviews.length === 0) {
    // Render the closest `not-found.js` Error Boundary
    notFound();
  }

  return reviews;
}
