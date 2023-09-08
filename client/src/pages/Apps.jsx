import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Apps = () => {
  const navigate = useNavigate();

  const [pages, setPages] = useState(null);

  useEffect(() => { 
    axios.get("/api/pages/")
      .then(({ data }) => {
        console.log(data);
        setPages(data)
      })
      .catch((err) => console.log(err));
  }, []);

  const baseUrlImg = "http://localhost:8000";

  const handleGetConfig = (id) => navigate(`/apps/${id}`);

  return (
    <div className="apps-pages">
      {
        pages?.length > 0 ? (
          <> 
          <h1 style={{color: "#fff"}}>Available Apps</h1>
          <hr className="page-hr" />
          {
            pages?.map((page, index) => (
              <div key={"apps-page-" + index} className="apps-page" onClick={() => handleGetConfig(page?.id)}>{page?.configName}</div>
            ))
          } 
          </>
        ): (
          <p style={{color: "#e63946", fontSize: "1.1em", fontWeight: "bold"}}>There is no page available to be displayed yet...</p>
        )
      }
    </div>
  );
};

export default Apps;