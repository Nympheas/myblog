import { GetStaticProps, GetStaticPaths } from 'next';
import { getAllPosts, getPostBySlug } from '../../lib/posts';
import { Post } from '../../types/blog';
import ErrorPage from 'next/error';
import Image from 'next/image';

interface PostPageProps {
  post: Post | null;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts();
  return {
    paths: posts.map(post => ({
      params: { slug: post.id }
    })),
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps<PostPageProps> = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    const post = await getPostBySlug(slug);
    return {
      props: { post },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return {
      props: { post: null },
      revalidate: 60,
    };
  }
};

export default function PostPage({ post }: PostPageProps) {
  if (!post) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8">
        {post.coverImage && (
          <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center justify-between text-gray-600">
          {post.author && (
            <span>By {post.author}</span>
          )}
          <time>{new Date(post.date).toLocaleDateString()}</time>
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span 
                key={tag}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  );
}