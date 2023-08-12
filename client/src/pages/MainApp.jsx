import { useEffect, useState } from "react";
import axios from "axios";

const MainApp = () => {
  const [pages, setPages] = useState(null);  

  useEffect(() => {
    axios.get("/app")
      .then(({ data }) => setPages(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="app-wrapper">
      Main App
    </div>
  );
};

export default MainApp;