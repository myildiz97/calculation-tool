import { Outlet } from "react-router";
import Header from "../components/Header";

const MainLayout = () => {
  return (
    <div className="main-wrapper">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;