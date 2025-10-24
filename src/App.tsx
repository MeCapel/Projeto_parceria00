import { Routes, Route } from 'react-router'
import Login from './pages/Login'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import ProtectedRoute from './components/ProtectedRoute'
import Projects from './pages/Projects'
import ResetPassword from './pages/ResetPassword'
import ConfirmResetPassword from './pages/ConfirmResetPassword'
import AuthProvider from './context/AuthProvider'
import './App.css'

export default function App() {

  return (
    <AuthProvider>
      <main className="" style={{}}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/resetpassword' element={<ResetPassword />}/>
          <Route path='/confirmresetpassword' element={<ConfirmResetPassword />}/>
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </main>
    </AuthProvider>
  )
}