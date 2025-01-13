import Image from 'next/image';
import Link from 'next/link';
import { PostMetadata } from '../types/blog';

export function PostCard({ post }: { post: PostMetadata }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {post.coverImage && (
        <div className="relative h-48">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <Link 
          href={`/blog/${post.id}`}
          className="text-xl font-semibold hover:text-blue-600"
        >
          {post.title}
        </Link>
        {post.excerpt && (
          <p className="mt-2 text-gray-600">{post.excerpt}</p>
        )}
        <div className="mt-4 flex items-center justify-between">
          {post.author && (
            <span className="text-sm text-gray-500">
              By {post.author}
            </span>
          )}
          <time className="text-sm text-gray-500">
            {new Date(post.date).toLocaleDateString()}
          </time>
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span 
                key={tag}
                className="px-2 py-1 text-sm bg-gray-100 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}