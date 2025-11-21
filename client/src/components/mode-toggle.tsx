import { useTheme } from "../components/themeProvider";
import { FaSun, FaMoon } from "react-icons/fa";
import { Tooltip, Popover } from "bootstrap";
import { useEffect } from "react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    const btn = document.getElementById("darkModeBtn");
    if (btn) {
      new Popover(btn);
    }
  }, []);

  return (
    <button className="theme-toggle-btn" onClick={toggleTheme} data-bs-toggle="popover" data-bs-placement="left" title="Hello, Dark Mode">
      <div className="toggle-content">
        {theme === "dark" ? (
          <>
            <FaMoon size={15} />
            <span>Dark</span>
          </>
        ) : (
          <>
            <FaSun size={15} />
            <span>Light</span>
          </>
        )}

        <div className={`switch ${theme === "dark" ? "dark" : "light"}`}>
          <div className="circle"></div>
        </div>
      </div>
    </button>
  );

  // return (
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
