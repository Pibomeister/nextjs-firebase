import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { firestore, postToJSON, fromMillis } from '../lib/firebase';
import { useCallback, useState } from 'react';
import PostFeed from '../components/PostFeed';

// Max post to query per page
const LIMIT = 10;

export async function getServerSideProps(context) {
  const postsQuery = firestore
    .collectionGroup('posts')
    .where('published', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(LIMIT);

  const posts = (await postsQuery.get()).docs.map(postToJSON);

  return {
    props: { posts }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = useCallback(async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor =
      typeof last?.createdAt === 'number'
        ? fromMillis(last?.createdAt)
        : last?.createdAt;

    const query = !!cursor
      ? firestore
          .collectionGroup('posts')
          .where('published', '==', true)
          .orderBy('createdAt', 'desc')
          .startAfter(cursor)
          .limit(LIMIT)
      : firestore
          .collectionGroup('posts')
          .where('published', '==', true)
          .orderBy('createdAt', 'desc');

    const newPosts = (await query.get()).docs.map((doc) => doc.data());

    setPosts(posts.concat(newPosts));
    setLoading(false);
  }, []);

  return (
    <main>
      <PostFeed posts={posts} admin={false} />

      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load more</button>
      )}

      <Loader show={loading} />

      {postsEnd && 'You have reached the end!'}
    </main>
  );
}
