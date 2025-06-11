import React from "react";
import { Link } from "react-router-dom";
import authService from "../appwrite/authentication";
import { nanoid } from "nanoid";
import DarkModeToggle from "../components/DarkModeToggle"; // Import your Dark Mode Toggle

function Notification({
  show,
  setshowNotificationBar,
  message = [],
  isDarkMode,
  setIsDarkMode,
}) {
  const logoutbtn = () => {
    authService.logout().then(() => {
      localStorage.setItem("exercises", "[]");
      window.location.reload();
    });
  };

  return (
    <aside
      className={`dark:bg-(--panelDark) fixed top-8 right-0 bottom-8 w-80 bg-gray-100 text-gray-900 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between transition-transform duration-300 ease-in-out transform ${
        show ? "translate-x-0" : "translate-x-full"
      } rounded-l-lg border-l border-gray-200 dark:border-gray-500`}
    >
      {/* Top Section with Notifications, Dark Mode Toggle & History Button */}
      <div className="top text-gray-700 dark:text-gray-200">
        <div className="flex justify-between items-center text-xl font-bold pr-3">
          <p className="w-fit">Notifications</p>
          <button
            className="w-fit cursor-pointer dark:hover:text-gray-300 text-2xl hover:text-gray-700 transition-all"
            onClick={() => setshowNotificationBar(false)}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="h-[1px] w-full bg-gray-300 my-3"></div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto space-y-4 mt-4">
        <ul className="space-y-4">
          {message.length > 0 &&
            message.map((msg) => (
              <NotificationBox message={msg} key={nanoid()} />
            ))}
        </ul>
      </div>
      <div className="h-[1px] w-full bg-gray-300 my-3"></div>

      {/* History & Dark Mode Toggle */}
      <div className="flex justify-between items-center">
        <Link
          to="/history"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-all"
        >
          History
        </Link>
        <Link
          to="/"
          className="bg-orange-500 hover:bg-orange-600  text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-all"
        >
          Clear
        </Link>
        <DarkModeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      </div>

      {/* Logout Button */}
      <button
        onClick={logoutbtn}
        className="bg-rose-600 hover:bg-rose-700 border dark:border-gray-500 text-white font-semibold w-full mt-2 rounded-md py-3 px-6 cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center"
      >
        Logout <i className="fa-regular fa-right-from-bracket ml-2"></i>
      </button>
    </aside>
  );
}

export default Notification;

function NotificationBox({ message }) {
  return (
    <li className="p-4 bg-emerald-400 rounded-lg shadow-sm text-gray-100 font-medium transition-all">
      {message}
    </li>
  );
}
