import { NextResponse } from "next/server";
// import { fetchFilteredDevlogs } from "@lib/fetchDevlogEventsByTagNCategory"
// import { Post } from '@/types/post'

// ${devlogEvents
//   .map((post:Post) => `
//     <url>
//       <loc>${baseUrl}/devlogEvents/${post.slug}</loc>
//       <changefreq>weekly</changefreq>
//       <priority>0.8</priority>
//     </url>
//   `)
//   .join('')}

export async function GET() {
  // const devlogEvents = await fetchFilteredDevlogs([], [])
  const baseUrl = "http://satorix.duckdns.org/";

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${baseUrl}</loc>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>

  </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
