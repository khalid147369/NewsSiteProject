import { Link } from "react-router-dom";
import "./post.css";
import { type IPost } from "../../utils/types"; // Adjust the import path as necessary

const Post = ({
  post,
  size,
  index,
}: {
  post: IPost | undefined;
  size: string;
  index: number;
}) => {
  return (
    <article
      className={
        size === "large"
          ? "post-large"
          : size === "medium"
          ? "post-medium"
          : "post"
      }
    >
      <Link to={`/post/${post?._id}`} className="post-link">
        {post?.image && (
          <img
            loading={index < 10 ? "eager" : "lazy"}
            src={post?.image}
            alt={post?.title}
          />
        )}
        <h1>{post?.title}</h1>
        <p>{post?.description}</p>
        <footer className="flex justify-between">
          <small>{post?.source?.name}</small>
          <small>
            {post?.publishedAt
              ? new Date(post.publishedAt).toDateString()
              : "Unknown Date"}
          </small>
        </footer>
      </Link>
    </article>
  );
};

export default Post;
