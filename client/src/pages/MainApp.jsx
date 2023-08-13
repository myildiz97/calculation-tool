import { useEffect, useState } from "react";
import axios from "axios";

const MainApp = () => {
  const baseUrlImg = "http://localhost:5000";

  const [pages, setPages] = useState(null);

  useEffect(() => {
    axios.get("/app")
      .then(({ data }) => setPages(data))
      .catch((err) => console.error(err));
  }, []);

  pages && console.log(pages[2].image[0][0])
  return (
    <div className="app-wrapper">
      {pages &&
        <img src={`${baseUrlImg}${pages[2].image[0][1]}`} width={60} />
      }
    </div>
  );
};

export default MainApp;