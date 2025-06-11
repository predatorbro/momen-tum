import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom"; // Correct import
import getDate from "./getDate";

function NavBar({ setshowNotificationBar, setActive, login, children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const today = getDate().day;
  const daysOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]; // Array for weekdays

  // Set the dynamic pages array
  const pages = daysOfWeek.map((day) => ({
    page: today === day ? "today" : day, // If today matches, set page as "today", else set it as the day abbreviation
    navigate: today === day ? "/" : `/${day}`,
  }));

  const UserName = ({ classes }) => {
    return (
      <span className={`font-medium capitalize dark:text-gray-200 ${classes}`}>
        {login.name}ㅤ<i className="fa-solid fa-user"></i>
      </span>
    );
  };
  return (
    <header className="sm:p-8 p-6 font-[Montserrat]  ">
      <div className="dark:bg-(--panelDark)  sm:p-6 p-3 px-6 bg-gray-50 text-gray-700 shadow-xl flex justify-between items-center rounded-lg">
        <Link to={"/"}>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold  dark:text-gray-100">
            moMEN-tum <i className="fa-sharp fa-regular fa-fire"></i>
          </h1>
        </Link>
        {/* pages list */}
        {login && (
          <>
            {/* Navigation Links */}
            <ul
              className="lg:flex hidden items-center gap-3 capitalize text-gray-500 dark:text-gray-300 "
              onClick={() => setActive(false)}
            >
              {pages.map((page) => (
                <li key={page.page} className="hover:pb-[6px] transition-all">
                  <NavLink
                    to={page.navigate}
                    className={({ isActive }) =>
                      `cursor-pointer ${
                        isActive
                          ? "text-gray-700 font-bold dark:text-white text-lg"
                          : "font-medium"
                      }`
                    }
                  >
                    {page.page}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* User Info & Notifications */}
            <div className="flex items-center gap-4 text-xs sm:text-base">
              <UserName classes={"hidden sm:block text-xl"} />
              <span
                className="lg:hidden dark:text-gray-100"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <i className="cursor-pointer fa-solid fa-bars-staggered text-xl sm:mr-2 m-0"></i>
              </span>
              <button
                onClick={() => setshowNotificationBar(true)}
                className=" cursor-pointer p-3 bg-gray-700 text-gray-100 dark:text-gray-700 dark:bg-gray-100 rounded-full h-full aspect-square text-lg "
              >
                <i className="fa-sharp fa-solid fa-bell transform translate-y-[-4px]"></i>
              </button>

              {children}
            </div>
          </>
        )}
      </div>
      {menuOpen && login && (
        <ul className="lg:hidden flex flex-col bg-gray-100 p-4 rounded-lg mt-2 capitalize text-gray-700 dark:text-gray-100 shadow-md dark:bg-(--panelDark)">
          {pages.map((page, index) => (
            <li
              key={page.page}
              className={`py-2 rounded ${
                index % 2 == 0 && "bg-gray-200 dark:bg-neutral-800"
              }`}
            >
              <NavLink
                to={page.navigate}
                className={({ isActive }) =>
                  `block w-full text-center ${
                    isActive ? "font-bold" : "font-medium"
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                {page.page}
              </NavLink>
            </li>
          ))}
          <UserName classes={"sm:hidden  text-center mt-3 text-base"} />
        </ul>
      )}
    </header>
  );
}

export default NavBar;
