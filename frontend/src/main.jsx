import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import Home from './pages/Home.jsx'
import Login from './pages/Auth/Login.jsx'
import Register from './pages/Auth/Register.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <App><Login /></App>,
  },
  {
    path: "/register",
    element: <App><Register /></App>,
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App>
      <RouterProvider router={router} />
    </App>
  </StrictMode>,
)
