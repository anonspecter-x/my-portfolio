import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://meetsakib.com'; 

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/', // অ্যাডমিন প্যানেল গুগল স্ক্যান করবে না
        '/api/',       // API রুটগুলো স্ক্যান করার দরকার নেই
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}