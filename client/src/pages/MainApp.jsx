import { useEffect, useState } from "react";
import axios from "axios";

const MainApp = () => {
  const baseUrlImg = "http://localhost:5000";
  // const baseUrlImg = "https://calculation-tool.vercel.app";

  const [lastPage, setLastPage] = useState(null);

  useEffect(() => {
    axios.get("/app")
      .then(({ data }) => setLastPage(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="app-wrapper">
      {lastPage?.error && <p>No page configured yet...</p>}
      
    </div>
  );
};

export default MainApp;