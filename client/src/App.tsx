import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import {SignUp} from './views/SignUp'
import { SignIn } from './views/SignIn'
import Redirecting from './views/Redirecting'
import Layout from './views/Layout'
import Dashboard from './views/Dashboard'
import LandingPage from './views/LandingPage'
import CreateSession from './views/CreateSession'
import ProfilePage from './views/Profile'
import SessionDetailsPage from './views/SessionDetailsPage'
// import { NavBar } from './components/global/NavBar'

const App = () => {
  return (

    <Router>
    {/* <NavBar/> */}
      <Routes>
        <Route path='/' element={<Layout/>}>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/profile' element={<ProfilePage/>}/>
        <Route path='/create-session' element={<CreateSession/>}/>
        <Route path='/session/:id' element={<SessionDetailsPage/>}/>
        </Route>
        <Route path='/signIn' element={<SignIn/>}/>
        <Route path='/signUp' element={<SignUp/>}/>
        <Route path='/redirect' element={<Redirecting/>}/>
      </Routes>
    </Router>

  )
}

export default App
