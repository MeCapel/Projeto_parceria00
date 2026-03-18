// Importing geral stuff
import './App.css'
import { Routes, Route } from 'react-router'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importing components
import AuthProvider from './context/AuthProvider'
import ProtectedRoute from './components/Others/ProtectedRoute'
import Layout from './components/00Geral/Layout'

// Importing full pages
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Project from './pages/Project'
import Profile from './pages/Profile'
import Projects from './pages/Projects'
import NotFoundPage from './pages/NotFoundPage'
import ResetPassword from './pages/ResetPassword'
import ConfirmResetPassword from './pages/ConfirmResetPassword'
import PrototypePage from './components/03PrototypeRelated/PrototypePage/PrototypePage';

// App.tsx component
export default function App() {

  return (

    // Wrap all pages inside an AuthProvider component that sets the user data - it can be null if the user do not exists
    <AuthProvider>

      {/* Main div that wrap all those app routes */}
      <main className="" style={{}}>

        {/* Route component - inside there are all of the possible routes in this app */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path='/login' element={<Login />}/>
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path='/resetpassword' element={<ResetPassword />}/>
          <Route path='/confirmresetpassword' element={<ConfirmResetPassword />}/>
          
          {/* Rotas Protegidas que usam o Layout do sistema */}
          <Route path='/home' element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>}/>
          <Route path='/proto' element={<ProtectedRoute><Layout><PrototypePage /></Layout></ProtectedRoute>}/>
          <Route path="/projects" element={<ProtectedRoute><Layout><Projects /></Layout></ProtectedRoute>} />
          <Route path='/profile' element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>}/>
          <Route path="/projects/:projectid" element={<ProtectedRoute><Layout><Project /></Layout></ProtectedRoute>} />
          <Route path="/projects/:projectid/:prototypeid" element={<ProtectedRoute><Layout><PrototypePage /></Layout></ProtectedRoute>} />
        </Routes>

      </main>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

    </AuthProvider>
  )
}