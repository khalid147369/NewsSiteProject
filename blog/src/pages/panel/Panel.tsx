import React, { useContext, useRef, useState } from "react";
import { PostTable } from "../../components/postsTable/PostsTable";
import { getPosts, getAreaPosts } from "../../api/posts";
// import { usePost } from "../../context/PostsContext";
import { usePostsContext } from "../../context/PanelContext";
import { type IPost } from "../../utils/types";
import { Button, ButtonGroup } from "@material-tailwind/react";
import "./panel.css"; // Import your CSS file for styling
import { PanelPagination } from "../../components/panelPagination/panelPagination";
import Graph from "../../components/Graph/Graph";
import { TableCellsIcon } from "@heroicons/react/24/outline";
import UsersTable from "../../components/usersTable/usersTable";
import Container from "../../components/container/container";
const Panel = () => {
  // Replace local posts state with context
  const { categories, setCurrentCategory } = usePostsContext();

  const all = categories.all;
  const sports = categories.sports.data;
  const world = categories.world.data;
  const politics = categories.politics.data;
  const technology = categories.technology.data;
  const [isListShowed, setIsListShowed] = useState(false);

  const [posts, setPosts] = useState<IPost[]>(all.data.posts);
  const [pages, setPages] = useState({
    sports: sports.page,
    world: world.page,
    politics: politics.page,
    all: all.data.page,
    technology: technology.page,
  });
  type PageKey = "all" | "sports" | "world" | "politics";
  const [options, setOptions] = useState<{
    sort: "newest" | "oldest";
    filter: PageKey;
  }>({ sort: "newest", filter: "all" });
  const btnGrpRef = useRef(null);
  const totalPosts = categories.all.data.total;
  const totalPagesByCategory = {
    sports: sports.totalPages || 0,
    world: world.totalPages || 0,
    politics: politics.totalPages || 0,
    technology: technology.totalPages || 0,
    all: all.data.totalPages || 0,
  };
  //   get data by category
  React.useEffect(() => {
    setCurrentCategory(options.filter);
    if (categories) {
      if (options.filter !== "all") {
        categories[options.filter].fetch(
          options.filter,
          pages[options.filter],
          options.sort === "newest" ? -1 : 1
        );
      } else {
        all.fetch(1, options.sort === "newest" ? -1 : 1);
      }
    }
  }, [options.filter, options.sort]);

  React.useEffect(() => {
    const newPosts = categories[options.filter]?.data?.posts || [];
    setPosts(newPosts);
    setPages({
      sports: categories.sports.data.page,
      all: categories.all.data.page,
      world: categories.world.data.page,
      politics: categories.politics.data.page,
      technology: categories.technology.data.page,
    });
  }, [categories, options.filter]);
  const fetchPosts = async () => {
    try {
      await all.fetch(1, options.sort === "newest" ? -1 : 1);

    } catch (error) {
      console.error("Error fetching posts:", error);
      // Try to fetch area posts as a fallback
      if (options.filter !== "all")
        categories[options.filter].fetch(
          options.filter,
          pages[options.filter],
          options.sort === "newest" ? -1 : 1
        );
    }
  };

  // Fetch posts when the component mounts
  React.useEffect(() => {
    fetchPosts();
  }, []);

  //   switch categories
  const handleclick = (el) => {
    // You can add more functionality here
    if (!el?.currentTarget) return;
    if (!btnGrpRef.current) return;
    const buttons = btnGrpRef.current.children;
    Array.from(buttons).forEach((child, i) => {
      child.classList.remove("active");
    });

    el.currentTarget.classList = el.currentTarget?.classList + " active";
    if (options.filter !== "all")
      categories[options.filter].fetch(
        el?.currentTarget?.textContent,
        1,
        options.sort === "newest" ? -1 : 1
      );

    setOptions((prev) => ({ ...prev, filter: el?.currentTarget?.textContent }));
  };

  //   move to next or prev posts
  const handleChangePage = async (sort: number, direction: number) => {
    if (options.filter === "all") {
      all.fetch(pages.all + direction, sort);
    } else {
      categories[options.filter].fetch(
        options.filter,
        pages[options.filter as keyof typeof pages] + direction,
        sort
      );
    }
  };
  const filters = ["all", "sports", "world", "politics", "technology"];

  //   select get and  posts from newest or oldest
  const handleselect = (e) => {
    const sortFunction = e.target.value === "newest";
    if (!sortFunction) {
      if (options.filter === "all") {
        all.fetch(1, 1);
        setOptions((prev) => ({ ...prev, sort: e.target.value }));
      } else {
        categories[options.filter].fetch(options.filter, 1, 1);

        setOptions((prev) => ({ ...prev, sort: e.target.value }));
      }
    } else {
      if (options.filter === "all") {
        all.fetch(1, -1);
        setOptions((prev) => ({ ...prev, sort: e.target.value }));
      } else {
        categories[options.filter].fetch(options.filter, 1, -1);
        setOptions((prev) => ({ ...prev, sort: e.target.value }));
      }
    }
  };


  //  calculate total posts
  const calculateTotalPosts = () => {
    const coutns = {
      sports: 0,
      world: 0,
      politics: 0,
      technology: 0,
    };

    coutns.sports = Math.floor(
      ((all.data.totalCategory?.sports ?? 0) * 100) / totalPosts
    );
    coutns.world = Math.floor(
      ((all.data.totalCategory?.world ?? 0) * 100) / totalPosts
    );
    coutns.politics = Math.floor(
      ((all.data.totalCategory?.politics ?? 0) * 100) / totalPosts
    );
    coutns.technology = Math.floor(
      ((all.data.totalCategory?.technology ?? 0) * 100) / totalPosts
    );

    return coutns;
  };

  const VerticalGap = () => (
    <section>
      <hr className=" my-[100px]" />
    </section>
  );

  return (
    <Container>
      <div className="">
        <section className="flex flex-col  gap-2 mb-5">
          <div className="flex items-center gap-4 px-4">  
            <label className="font-medium  underline ">Sort by:</label>
            <select
              onChange={handleselect}
              className="font-medium bg-blue-500 my-5 text-white "
            >
              <option value="newest">from the newest</option>
              <option value="oldest">from the oldest</option>
            </select>
          </div>
        </section>
        <section className="flex items-center flex-col xl:flex-row">
          <div className=" w-[35%]  relative  right-10">
            <Graph
              data={[
                {
                  value: calculateTotalPosts().sports,
                  name: `sports (${all.data.totalCategory?.sports} posts)`,
                },
                {
                  value: calculateTotalPosts().politics,
                  name: `politics (${all.data.totalCategory?.politics} politics)`,
                },
                {
                  value: calculateTotalPosts().world,
                  name: `world (${all.data.totalCategory?.world} world)`,
                },
                {
                  value: calculateTotalPosts().technology,
                  name: `technology (${all.data.totalCategory?.technology} technology)`,
                },
              ]}
            />{" "}
          </div>
          <UsersTable />
        </section>

        <VerticalGap />
        <Container>
          <ButtonGroup
            size="med"
            ref={btnGrpRef}
            className="  buttongroup flex gap-5 px-4 my-8"
          >
            <label className="font-medium">Category :</label>

            {filters.map((filter, index) => (
              <Button
                key={index}
                className="px-4 text-black font-medium"
                onClick={(e) => {
                  handleclick(e),
                    setOptions((prev) => ({
                      ...prev,
                      filter: filter as PageKey,
                    }));
                }}
              >
                {filter}
              </Button>
            ))}
          </ButtonGroup>
          <PanelPagination
            onChangePageToNext={() =>
              handleChangePage(options.sort === "newest" ? -1 : 1, 1)
            }
            onChangePageToBack={() =>
              handleChangePage(options.sort === "newest" ? -1 : 1, -1)
            }
            totalPages={totalPagesByCategory[options.filter]}
          />
        </Container>

        <PostTable posts={posts} />
      </div>
    </Container>
  );
};

export default Panel;
