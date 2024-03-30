
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import './index.css'
import Header from './components/layouts/Header'

function App() {

  return (
    <div className='bg-pink-300 absolute inset-0'>
   <Header />
   <Routes>
    <Route path={'/'} element={<Home></Home>} />
   </Routes>
  </div>
  )
}

export default App
