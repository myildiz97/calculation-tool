import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoMdAddCircleOutline } from "react-icons/io";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";

const Admin = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [pages, setPages] = useState(null);
  const [name, setName] = useState(null);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    axios.get("/")
      .then(({ data }) => data?.role === "Admin" ? setUser(data) : navigate("/login"))
      .catch((err) => console.log(err));

    axios.get("/pages")
      .then(({ data }) => setPages(data))
      .catch((err) => console.log(err));
  }, []);

  const handleNewPage = async () => {
    setError(null);
    if (name) {
      try {
        const { data } = await axios.get(`/admin?configName=${name}`);
        const { configName, error } = data;
        if (error) setError(error);
        if (configName) {
          setError(null);
          navigate(`/admin/add/${configName}`);
        };
      } catch (error) {
        console.error(error);
      }
    } else {
      setError("Config name must be given!");
    };
  };

  const handleEditBtn = async (id) => navigate(`/admin/edit/${id}`);

  const handleDeleteBtn = (id) => {
    console.log("delete: ", id);
  };

  return (
    <div className="wrapper">
      <h1 className="wrapper-heading">Admin Panel</h1>
      {user && <h2 className="wrapper-heading">Welcome {user.fullName}!</h2>}
      <hr className="page-hr"/>
      <h3 style={{margin: "20px 0", color: "#fff"}}>Config new page</h3>
      <div className="add-pages" style={{marginBottom: "20px"}}>
        <input 
          type="text"
          placeholder="Enter config name"
          onChange={(e) => setName(e.target.value)}
        />
        <IoMdAddCircleOutline className="new-page-btn" size="40" onClick={handleNewPage} />
      </div>
      {error && <p className="errors">{error}</p>}
      <hr className="page-hr"/>
      <h3 style={{margin: "20px 0", color: "#fff"}}>Existing page settings</h3>
      <div className="existing-pages">
        {
          pages ? (
            <> {
              pages.map((page, index) => (
                <div key={`ex-page-${index}`} style={{width: "100%"}}>
                  <div className="existing-page">
                    <div className="ex-page-name">{page?.configName}</div>
                    <AiFillEdit className="ex-page-btn" size="50" color="#fff" onClick={() => handleEditBtn(page?._id)}/>
                    <AiFillDelete className="ex-page-btn" size="50" color="#fff" onClick={() => handleDeleteBtn(page?._id)}/>
                  </div>
                  {deleteError && <p className="errors">{deleteError}</p>}
                </div >
              ))
            } 
            </>
          ): (
            <p>There is no page configuration yet...</p>
          )
        }
      </div>
    </div>
  );
};

export default Admin;