import { notFound } from 'next/navigation';
import type { Category } from './category';

// `server-only` guarantees any modules that import code in file
// will never run on the client. Even though this particular API
// doesn't currently use sensitive environment variables, it's
// good practice to add `server-only` preemptively.
import 'server-only';
import { headers } from 'next/headers';

export const runtime = 'edge';

export async function getCategories({ parent }: { parent?: string } = {}) {
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
  const res = await fetch(
    `https://app-playground-api.vercel.app/api/categories${
      parent ? `?parent=${parent}` : ''
    }`,
  );

  if (!res.ok) {
    // Render the closest `error.js` Error Boundary
    throw new Error('Something went wrong!');
  }

  const categories = (await res.json()) as Category[];

  if (categories.length === 0) {
    // Render the closest `not-found.js` Error Boundary
    notFound();
  }

  return categories;
}

export async function getCategory({ slug }: { slug: string }) {
  const res = await fetch(
    `https://app-playground-api.vercel.app/api/categories${
      slug ? `?slug=${slug}` : ''
    }`,
  );

  if (!res.ok) {
    // Render the closest `error.js` Error Boundary
    throw new Error('Something went wrong!');
  }

  const category = (await res.json()) as Category;

  if (!category) {
    // Render the closest `not-found.js` Error Boundary
    notFound();
  }

  return category;
}
