import './App.css';
import Landing from './Components/Landing/Landing.js';
import SignUp from './Components/SignUp/SignUp.js';
import Home from './Components/Home/Home.js';
import { Route, Routes } from 'react-router';

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path='/' element={<Landing />} />
                <Route path='/signup' element={ <SignUp /> } />
                <Route path='/home' element={<Home />} />
            </Routes>
        </div>
    );
}

export default App;
