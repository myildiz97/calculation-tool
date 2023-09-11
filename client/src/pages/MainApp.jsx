import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const MainApp = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const baseUrlImg = "http://localhost:8000";

  const [lastPage, setLastPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [varNum, setVarNum] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [outputValues, setOutputValues] = useState({});
  const [outputVals, setOutputVals] = useState(null);

  useEffect(() => {
    axios.get("/api/users/currentuser/")
      .then(({ data }) => (!data || data?.role !== "Admin") && navigate("/login"))
      .catch((err) => console.log(err));

    if (id) {
      axios.get(`/api/pages/`)
      .then(({ data }) => {
        setLastPage(data?.[data.length - 1]);
        setVarNum((prevVarNum) => {
          let total = 0;
          data?.[data.length - 1]?.variableName?.[0].forEach((v) => {
            total += v.split(",").length;
          });
          return total;
        });
        setOutputVals(data?.[data.length - 1]?.outputValue);
      })
      .catch((err) => console.error(err));
    } else {
      axios.get("/api/pages/page/")
        .then(({ data }) => {
          setLastPage(data);
          setVarNum((prevVarNum) => {
            let total = 0;
            data?.variableName?.forEach((v) => {
              total += v[0].split(",").length;
            });
            return total;
          });
          setOutputVals(data?.outputValue);
        })
        .catch((err) => console.error(err));
    };
  }, [id]);

  const handleNext = () => setCurrentPage(prevPage => prevPage + 1);

  const handlePrev = () => setCurrentPage(prevPage => prevPage - 1);

  const handleChange = useCallback((name, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  }, []);
  
  const replaceVariables = (expression) => {
    const variables = Object.keys(inputValues);

    for (const variable of variables) {
      const value = inputValues[variable];
      expression = expression.replace(new RegExp(variable, 'g'), value);
    };

    expression = expression.replace(/[A-Za-z]/g, char => `FILL!${char}!`);
  
    return expression;
  };

  const objLen = Object.keys(inputValues).length;
  const expressions = useMemo(() => lastPage && [...lastPage?.calculation], [lastPage]);
  const trigger = useMemo(() => expressions && objLen === varNum, [expressions, inputValues, varNum]);
  const btnTrigger = useMemo(() => objLen < 1);

  const handleSubmit = () => {
    if (trigger) {
      const expressionsArr = [...expressions];
      const newExpressionsArr = expressionsArr.map((e) => replaceVariables(e));
      axios.post('/api/pages/calculation/', { expressions: JSON.stringify(newExpressionsArr), outputs: JSON.stringify(outputVals) })
        .then(({ data }) => {
          setOutputValues(data?.results);
        })
        .catch(error => console.error('Error calculating:', error));
    };
    handleNext();
  };

  return (
    <div className="app-wrapper">
      {lastPage?.error && <p>No page configured yet...</p>}
      <>
        {
          lastPage && lastPage?.image?.map((page, index) => (
            <div key={index} style={{ display: index === currentPage ? "flex" : "none", width: "100%" }} className="app-page-container">
              <div className="app-img">
                <img src={baseUrlImg + lastPage?.image[index]} />
              </div>
              <div className="app-info">
                <div className="app-info-header">
                  <h1>{lastPage?.title[index]}</h1>
                  <h3 style={{fontWeight: "normal"}}>{lastPage?.description[index]}</h3>
                </div>
                  { index !== lastPage?.image.length - 1 ? (
                    <div className="app-info-inputs">
                      {
                        lastPage?.variableName?.[0]?.[index].split(",").map((name, i) => (
                          <input
                            key={`${name}-${i}`}
                            type="number"
                            min={0}
                            id={name}
                            placeholder={lastPage?.placeholder?.[0]?.[index].split(",")[i]}
                            onChange={e => handleChange(name, e.target.value)}
                          />
                        ))
                      }
                    </div>
                    ): (
                      <div className="app-info-output">
                        {
                          lastPage?.outputValue.map((value, i) => (
                            <p key={"outputname-" + i}>
                              <span>{lastPage?.outputName[i] + ": "}</span>
                              <span>{outputValues?.[lastPage?.outputValue?.[i]] ? outputValues?.[lastPage?.outputValue?.[i]] : "No calculation yet"}</span>
                              <span> {lastPage?.outputUnit?.[i]}</span>
                            </p>
                          ))
                        }
                      </div>
                    )
                  }
              </div>
            </div>
          ))
        }
        <div className="next-back-btn">
          {currentPage !== 0 && 
            <button 
              style={currentPage === lastPage?.image?.length - 1 ? {marginRight: "auto", marginLeft: "0"} : null} 
              onClick={handlePrev}
            >Back</button>}
          {currentPage !== lastPage?.image?.length - 1 && 
            <button 
              onClick={currentPage === lastPage?.image?.length - 2 ? handleSubmit : handleNext}
              disabled={btnTrigger}
              style={{cursor: btnTrigger ? "not-allowed" : "pointer"}}
            >
              Forward</button>}
        </div>
      </>
    </div>
  );
};

export default MainApp;