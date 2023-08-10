import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

const App = () => {
  return (
    <Router>
      <Toaster position="bottom-right" toastOptions={{ duration: 4000}} />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App