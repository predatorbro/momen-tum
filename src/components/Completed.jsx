import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DocsService from "../appwrite/handleDocs";
import { nanoid } from "nanoid";
import { p } from "framer-motion/client";
import ExerciseCard from "./ExerciseCard";

function Completed() {
  const [history, sethistory] = useState([]);
  useEffect(() => {
    DocsService.getHistory("679cd20c00243a49749d").then((resp) => {
      resp.documents.map((elem) => {
        sethistory((prev) => [...prev, elem]);
      });
    });
  }, []);

  //   console.log(history);
  return (
    <>
      <div className="px-8 space-y-12  h-fit">
        <h2 className="sm:text-2xl text-center text-xl font-bold mb-6 font-[Montserrat] text-gray-600 dark:text-gray-200">
          Exercise history
        </h2>
        {/* return one section  */}
        {[...history].reverse().map((node) => {
          const completed = JSON.parse(node.completedExercises) || [];
          //   console.log(completed);
          return (
            <div className="flex flex-col w-full h-fit" key={nanoid()}>
              <h2 className=" text-base font-semibold mb-6 font-[Montserrat] text-gray-600 dark:text-gray-200">
                {JSON.parse(node.date)}
              </h2>
              <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 h-full ">
                {completed.map((elem, index) => (
                  <ExerciseCard
                    data={elem}
                    key={index}
                    disable={true}
                    imageUrl={elem.imageUrl}
                    exerciseID={elem.exerciseID}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Completed;
