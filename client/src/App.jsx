import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import axios from "axios";
import { Toaster } from "react-hot-toast";

axios.defaults.baseURL = "https://calculation-tool.vercel.app"; // http://localhost:5000
axios.defaults.withCredentials = true;

const App = () => {
  return (
    <Router>
      <Toaster 
        position="bottom-center" 
        toastOptions={{ duration: 3000}} 
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
};

export default App;
