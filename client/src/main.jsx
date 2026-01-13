import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThemeProvider } from './components/themeProvider.js';
import { BrowserRouter } from 'react-router-dom';


createRoot(document.getElementById('root')).render(
  // <StrictMode>
  // <BrowserRouter>
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <App />
    </ThemeProvider>
  // {/* </BrowserRouter> */}
  /* </StrictMode> */
)