import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
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

  const handleEditBtn = (id) => navigate(`/admin/edit/${id}`);

  const handleDeleteBtn = async (id) => {
    setDeleteError(null);
    const ans = window.confirm("Are you sure to delete the page?");
    if (ans) {
      try {
        const { data } = await axios.delete(`/admin/delete/${id}`);
        if (data?.message) {
          toast.success("Page deleted successfully!");
          setDeleteError(null);
          navigate(0);
        } else {
          toast.error("Page not deleleted!");
        };
      } catch (error) {
        console.error(error);
        setDeleteError("Error deleting page!");
      }
    };
  };

  const handleGetConfig = (id) => navigate(`/app/${id}`);

  return (
    <div className="wrapper">
      <h1 className="wrapper-heading">Admin Panel</h1>
      {user && <h2 className="wrapper-heading">Welcome {user.fullName}!</h2>}
      <hr className="page-hr"/>
      <h2 style={{margin: "20px 0", color: "#fff"}}>Config new page</h2>
      <div className="add-pages" style={{marginBottom: "20px"}}>
        <input 
          type="text"
          placeholder="Enter config name"
          onChange={(e) => setName(e.target.value)}
          style={{width: "100%"}}
        />
        <IoMdAddCircleOutline className="new-page-btn" size="40" onClick={handleNewPage} />
      </div>
      {error && <p className="errors">{error}</p>}
      <hr className="page-hr"/>
      <h2 style={{margin: "20px 0", color: "#fff"}}>Existing page settings</h2>
      <div className="existing-pages">
        {
          pages?.length > 0 ? (
            <> {
              pages.map((page, index) => (
                <div key={`ex-page-${index}`} style={{width: "100%"}}>
                  <div className="existing-page">
                    <div className="ex-page-name" onClick={() => handleGetConfig(page?._id)}>{page?.configName}</div>
                    <AiFillEdit className="ex-page-btn" size="50" color="#fff" onClick={() => handleEditBtn(page?._id)}/>
                    <AiFillDelete className="ex-page-btn" size="50" color="#fff" onClick={() => handleDeleteBtn(page?._id)}/>
                  </div>
                  {deleteError && <p className="errors">{deleteError}</p>}
                </div >
              ))
            } 
            </>
          ): (
            <p style={{color: "#e63946", fontSize: "1.1em", fontWeight: "bold"}}>There is no page configuration yet...</p>
          )
        }
      </div>
    </div>
  );
};

export default Admin;