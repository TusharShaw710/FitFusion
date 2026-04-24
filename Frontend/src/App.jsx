
import './App.css'
import { RouterProvider } from 'react-router'
import { router } from './app.routes'
import { useEffect } from 'react'
import { useAuth } from './features/auth/hook/useAuth'
import ToastContainer from './features/ui/toast/ToastContainer.jsx'


function App() {
  const {handleGetMe}=useAuth();

  useEffect(() => {
    handleGetMe();
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  )
}

export default App
