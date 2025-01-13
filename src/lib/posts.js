import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
  try {
    // Ensure the directory exists
    if (!fs.existsSync(postsDirectory)) {
      console.warn('Posts directory does not exist');
      return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map((fileName) => {
        const id = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        
        try {
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const matterResult = matter(fileContents);

          return {
            id,
            title: matterResult.data.title || '',
            date: matterResult.data.date || '',
            ...matterResult.data,
          };
        } catch (error) {
          console.error(`Error processing ${fileName}:`, error);
          return null;
        }
      })
      .filter(Boolean); // Remove any null entries

    return allPostsData.sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (error) {
    console.error('Error in getSortedPostsData:', error);
    return [];
  }
}

export function getAllPostIds() {
  try {
    if (!fs.existsSync(postsDirectory)) {
      return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map((fileName) => ({
        params: {
          id: fileName.replace(/\.md$/, ''),
        },
      }));
  } catch (error) {
    console.error('Error in getAllPostIds:', error);
    return [];
  }
}

export async function getPostData(id) {
  try {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Post not found: ${id}`);
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    // Convert markdown to HTML string
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content);
    const contentHtml = processedContent.toString();

    return {
      id,
      contentHtml,
      title: matterResult.data.title || '',
      date: matterResult.data.date || '',
      ...matterResult.data,
    };
  } catch (error) {
    console.error(`Error in getPostData for ${id}:`, error);
    throw error;
  }
}