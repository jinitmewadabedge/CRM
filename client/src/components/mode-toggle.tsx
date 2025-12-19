import { useTheme } from "../components/themeProvider";
import { FaSun, FaMoon } from "react-icons/fa";
// import { Tooltip, Popover } from "bootstrap";

export function ModeToggle({ variant = "icon" }) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (variant === "icon") {

    return (
      <button className="theme-toggle-btn px-2 py-2" onClick={toggleTheme}>
        {/* <div className="toggle-content"> */}
        {theme === "dark" ? (
          <FaMoon size={25} />
        ) : (
          <FaSun size={25} />
        )}

        {/* </div> */}
      </button>
    );
  }

  if (variant === "button") {

    return (
      <button className="theme-toggle-btn px-4 py-2 d-flex align-items-center justify-content-center gap-2" onClick={toggleTheme}>
        {theme === "dark" ? (
          <>
            <h6 className="m-0">Dark Mode</h6>
            <FaMoon size={18} />
          </>
        ) : (
          <>
            <h6 className="m-0" style={{color: "#4925E9"}}>Light Mode</h6>
            <FaSun size={18} color="#4925E9" />
          </>
        )}
      </button>
    )
  }

  //   <label className="toggle-with-text">
  //     <input type="checkbox" checked={theme === "dark"} onChange={toggleTheme} />
  //     <span className="toggle-track">
  //       <span className="toggle-text">
  //         {theme === "dark" ? "Dark" : "Light"}
  //       </span>
  //     </span>
  //   </label>
  // );

  // return (
  //   <div className="d-flex align-items-center gap-2">
  //     <label className="theme-switch">
  //       <input
  //         type="checkbox"
  //         checked={theme === "dark"}
  //         onChange={toggleTheme}
  //       />
  //       <span className="slider"></span>
  //     </label>

  //     <span className="theme-label">
  //       {theme === "dark" ? "Dark Mode" : "Light Mode"}
  //     </span>
  //   </div>
  // );

  // return (
  //   <button
  //     onClick={toggleTheme}
  //     style={{
  //       padding: "8px 12px",
  //       borderRadius: "8px",
  //       border: "1px solid #ccc",
  //       background: "white",
  //       cursor: "pointer",
  //     }}
  //     className="btn btn-sm"
  //   >
  //     {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
  //   </button>
  // );
}
