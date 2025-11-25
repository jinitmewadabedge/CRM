import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.css'
import App from './App.jsx'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThemeProvider } from './components/themeProvider.js';


createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
    <App />
  </ThemeProvider>
  /* </StrictMode> */
)