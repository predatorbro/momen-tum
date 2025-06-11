import React, { useEffect, useState } from "react";
import DocsService from "../appwrite/handleDocs";
import { nanoid } from "nanoid";

function ExerciseCard({
  data,
  exerciseID,
  imageUrl,
  currentPage,
  today,
  disable,
  setMessage,
  message,
}) {
  const [exercise, setExercise] = useState(data);
  const [hidden, setHidden] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateTimeout, setUpdateTimeout] = useState(null);
  // Reset checkboxes and update DB when viewing a past day
  useEffect(() => {
    if (currentPage !== today) {
      // If not today, reset checkboxes
      const resetExercise = {
        ...exercise,
        exerciseStatus: exercise.exerciseStatus.map(() => false),
      };
      setExercise(resetExercise);

      // Send API call to update DB
      DocsService.editDoc({ data: resetExercise, exerciseID })
        .then((resp) => console.log("Updated past day's exercises:", resp))
        .catch((err) =>
          console.error("Error updating past day's exercises:", err)
        );
    }
  }, [currentPage, today]);

  // Store history when all checkboxes are checked
  useEffect(() => {
    if (!disable && currentPage == today) {
      if (exercise.exerciseStatus.every((value) => value === true)) {
        DocsService.setHistory({ exercise, imageUrl, exerciseID });
      }
    }
  }, [exercise]);
  // Update exercise on the server after user stops typing or interacting
  useEffect(() => {
    if (isUpdating) {
      if (updateTimeout) clearTimeout(updateTimeout); // Clear previous timeout if any

      const timeout = setTimeout(() => {
        DocsService.editDoc({ data: exercise, exerciseID: exerciseID }).then(
          (resp) => console.log(resp)
        );
        setIsUpdating(false);
      }, 1000);

      setUpdateTimeout(timeout);
    }
  }, [exercise]);
  const updateExercise = () => {
    DocsService.editDoc({ data: exercise, exerciseID }).then((resp) =>
      console.log(resp.exercise)
    );
  };
  const deleteExe = () => {
    const confirm = window.confirm(
      `Do you want to delete ${exercise.exerciseName} ?`
    );
    if (confirm) {
      DocsService.deleteDoc(exerciseID);
      setHidden(true);
    }
  };
  return (
    <div
      className={`" bg-gray-50 shadow-xl rounded-lg hover:transform-[scale(1.05)] transition-transform dark:bg-(--panelDark) overflow-hidden font-[Montserrat] spacing" ${
        hidden && "hidden"
      }`}
    >
      <div className="group">
        <img
          src={`${
            imageUrl
              ? DocsService.getImagePreview(imageUrl)
              : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
          }`}
          alt="Exercise"
          className="w-full h-56 object-cover"
        />
        <i
          className="absolute right-2 top-2 opacity-0 -translate-x-3 text-red-500 fa-solid fa-trash-can 
                transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:translate-x-0 cursor-pointer"
          onClick={deleteExe}
        ></i>
      </div>
      <ExerciseDetails
        currentPage={currentPage}
        today={today}
        exercise={exercise}
        setExercise={setExercise}
        disable={disable}
        updateExercise={updateExercise}
        setIsUpdating={setIsUpdating}
      />
    </div>
  );
}

function ExerciseDetails({
  exercise,
  setExercise,
  currentPage,
  today,
  disable,
  updateExercise,
  setIsUpdating,
}) {
  const exerciseName = exercise.exerciseName;
  const exerciseSets = exercise.exerciseSets;
  const exerciseStatus = exercise.exerciseStatus;
  return (
    <div className="p-6">
      <div className=" mb-3  text-gray-600 dark:text-gray-100">
        <input
          disabled={disable}
          type="text"
          className="text-lg font-semibold outline-none"
          id={nanoid()}
          value={exerciseName}
          onChange={(e) => {
            setExercise({
              ...exercise,
              exerciseName: e.target.value,
            });
            setIsUpdating(true);
          }}
        />
        <div className="h-[1px] w-full bg-gray-300"></div>
      </div>

      {/* list  */}
      {exerciseSets.map((sets, index) => {
        return (
          sets && (
            <div
              className="  flex items-center justify-between text-gray-600 dark:text-gray-200 font-medium space-x-2"
              key={index}
            >
              <span className="group flex gap-x-2 items-center relative flex-1">
                <i
                  className="absolute left-0 opacity-0 -translate-x-3 text-red-500 fa-solid fa-trash-can 
                transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:translate-x-0  cursor-pointer"
                  onClick={() => {
                    const tempObj = { ...exercise };
                    tempObj.exerciseSets[index] = "";
                    setExercise(tempObj);
                    updateExercise();
                  }}
                ></i>
                <input
                  type="text"
                  disabled={disable}
                  className="text-sm sm:text-lg w-full outline-none group-hover:translate-x-4 transition-all duration-300 ease-in-out"
                  value={sets}
                  id={nanoid()}
                  onChange={(e) => {
                    const temp = [...exerciseSets]; // Copy exerciseSets array
                    temp[index] = e.target.value; // Update specific set
                    setExercise({
                      ...exercise, // Spread the current exercise object
                      exerciseSets: temp, // Replace with updated sets
                    });
                    setIsUpdating(true);
                  }}
                />
              </span>

              <input
                type="checkbox"
                id={nanoid()}
                disabled={currentPage != today || disable}
                className="sm:w-6 sm:h-6 w-4 h-4 accent-blue-500"
                checked={currentPage == today ? exerciseStatus[index] : false}
                onChange={(e) => {
                  const temp = [...exerciseStatus];
                  temp[index] = !temp[index];
                  setExercise({ ...exercise, exerciseStatus: temp });
                  setIsUpdating(true);
                }}
              />
            </div>
          )
        );
      })}
    </div>
  );
}
export default ExerciseCard;
