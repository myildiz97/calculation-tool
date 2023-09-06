import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import MainApp from "./pages/MainApp";
import NewPage from "./pages/NewPage";
import EditPage from "./pages/EditPage";
import Apps from "./pages/Apps";
import AppsDetail from "./pages/AppsDetail";
import Customers from "./pages/Customers";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import MainLayout from "./layouts/MainLayout";

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;
axios.defaults.headers = {
  "Content-Type": "application/json",
}

const App = () => {
  return (
    <Router>
      <Toaster 
        position="bottom-center" 
        toastOptions={{ duration: 3000}} 
      />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="admin" element={<Admin />} />
          <Route path="admin/add/:configName" element={<NewPage />} />
          <Route path="admin/edit/:id" element={<EditPage />} />
          <Route path="app" element={<MainApp />} />
          <Route path="app/:id" element={<MainApp />} />
          <Route path="apps" element={<Apps />} />
          <Route path="apps/:id" element={<AppsDetail />} />
          <Route path="customers" element={<Customers />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
