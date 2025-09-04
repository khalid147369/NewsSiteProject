// import React from 'react';
import "./Header.css"; // Assuming you have a CSS file for styles
import Avatar from "../../components/avatar/Avatar";
import { useUser } from "../../context/UserContext";
import Nav from "../../components/nav/Nav";
import Container from "../../components/container/container";
import { Search } from "../../components/search/Search";

const Header = () => {
  const { user } = useUser();
  return (
    <section>
      <header className="  w-full header bg-gray-800 text-white ">
        <Container>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold ">Blog</div>
            <Search/>
               <Avatar />
          </div>
        </Container>
      </header>
      <Nav isAdmin={user?.isAdmin??false} />
    </section>
  );
};

export default Header;
