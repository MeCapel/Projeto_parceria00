// ===== GERAL IMPORTS =====
import './App.css'
import { Routes, Route } from 'react-router'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ===== IMPORTING COMPONENTS =====
import AuthProvider from './context/AuthProvider'
import ProtectedRoute from './components/Others/ProtectedRoute'
import AdminRoute from './components/Others/AdminRoute'
import Layout from './components/00Geral/Layout'
import Clients from './pages/Clients';

// ====== IMPORTING FULL PAGES =====
import Home from './pages/Home'
import Login from './pages/Login'
import Project from './pages/Project'
import Profile from './pages/Profile'
import NotFoundPage from './pages/NotFoundPage'
import ResetPassword from './pages/ResetPassword'
import ConfirmResetPassword from './pages/ConfirmResetPassword'
import PrototypePage from './components/03PrototypeRelated/PrototypePage/PrototypePage';
import ProjectsPage from './pages/ProjectsPage';
import AdminDashboard from './pages/AdminDashboard';
import ChecklistModelsTab from './components/dashboard/ChecklistModelsTab';
import ClientsTab from './components/dashboard/ClientsTab';
import ProjectsTab from './components/dashboard/ProjectsTab';
import PrototypesTab from './components/dashboard/PrototypesTab';
import OccurrencesTab from './components/dashboard/OccurrencesTab';
import UsersTab from './components/dashboard/UsersTab';

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
          <Route path="*" element={<NotFoundPage />} />
          <Route path='/resetpassword' element={<ResetPassword />}/>
          <Route path='/confirmresetpassword' element={<ConfirmResetPassword />}/>
          
          {/* Rotas Protegidas que usam o Layout do sistema */}
          <Route path='/home' element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>}/>
          <Route path='/clientes' element={<ProtectedRoute><Layout><Clients /></Layout></ProtectedRoute>}/>
          <Route path="/projects" element={<ProtectedRoute><Layout><ProjectsPage /></Layout></ProtectedRoute>} />
          <Route path='/profile' element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>}/>
          <Route path="/projects/:projectid" element={<ProtectedRoute><Layout><Project /></Layout></ProtectedRoute>} />
          <Route path="/projects/:projectid/:prototypeid" element={<ProtectedRoute><Layout><PrototypePage /></Layout></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<AdminRoute><Layout><AdminDashboard /></Layout></AdminRoute>} />
          <Route path="/users-dashboard" element={<AdminRoute><Layout><UsersTab/></Layout></AdminRoute>} />
          <Route path="/projects-dashboard" element={<AdminRoute><Layout><ProjectsTab /></Layout></AdminRoute>} />
          <Route path="/clients-dashboard" element={<AdminRoute><Layout><ClientsTab /></Layout></AdminRoute>} />
          <Route path="/prototypes-dashboard" element={<AdminRoute><Layout><PrototypesTab /></Layout></AdminRoute>} />
          <Route path="/checklist-models-dashboard" element={<AdminRoute><Layout><ChecklistModelsTab /></Layout></AdminRoute>} />
          <Route path="/admin-prototype/:prototypeid" element={<AdminRoute><Layout><PrototypePage /></Layout></AdminRoute>} />
          <Route path="/occurrences-dashboard" element={<AdminRoute><Layout><OccurrencesTab/></Layout></AdminRoute>} />
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