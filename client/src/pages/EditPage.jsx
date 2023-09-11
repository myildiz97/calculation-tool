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
    axios.get("/api/users/currentuser/")
      .then(({ data }) => {
        (!data || data?.role !== "Admin") && navigate("/login");
      })
      .catch((err) => console.log(err));

    axios.get(`/api/pages/page/?id=${id}`)
      .then(({ data }) => {
        if (data?.serialized_page) {
          setPage(data?.serialized_page);
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