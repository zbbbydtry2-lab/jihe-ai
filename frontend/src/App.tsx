import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import AiWorkbench from './pages/AiWorkbench'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'
import History from './pages/History'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="tools/ai-workbench" element={<AiWorkbench />} />
          <Route path="history" element={<History />} />
          <Route path="admin" element={<Admin />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}
