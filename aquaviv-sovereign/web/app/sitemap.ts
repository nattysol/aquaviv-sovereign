import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://aquaviv-sovereign.vercel.app';

  // 1. Fetch all product slugs from Sanity
  const products = await client.fetch(`*[_type == "product"] { "slug": slug.current, _updatedAt }`);

  // 2. Map products to sitemap entries
  const productEntries = products.map((product: any) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(product._updatedAt),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // 3. Static Routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/affiliate/join`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  return [...staticRoutes, ...productEntries];
}