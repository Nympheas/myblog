import { GetStaticProps } from 'next';
import { getAllPosts } from '../../lib/posts';
import { PostCard } from '../../components/PostCard';
import { PostMetadata } from '../../types/blog';

interface BlogIndexProps {
  posts: PostMetadata[];
}

export const getStaticProps: GetStaticProps<BlogIndexProps> = async () => {
  try {
    const posts = getAllPosts();
    return {
      props: { posts },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      props: { posts: [] },
      revalidate: 60,
    };
  }
};

export default function BlogIndex({ posts }: BlogIndexProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
