
import { type IPost  } from '../../utils/types';

import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
const SinglePostDetails = ({post}:{post:IPost }) => {
    return (
         <Card className="w-full  flex-row h-[calc(100vh-50px)]">
      <CardHeader
        shadow={false}
        floated={false}
        className="m-0 w-1/2 shrink-0 rounded-r-none"
        placeholder={undefined}
        onResize={undefined}
        onResizeCapture={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <img
          src={post?.image&& post?.image } // Fallback image URL
          alt={post?.title&&post?.title || "Post Image"} // Fallback alt text
          className="h-full w-full object-cover"
        />
      </CardHeader>
      <CardBody className=' relative  w-full  '>
      <section className="flex flex-col gap-10 m-8 absolute transform top-1/2 translate-y-[-50%] text-center">
        <Typography variant="h1" color="gray" className="mb-4 uppercase ">
          {post?.title || "Post Title"} {/* Fallback title */}
        </Typography>
        <Typography variant="h4" color="blue-gray" className="mb-2">
          {post?.description || "Post Description "} {/* Fallback author */}
        </Typography>
        <Typography color="gray" className="mb-8 font-normal">
         {post?.content || "Post Content "} {/* Fallback description */}
        </Typography>
        <a target='blanc' href={post?.source?.url} className="inline-block">
          <Button variant="text" className="flex items-center gap-2">
            Learn More
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </Button>
        </a></section>
      </CardBody>
    </Card>
    );
}

export default SinglePostDetails;
