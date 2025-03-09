import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Main } from './components/Main';
import { Signup } from './components/Signup';
import Signin from './components/Signin';
import { Funds } from './components/Funds';
import { Create } from './components/Create';
import { CategoryPage } from './components/CategoryPage';
import Detail from './components/Detail';
import { useState } from 'react';
import Search from './components/Search';
import UserDashboard from './components/UserDashboard';
import UpdateFundraisers from './components/UpdateFundraisers';
import AboutPage from './components/AboutPage';
import ExploreCauses from './components/ExploreCauses';

function App() {
  // const [firstname,setfirst]=useState("");
  // const [lastname,setlastname]=useState("");
  const [email,setemail]=useState("");
  return (
    <BrowserRouter>  {/* Wrap the entire routing structure */}
      <Routes>
        <Route path="/" element={<><Navbar /><Main /></>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin setemail={setemail}/>} />
        <Route path='/funds' element={<><Navbar/><Funds/></>}/>
        <Route path='/create' element={<Create/>}/>
        <Route path="/fundraisers/:category" element={<><Navbar/><CategoryPage /></>} />
        {/* <Route path="/fundraisers/:category" element={<><Navbar/><CategoryPage /></>} /> */}
        <Route path="/fundraiser/:id" element={<><Navbar/><Detail email={email}/></>} />
        <Route path='/search' element={<><Navbar/><Search/></>}/>
        <Route path='/userdashboard' element={<><Navbar/><UserDashboard/></>}/>
        <Route path='/fundraiser/update/:id' element={<><Navbar/><UpdateFundraisers/></>}/>
        <Route path='/about' element={<><AboutPage/></>}/>
        <Route path='/explore' element={<><ExploreCauses/></>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;