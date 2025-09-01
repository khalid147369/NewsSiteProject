import React, { use, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPostById } from '../../api/posts'; // Adjust the import path as necessary
import { type IPost  } from '../../utils/types';
import {usePostsContext  } from '../../context/PostsContext'; // Adjust the import path as necessary
import { Link } from 'react-router-dom';
import SinglePostDetails from '../../components/singlePostDetails/singlePostDetails';

const PostDetails = () => {
    const {id } = useParams(); // Assuming you're using useParams to get the post ID from the URL


    const { setPost ,post } = usePostsContext(); // Assuming you have a context to manage posts
useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const postDetails : IPost = await getPostById(id? id : "no id provided");
                setPost(postDetails); // Assuming setPost is a function to update the post in context

                // Here you can set the post details in state or context if needed
            } catch (error) {
                console.error("Error fetching post details:", error);
            }
        }
        fetchPostDetails();
    }, [id]); // Dependency array includes id to refetch if it changes

 

  return (
   <SinglePostDetails post={ post && post } /> // Assuming SinglePostDetails accepts a post prop
  );
}


export default PostDetails;
