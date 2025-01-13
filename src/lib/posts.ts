import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { Post, PostMetadata } from '../types/blog';

const postsDirectory = path.join(process.cwd(), 'posts');

export async function getPostBySlug(slug: string): Promise<Post> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Post not found: ${slug}`);
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    const processedContent = await remark()
      .use(html, { sanitize: true })
      .process(content);
      
    return {
      id: slug,
      contentHtml: processedContent.toString(),
      title: data.title || '',
      date: data.date ? new Date(data.date).toISOString() : '',
      excerpt: data.excerpt || '',
      author: data.author || '',
      tags: data.tags || [],
      coverImage: data.coverImage || '',
    };
  } catch (error) {
    console.error(`Error in getPostBySlug for ${slug}:`, error);
    throw error;
  }
}

export function getAllPosts(): PostMetadata[] {
  try {
    if (!fs.existsSync(postsDirectory)) {
      console.warn('Posts directory does not exist');
      return [];
    }

    const files = fs.readdirSync(postsDirectory);
    const posts = files
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const slug = file.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, file);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        return {
          id: slug,
          title: data.title || '',
          date: data.date ? new Date(data.date).toISOString() : '',
          excerpt: data.excerpt || '',
          author: data.author || '',
          tags: data.tags || [],
          coverImage: data.coverImage || '',
        };
      });

    return posts.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
  } catch (error) {
    console.error('Error in getAllPosts:', error);
    return [];
  }
}
