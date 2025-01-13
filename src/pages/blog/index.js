import { getSortedPostsData } from '../../lib/posts';

export async function getStaticProps() {
  try {
    const allPostsData = getSortedPostsData() || []; // 确保返回数组
    return {
      props: {
        allPostsData,
      },
    };
  } catch (error) {
    console.error('Error fetching posts data:', error);
    return {
      props: {
        allPostsData: [],
      },
    };
  }
}

export default function Blog({ allPostsData = [] }) {
  return (
    <div>
      <h1>My Blog</h1>
      <ul>
        {allPostsData.map(({ id, date, title }) => (
          id && title && (
            <li key={id}>
              <a href={`/blog/${id}`}>{title}</a>
              <br />
              <small>{date}</small>
            </li>
          )
        ))}
      </ul>
    </div>
  );
}
