export interface PostMetadata {
    id: string;
    title: string;
    date: string;
    excerpt?: string;
    author?: string;
    tags?: string[];
    coverImage?: string;
  }
  
  export interface Post extends PostMetadata {
    contentHtml: string;
  }
  