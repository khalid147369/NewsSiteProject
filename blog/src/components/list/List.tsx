import {
  MenuItem,
  Menu,
  MenuHandler,
  Button,
  MenuList,
} from "@material-tailwind/react";
import { removePostById } from "../../api/posts";
import { usePostsContext } from "../../context/PanelContext";
import { useUser } from "../../context/UserContext";
export function ListItems({
  id,
  handleselect,
   
}: {
  id: string;
  handleselect: () => void;
  category : string;
}) {
  const {user} = useUser()
  const { categories ,currentCategory  } = usePostsContext();
  const handleremove =  () => {
    try {
       removePostById(id,user.data.accessToken??"");

    currentCategory==='all'?
    categories[currentCategory].fetch(categories[currentCategory].data.page,categories.all.data.direction)
    :categories[currentCategory].fetch(currentCategory,categories[currentCategory].data.page,categories.all.data.direction)

    } catch (error) {
      console.error("Error removing post:", error);
    }
  };
  return (
    <Menu>
      <MenuHandler>
        <Button className=" text-black">
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </Button>
      </MenuHandler>
      <MenuList>
        <MenuItem className=" hover:underline" onClick={handleselect}>
          select <i className="fa-solid fa-hand-pointer"></i>
        </MenuItem>
        <hr className="border-b border-gray-200 my-2" />
        <MenuItem onClick={handleremove} className=" hover:underline">
          remove <i className="fa-solid fa-trash"></i>
        </MenuItem>
        <hr className="border-b border-gray-200 my-2" />
        <MenuItem className=" hover:underline">
          edit <i className="fa-solid fa-pen-to-square"></i>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
