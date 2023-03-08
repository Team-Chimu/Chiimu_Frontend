import './App.css';
import Landing from './Components/Landing/Landing.js';
import SignUp from './Components/SignUp/SignUp.js';
import Home from './Components/Home/Home.js';
import Org from './Components/Org/Org.js';
import CreateProfile from './Components/CreateProfile/CreateProfile.js';
import CreateJoinOrg from './Components/CreateJoinOrg/CreateJoinOrg.js';
import CreateOrg from './Components/CreateJoinOrg/CreateOrg/CreateOrg.js';
import OrgProfile from './Components/Org/OrgProfile/OrgProfile.js';
import JoinOrg from './Components/CreateJoinOrg/JoinOrg/JoinOrg.js';
import PageNotFound from './Components/PageNotFound/PageNotFound.js';
import { Route, Routes } from 'react-router';

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path='/' element={<Landing />} />
                <Route path='/signup' element={ <SignUp /> } />
                <Route path='/home' element={<Home />} />
                <Route path='/createjoinorg' element={< CreateJoinOrg /> }/>
                <Route path='/createorg' element={<CreateOrg /> }/>
                <Route path='/joinorg' element={<JoinOrg /> } />
                <Route path='/org/:id' element={<Org /> } />
                <Route path='/org/orgprofile/:id' element={ <OrgProfile /> } />
                <Route path='/createprofile/:id' element={<CreateProfile /> } />
                <Route path='*' element={<PageNotFound />} />
            </Routes>
        </div>
    );
}

export default App;
