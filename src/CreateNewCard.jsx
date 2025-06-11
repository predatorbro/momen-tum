import React, { useState } from "react";
import { useForm } from "react-hook-form";
import DocsService from "./appwrite/handleDocs";

function CreateNewCard({
  currentPage,
  updatePage,
  setupdatePage,
  active,
  setActive,
  userid,
  setMessage,
  message,
  setshowNotificationBar,
}) {
  const { register, handleSubmit, watch, setValue } = useForm();

  const quickWords = ["1", "2", "3", "5", "10", "15", "20", "X", "reps"];

  const [previewImage, setPreviewImage] = useState(null);
  const watchFile = watch("exerciseImage");

  const label = watch("exerciseLabel") || "";
  function format(data) {
    return JSON.stringify(
      {
        exerciseName: data.exerciseName,
        exerciseSets: Array(Number(data.exerciseSets)).fill(data.exerciseLabel), // Creates an array of `label` repeated `sets` times
        exerciseStatus: Array(Number(data.exerciseSets)).fill(false), // Creates an array of `label` repeated `sets` times
      },
      null,
      2
    );
  }
  const onSubmit = (data) => {
    const formattedData = format(data);
    const image = data.exerciseImage[0];
    DocsService.createDoc(formattedData, image, currentPage, userid).then(
      (resp) => {
        const msg = [
          ...message,
          `${JSON.parse(resp.exercise).exerciseName} sets created!`,
        ];
        setMessage(msg);
        setshowNotificationBar(true);
        if (resp) {
          setupdatePage((prev) => !prev);
          setValue("exerciseName", "");
          setValue("exerciseLabel", "");
          setValue("exerciseSets", "");
          setValue("exerciseImage", "");
          setPreviewImage("");
          setActive(false);
        }
      }
    );
  };
  //

  // Watch the file input to trigger preview

  const handleImagePreview = () => {
    if (watchFile && watchFile[0]) {
      const file = watchFile[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result); // Set the preview image
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger preview when the file changes
  React.useEffect(() => {
    handleImagePreview();
  }, [watchFile]);
  return (
    <div
      className={`rounded-2xl font-[Montserrat] w-full h-full ${
        active
          ? "shadow-lg bg-gray-50 sm:col-span-2 xl:col-span-2  md:col-span-3"
          : "flex justify-center items-center"
      }`}
    >
      {!active && (
        <div
          onClick={() => setActive(true)}
          className=" dark:border-gray-100 text-gray-600 dark:text-gray-100 hover:scale-105 dark:bg-(--panelDark) transition-transform rounded-lg flex flex-col gap-2 justify-center items-center border-[3px] cursor-pointer border-gray-600 aspect-square shadow-lg w-40 bg-gray-50 relative"
        >
          <i className="fa-regular fa-plus  text-4xl"></i>
          <p className="absolute bottom-2 text-sm ">Add new exercise!</p>
        </div>
      )}

      {active && (
        <div className="p-6 w-full h-full dark:bg-(--panelDark) rounded-xl">
          <div>
            <div className="flex justify-between dark:text-gray-100 text-gray-600 ">
              <p className="text-xl font-medium">Add new exercise!</p>
              <i
                className="fa-solid fa-xmark mr-4 cursor-pointer text-2xl  hover:scale-110 transition-transform"
                onClick={() => setActive((prev) => !prev)}
              ></i>
            </div>
            <div className="h-[1px] w-full bg-black my-1 dark:bg-gray-200 "></div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col sm:flex-row gap-x-6 pt-3"
          >
            {/* Left Section */}
            <div className="flex-[1] flex flex-col gap-2 dark:text-gray-100">
              <div>
                <label htmlFor="exercisename">Exercise Name:</label>
                <input
                  type="text"
                  autoComplete="off"
                  id="exercisename"
                  className="border outline-none px-3 rounded w-full sm:max-w-md p-2"
                  {...register("exerciseName")}
                  required
                />
              </div>

              <div>
                <label htmlFor="exercisesets">Sets:</label>
                <input
                  type="number"
                  autoComplete="off"
                  min={1}
                  id="exercisesets"
                  className="border outline-none p-2 rounded w-full sm:max-w-md"
                  {...register("exerciseSets")}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="exerciselabel">Label:</label>
                <input
                  type="text"
                  autoComplete="off"
                  id="exerciselabel"
                  className="border outline-none w-full sm:max-w-md p-2 px-3 rounded"
                  {...register("exerciseLabel")}
                  required
                />

                <div className="flex flex-wrap items-center gap-2 text-xs bg-gray-200  dark:bg-gray-800 w-fit p-2 rounded-lg">
                  <p>Type Quickly!</p>
                  {quickWords.map((elem, index) => (
                    <div
                      key={index}
                      onClick={() =>
                        setValue("exerciseLabel", label + " " + elem)
                      }
                      className=" dark:bg-gray-700 bg-gray-300 hover:opacity-60 hover:scale-105 transition-transform rounded-lg py-1 px-2 cursor-pointer"
                    >
                      {elem}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex-[1] flex flex-col items-center sm:items-start dark:text-gray-100">
              <div className="w-full sm:max-w-md">
                <label htmlFor="image">Upload Image:</label>
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="h-40 w-full object-cover rounded-lg mt-3"
                  />
                )}
                <input
                  type="file"
                  className=" dark:bg-gray-800  bg-gray-200 w-full p-2 mt-2 rounded"
                  {...register("exerciseImage")}
                />
              </div>
              <button
                type="submit"
                className="w-full sm:max-w-md bg-gray-600  dark:bg-(--accent) text-gray-100 text-lg p-2 rounded mt-3 hover:scale-95 transition-transform"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default CreateNewCard;
