import { getAllPostIds, getPostData } from '../../lib/posts';
import ErrorPage from 'next/error';

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    // Change to true if you want to enable incremental static regeneration
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  try {
    const postData = await getPostData(params.id);
    return {
      props: {
        postData,
      },
      // Optionally enable revalidation
      // revalidate: 60,
    };
  } catch (error) {
    console.error('Error fetching post data:', error);
    return {
      notFound: true,
    };
  }
}

export default function Post({ postData }) {
  // Handle case where post data is missing
  if (!postData?.title) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <article className="max-w-2xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{postData.title}</h1>
        {postData.date && (
          <div className="text-gray-600">
            {new Date(postData.date).toLocaleDateString()}
          </div>
        )}
      </header>
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }} 
      />
    </article>
  );
}