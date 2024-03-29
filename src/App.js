import './App.css';
import { BrowserRouter,Route, Routes,useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css"
import Login from "./components/Login"
import Signup from './components/Signup';
import Home from './components/Home';

function App() {
 
  return (
    <div className="App">
     <BrowserRouter>
     <Routes>
      <Route path="/" exact element={<Signup/>}></Route>
      <Route path="/login"  element={<Login/>}></Route>
      <Route path="/home"  element={<Home/>}></Route>     
     </Routes>
     </BrowserRouter>
    
    </div>
  );
}

export default App;
