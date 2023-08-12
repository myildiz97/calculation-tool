import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InputPage from "../components/InputPage.jsx";

const Admin = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [inputPageNumber, setInputPageNumber] = useState([]);
  const [numberOfPages, setNumberOfPages] = useState(null);
  const [numberError, setNumberError] = useState(null);

  useEffect(() => {
    axios.get("/")
      .then(({ data }) => data?.role === "Admin" ? setUser(data) : navigate("/login"))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="wrapper">
      <h1>Admin Panel</h1>
      {user && <h2>Welcome {user.fullName}!</h2>}
      {
        inputPageNumber.length < 1 ? (
          <div className="form-inputNums">
            <label htmlFor="inputPageNumber">Enter the number of input pages: </label>
            <div>
              <input type="number" id="inputPageNumber" placeholder="2" min="0" onChange={(e) => setNumberOfPages(e.target.value)} />
              <button onClick={() => {
                if (!numberOfPages) setNumberError("Page number must be entered!");
                if (numberOfPages < 0) {
                  setNumberError("Page number cannot be negative!");
                } else {
                  const array = Array.from({ length: numberOfPages }, (_, index) => index.toString());
                  setInputPageNumber(array);
                }
            }}>Get Pages</button>
            </div>
            {numberError && <p className="errors">{numberError}</p>}
          </div>
        ) : (
          <InputPage inputPageNumber={inputPageNumber} />
        )
      }
    </div>
  );
};

export default Admin;