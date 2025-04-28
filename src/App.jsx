import { Routes, Route } from 'react-router-dom'
//pages
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home.jsx';
import Details from './pages/Details.jsx';
import Orders from './pages/Orders.jsx';
import UserProfile from './pages/UserProfile.jsx';

//components
import HomeNavbar from './components/HomeNavbar.jsx';
import List from './components/List.jsx';

//css
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

function App() {
  
  return (
    <div>
      <HomeNavbar/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/book/list' element={<List/>}/>
      <Route path='/book/view/:id' element={<Details/>}/>
      <Route path='/book/orders' element={<Orders/>}/>
      <Route path='/user/profile/:userId' element={<UserProfile />}/>
    </Routes>
    </div>
  )
}

export default App
