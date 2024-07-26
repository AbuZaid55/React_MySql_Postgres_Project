import {BrowserRouter,Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Create from './pages/Create'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/create' element={<Create/>}/>
      </Routes>
      <ToastContainer/>
    </BrowserRouter>
  )
}

export default App
