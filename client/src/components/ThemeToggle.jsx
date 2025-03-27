import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";


const ThemeToggle = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
      <button
        className="p-2 text-xl transition-all duration-300 "
        onClick={toggleTheme}
      >
        {theme === "light" ? (
          <FaMoon className="text-gray-200" />
        ) : (
          <FaSun className="text-yellow-200" />
        )}
      </button>
    );
};
export default ThemeToggle;