import { Card, Typography } from "@material-tailwind/react";
import { useEffect } from "react";
import { usePostsContext } from "../../context/PanelContext";
import { useUser } from "../../context/UserContext";

const UsersTable = () => {
  const { user } = useUser();
  const { users } = usePostsContext();
  const usersData = users?.data?.users;
  const TABLE_HEAD = ["id", "username", "email", "role"];
  type User = {
    username: string;
    _id: string;
    email: string;
    roles: "user" | "admin";
  };

  useEffect(() => {
    users.fetch(user.data.accessToken ?? "");
  }, []);

  return (
    <Card
      shadow={false}
      className="relative w-full z-0 h-full xl:w-[65%]"
      placeholder="Card content"  onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}    >
      <table className="w-full min-w-max table-auto text-left  ">
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
          </tr>
        </thead>
        <tbody>
          {usersData?.map((user: User) => {
            const classes = "p-4 border-b border-blue-gray-50";
            return (
              <tr key={user.username}>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"  placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                  >
                    {user._id}
                  </Typography>
                </td>
                <td className={`${classes} bg-blue-gray-50/50`}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"  placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                  >
                    {user.username}
                  </Typography>
                </td>

                <td className={`${classes} bg-blue-gray-50/50`}>
                  <Typography
                    as="span"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"  placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                  >
                    {user.email}
                  </Typography>
                </td>
                <td className={`${classes} bg-blue-gray-50/50`}>
                  <Typography
                    as="span"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"  placeholder={undefined} onResize={undefined} onResizeCapture={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                  >
                    {user.roles}
                  </Typography>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
};

export default UsersTable;
