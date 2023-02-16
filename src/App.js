import './App.css';
import Landing from './Components/Landing/Landing.js';
import SignUp from './Components/SignUp/SignUp.js';
import Home from './Components/Home/Home.js';
import Org from './Components/Org/Org.js';
import CreateProfile from './Components/CreateProfile/CreateProfile.js';
import { Route, Routes } from 'react-router';

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path='/' element={<Landing />} />
                <Route path='/signup' element={ <SignUp /> } />
                <Route path='/home' element={<Home />} />
                <Route path='/org/:id' element={<Org /> } />
                <Route path='/createprofile/:id' element={<CreateProfile /> }/>
            </Routes>
        </div>
    );
}

export default App;
