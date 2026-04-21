
import './App.css'
import { RouterProvider } from 'react-router'
import { router } from './app.routes'
import { useEffect } from 'react'
import { useAuth } from './features/auth/hook/useAuth'
import { useDispatch } from 'react-redux'
import { setUser } from './features/auth/auth.slice'


function App() {
  const {handleGetMe}=useAuth();

  useEffect(() => {
    handleGetMe();
  }, []);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
