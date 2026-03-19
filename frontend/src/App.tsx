import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Overview from './pages/Overview'
import Photos from './pages/Photos'
import Timeline from './pages/Timeline'
import Details from './pages/Details'
import Expenses from './pages/Expenses'
import Calculator from './pages/Calculator'
import Notes from './pages/Notes'
import Shopping from './pages/Shopping'
import Spaces from './pages/Spaces'
import Inventory from './pages/Inventory'
import Utilities from './pages/Utilities'
import Projects from './pages/Projects'
import Contacts from './pages/Contacts'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="photos" element={<Photos />} />
          <Route path="timeline" element={<Timeline />} />
          <Route path="details" element={<Details />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="calculator" element={<Calculator />} />
          <Route path="notes" element={<Notes />} />
          <Route path="shopping" element={<Shopping />} />
          <Route path="spaces" element={<Spaces />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="utilities" element={<Utilities />} />
          <Route path="projects" element={<Projects />} />
          <Route path="contacts" element={<Contacts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
