import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditPageComp from "../components/EditPageComp.jsx";

const EditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [page, setPage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("/")
      .then(({ data }) => {
        console.log(data);
        (!data || data?.role !== "Admin") && navigate("/login");
      })
      .catch((err) => console.log(err));

    axios.get(`/pages/${id}`)
      .then(({ data }) => {
        if (data?.page) {
          setPage(data?.page[0]);
        } else {
          setError(data?.error);
        };
      })
      .catch((err) => console.log(err));
  }, [id]);
  
  return (
    <div className="page-edit">
      {page && <EditPageComp page={page} />}
      {error && <p className="errors">{error}</p>}
    </div>
  );
};

export default EditPage;