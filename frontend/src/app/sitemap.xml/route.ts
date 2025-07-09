// app/sitemap.xml/route.ts
import { NextResponse } from 'next/server'
import { fetchFilteredPosts } from "@lib/fetchPostsByTagNCategory"
import { Post } from '@/types/post'

export async function GET() {
  const posts = await fetchFilteredPosts([], [])
  const baseUrl = 'https://the-learning-experience.com'

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${baseUrl}</loc>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>
    ${posts
      .map((post:Post) => `
        <url>
          <loc>${baseUrl}/posts/${post.slug}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `)
      .join('')}
  </urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml'
    }
  })
}
