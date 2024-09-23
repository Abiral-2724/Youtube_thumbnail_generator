import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './components/Home'
import { RouterProvider } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import { ToastContainer } from 'react-toastify'
import ThumbnailsPage  from './components/ThumbnailPage.jsx'
import Explore from './components/Explore.jsx'
import Collection from './components/Collection.jsx'
import Profile from './components/Profile.jsx'
import MyThumbnailsPage from './components/MyThumbnailsPage'
import AccountSettings from './components/AccountSettings'
const appRouter = createBrowserRouter([
  {
    path:'/',
    element:<Home></Home>
  },
  {
    path:'/login',
    element:<Login></Login>
  },
  {
    path:'/signup',
    element:<Register></Register>
  },
  {
    path:"/thumbnails",
    element:<ThumbnailsPage></ThumbnailsPage>

  },{
    path:'/explore',
    element:<Explore></Explore>
  },
  {
    path:'/collection',
    element:<Collection></Collection>
  },{
    path:'/profile',
    element:<Profile></Profile>
  },{
    path:'/mythumbnail' ,
    element:<MyThumbnailsPage></MyThumbnailsPage>
  },
  {
    path:'/account',
    element:<AccountSettings></AccountSettings>
  }
])
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <RouterProvider router={appRouter}></RouterProvider>
      <ToastContainer></ToastContainer>
    </>
  )
}

export default App
