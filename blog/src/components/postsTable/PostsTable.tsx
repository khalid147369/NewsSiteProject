import { Alert, Button, Card, Typography } from "@material-tailwind/react";
import type { IPost } from "../../utils/types";
import { Link } from "react-router-dom";
import { ListItems } from "../list/List"; // Fixed casing
import React, { useEffect } from "react";
// import { removePosts } from "../../api/posts";
// import { usePostsContext } from "../../context/PanelContext";
// import { useUser } from "../../context/UserContext";

const TABLE_HEAD = ["title", "Category", "Date", "Actions"];

export function PostTable({ posts }: { posts: IPost[] }) {
  const [visible, setVisible] = React.useState(false);
  const [checked, setChecked] = React.useState<boolean[]>([]);
  const [postsToDelete, setPostsToDelete] = React.useState<string[]>([]);
  const [message, setMessage] = React.useState<string>("");
  // const { categories, currentCategory } = usePostsContext();
  // const { user } = useUser();
  useEffect(() => {
    setPostsToDelete([]);
    posts?.map((post, index) => {
      handleReSelect(index, post._id);
    });
  }, [posts]);
  const handleShowSelect = (index: number, id: string) => {
    setVisible(true);
    handleSelect(index, id);
  };

  const handleSelect = (
    index: number,
    id: string,
    fromSelectAll: boolean = false
  ) => {
    setChecked((prev) => {
      const arr = [...prev];
      fromSelectAll
        ? (arr[index] = true) // Si es desde Select All, marca como true
        : (arr[index] = !arr[index]);

      if (id) {
        setPostsToDelete((prevPosts) => {
          if (arr[index]) {
            // Si se selecciona, agrega solo si no está
            return prevPosts.includes(id) ? prevPosts : [...prevPosts, id];
          } else {
            // Si se deselecciona, quita el id
            return prevPosts.filter((pid) => pid !== id);
          }
        });
      }

      return arr;
    });
  };
  const handleReSelect = (index: number, id: string) => {
    setChecked((prev) => {
      const arr = [...prev];

      if (id) {
        setPostsToDelete((prevPosts) => {
          if (arr[index]) {
            // Si se selecciona, agrega solo si no está

            return prevPosts.includes(id) ? prevPosts : [...prevPosts, id];
          } else {
            // Si se deselecciona, quita el id
            return prevPosts.filter((pid) => pid !== id);
          }
        });
      }

      return arr;
    });
  };
  const handleSelectAll = (e: React.MouseEvent<HTMLElement>) => {
    let state = false;
    state = e.currentTarget.classList.toggle("fa-solid");

    if (state)
      posts.map((post, index) => {
        handleSelect(index, post._id, true);
      });
    else
      posts.map((post, index) => {
        handleSelect(index, post._id);
      });
  };

  const handleDeletePosts = async () => {
    try {
      // Simulate deletion logic or API call
      setMessage("Posts deleted successfully!");
      setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
    } catch (error) {
      setMessage("Failed to delete posts.");
      setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
    }
  };

  return (
    <Card shadow={true} className="h-full w-full overflow-scroll"  placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
      {message && (
        <Alert
          className=" bg-green-400 relative h-8 rounded-none  "
          color="green"
        >
          {message}
        </Alert>
      )}
      {visible && (
        <Typography
          variant="h6"
          color="blue-gray"
          className="p-4 text-right"
          placeholder="Text"  onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        >
          {postsToDelete.length} Posts to delete
          <Button
            size="sm"
            className="btn-class"
            onClick={handleDeletePosts}
            placeholder="Button content"  onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}          >
            Delete
          </Button>
        </Typography>
      )}
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th
                key={head}
                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"  placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
                  {head}
                </Typography>
              </th>
            ))}
            {visible && (
              <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className=" flex justify-between items-center font-normal leading-none opacity-70"  placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
                  <span>{"Select All"}</span>{" "}
                  <i
                    style={{ display: visible ? "inline" : "none" }}
                    className={"  fa-regular  fa-square-check text-2xl"}
                    onClick={handleSelectAll}
                  ></i>
                </Typography>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {posts?.map((post: IPost, index) => {
            const classes = "p-4 border-b border-blue-gray-50";
            return (
              <tr key={post.title}>
                <td className={classes}>
                  <Link
                    to={`/post/${post._id}`}
                    className="flex items-center gap-3"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"  placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                    >
                      <img
                        src={post.image || ""}
                        alt={post.title}
                        className="inline-block w-6 h-6 mr-2"
                      />
                      <span>{post.title}</span>
                    </Typography>
                  </Link>
                </td>
                <td className={`${classes} bg-blue-gray-50/50`}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"  placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                  >
                    {post.category}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"  placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                  >
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : "N/A"}
                  </Typography>
                </td>
                <td className={`${classes} bg-blue-gray-50/50`}>
                  <Typography
                    as="span"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"  placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                  >
                    <ListItems
                      id={post._id}
                      handleselect={() => handleShowSelect(index, post._id)}
                    />
                  </Typography>
                </td>
                <td className={`${classes} bg-blue-gray-50/50`}>
                  <Typography
                    as="span"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"  placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                  >
                    <i
                      style={{ display: visible ? "inline" : "none" }}
                      className={
                        checked[index]
                          ? "fa-solid fa-square-check text-2xl"
                          : "fa-regular fa-square text-2xl"
                      }
                      onClick={() => handleSelect(index, post._id)}
                    ></i>{" "}
                  </Typography>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

