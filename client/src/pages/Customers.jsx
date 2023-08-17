import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState(null);

  useEffect(() => {
    axios.get("/")
      .then(({ data }) => (!data || data?.role !== "Admin") && navigate("/login"))
      .catch((error) => console.log(error));

    axios.get("/customers")
      .then(({ data } ) => setCustomers(data))
      .catch((error) => console.log(error));
  }, []);

  const getDate = (date) => {
    const d = new Date(date);
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const formattedDate = d.toLocaleString(undefined, options);
    return formattedDate;
  };

  return (
    <div className="customers-wrapper">
      <h1 style={{color: "#fff", textDecorationLine: "underline"}}>Customers</h1>
      {
        customers?.map((customer, index) => (
          <div className="customer" key={"customer-" + index}>
            <div className="customer-info">
              <p style={{textAlign: "start"}}>Name: <span>{customer?.name}</span></p>
              <p style={{textAlign: "start"}}>Surname: <span>{customer?.surname}</span></p>
              <p style={{textAlign: "start"}}>Phone number: <span>{customer?.phone}</span></p>
              <p style={{textAlign: "start"}}>Sent time: <span>{getDate(customer?.createdAt)}</span></p>
            </div>
            {index + 1 !== customers?.length && <hr className="page-hr" style={{marginBottom: "0", marginTop: "20px"}} />} 
          </div>
        ))
      }
    </div>
  );
};

export default Customers;