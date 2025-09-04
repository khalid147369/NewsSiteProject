import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
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
}) {
  const { user } = useUser();
  const { categories, currentCategory } = usePostsContext();
  const handleremove = () => {
    try {
      removePostById(id, user.data.accessToken ?? "");

      currentCategory === "all"
        ? categories[currentCategory].fetch(
            categories[currentCategory].data.page,
            categories.all.data.direction
          )
        : categories[currentCategory].fetch(
            currentCategory,
            categories[currentCategory].data.page,
            categories.all.data.direction
          );
    } catch (error) {
      console.error("Error removing post:", error);
    }
  };
  return (
    <Menu>
      <MenuHandler>
        <Button className="text-black" type="button"  placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </Button>
      </MenuHandler>
      <MenuList  placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <MenuItem className="hover:underline" onClick={handleselect}  placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          select <i className="fa-solid fa-hand-pointer"></i>
        </MenuItem>
        <hr className="border-b border-gray-200 my-2" />
        <MenuItem onClick={handleremove} className="hover:underline"  placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          remove <i className="fa-solid fa-trash"></i>
        </MenuItem>
        <hr className="border-b border-gray-200 my-2" />
        <MenuItem className="hover:underline"  placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          edit <i className="fa-solid fa-pen-to-square"></i>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
