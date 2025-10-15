import { Routes, Route } from 'react-router'
import Layout from './components/Layout'
import Login from './pages/Login'
import Home from './pages/Home'
import Projects from './pages/Projects'
import './App.css'

export default function App() {
  return (
    <>
    <Layout >
        <main className="" style={{ height: '110vh'}}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/login' element={<Login />}/>
            <Route path="/projects" element={<Projects />} />
          </Routes>
        </main>
    </Layout>
    </>
  )
}