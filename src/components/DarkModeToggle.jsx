import { motion } from "framer-motion";

export default function DarkModeToggle({ isDarkMode, setIsDarkMode }) {
  return (
    <div className="flex items-center  scale-70 md:scale-85">
      <div
        className="w-14 h-7 flex items-center dark:bg-gray-100 bg-gray-700 rounded-full p-1 cursor-pointer relative shadow-lg"
        onClick={() => setIsDarkMode((prev) => !prev)}
      >
        <motion.div
          className="w-6 h-6 bg-white dark:bg-gray-700 rounded-full shadow-md"
          layout
          initial={{ x: isDarkMode ? 28 : 0 }}
          animate={{ x: isDarkMode ? 28 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      </div>
    </div>
  );
}
