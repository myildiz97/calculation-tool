import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EditPageComp from "../components/EditPageComp.jsx";

const EditPage = () => {
  const { id } = useParams();

  const [page, setPage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
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