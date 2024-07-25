import {BrowserRouter,Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Actions from './pages/Actions'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/actions' element={<Actions/>}/>
      </Routes>
      <ToastContainer/>
    </BrowserRouter>
  )
}

export default App
