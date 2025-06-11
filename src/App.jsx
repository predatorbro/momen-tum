import React, { useEffect, useState } from "react";
import ExerciseCard from "./components/ExerciseCard";
import NavBar from "./components/Nav";
import Notification from "./components/Notification";
import CreateNewCard from "./CreateNewCard";
import DocsService from "./appwrite/handleDocs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import getDate from "./components/getDate";
import { Outlet } from "react-router-dom";
import authService from "./appwrite/authentication";
import "./index.css";

import DarkModeToggle from "./components/DarkModeToggle";
function App() {
  // darkmode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    document.documentElement.classList.add(
      "transition-colors",
      "duration-300",
      "ease-in-out"
    );

    if (isDarkMode) {
      document.querySelector("html").classList.add("dark");
    } else {
      document.querySelector("html").classList.remove("dark");
    }

    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);
  // darkmode ends here
  const today = getDate().day;
  const dayArray = getDate().dayArray;

  // const date = getDate().date;
  // console.log(date)

  const { page } = useParams();
  const currentPage = page || today;
  const location = useLocation();
  const currentLocation = location.pathname.split("/").pop();
  const [message, setMessage] = useState([]);
  const [active, setActive] = useState(false); //create new btn status
  const [login, setLogin] = useState(false);
  const [showNotificationBar, setshowNotificationBar] = useState(false);
  const [exercisesList, setExercisesList] = useState([]);
  const [updatePage, setupdatePage] = useState(false);
  const [filteredExercises, setfilteredExercises] = useState([]);
  const navigate = useNavigate();

  // inorder to add new msg
  // const msg = [...message,"New message"]
  // setMessage(msg)
  // setshowNotificationBar(true)

  function getData(id) {
    console.log("User : ", id);
    DocsService.getDocs(id).then((data) => {
      setExercisesList(data);
      console.log("Docs : ", data);
    });
  }
  useEffect(() => {
    // Fetch user authentication status
    authService.getCurrentUser().then((resp) => {
      setLogin(resp);
      if (!resp) {
        navigate("/login");
      }
    });
  }, []); // Runs only on mount

  useEffect(() => {
    if (login?.$id) {
      getData(login.$id);
    }
  }, [updatePage, login]);

  useEffect(() => {
    if (Array.isArray(exercisesList?.documents)) {
      const xercises = exercisesList.documents.filter(
        (exe) => exe.day === currentPage
      );
      setfilteredExercises(xercises);
    } else {
      setfilteredExercises([]); // Ensure it's always an array
    }
  }, [currentPage, exercisesList]);

  return (
    <div className="min-h-screen  overflow-hidden pb-8">
      <NavBar
        setshowNotificationBar={setshowNotificationBar}
        setActive={setActive}
        login={login}
      ></NavBar>
      <Outlet context={{ login, setLogin, updatePage, setupdatePage }} />

      {login && currentLocation != "history" && (
        <main className="px-8 space-y-12">
          {/* Today's Exercises */}

          <section>
            <h2 className="sm:text-2xl text-xl font-bold mb-6 font-[Montserrat] text-gray-600 dark:text-gray-200">
              {`${
                dayArray.find((day) => day.slice(0, 3).toLowerCase() === page)
                  ? `Exercises for ${dayArray.find(
                      (day) => day.slice(0, 3).toLowerCase() === page
                    )}`
                  : "Today's Exercises"
              }`}
            </h2>
            <div
              id="exerciseList"
              className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 h-full "
            >
              {Array.isArray(filteredExercises) &&
                filteredExercises.map((exe, index) => {
                  if (exe.day == currentPage) {
                    return (
                      <ExerciseCard
                        today={today}
                        currentPage={currentPage}
                        data={JSON.parse(exe.exercise)}
                        key={index}
                        exerciseID={exe.$id}
                        imageUrl={exe.imageUrl} 
                        setMessage={setMessage}
                        message={message}
                      />
                    );
                  }
                })}
              <CreateNewCard
                userid={login.$id}
                currentPage={currentPage}
                setupdatePage={setupdatePage}
                updatePage={updatePage}
                active={active}
                setActive={setActive}
                setMessage={setMessage}
                message={message}
                setshowNotificationBar={setshowNotificationBar}
              />
              {filteredExercises.length == 0 && (
                <div className="col-span-2    flex font-semibold justify-center items-center">
                  <p className="lg:text-4xl text-2xl  font-[Montserrat] text-gray-100">
                    No exercises to show!
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
      )}

      {/* Notification Sidebar */}
      <Notification
        message={message}
        show={showNotificationBar}
        setshowNotificationBar={setshowNotificationBar}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      ></Notification>
    </div>
  );
}

export default App;
