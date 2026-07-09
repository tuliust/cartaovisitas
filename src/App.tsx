import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PublicCardPage from './pages/PublicCardPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:slug" element={<PublicCardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
