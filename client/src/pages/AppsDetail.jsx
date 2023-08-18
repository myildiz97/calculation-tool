import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import DropInfo from "../forms/DropInfo.jsx";

const AppsDetail = () => {
  const { id } = useParams();

  const baseUrlImg = "http://localhost:5000";

  const [configPage, setConfigPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [varNum, setVarNum] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [outputValues, setOutputValues] = useState({});
  const [outputVals, setOutputVals] = useState(null);

  useEffect(() => {
    axios.get(`/apps/${id}`)
      .then(({ data }) => {
        setConfigPage(data?.page[0]);
        setVarNum((prevVarNum) => {
          let total = 0;
          data?.page[0]?.variableName?.forEach((v) => {
            total += v[0].split(",").length;
          });
          return total;
        });
        setOutputVals(data?.page[0]?.outputValue);
      })
      .catch((err) => console.error(err));
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
  const expressions = useMemo(() => configPage && [...configPage?.calculation], [configPage]);
  const trigger = useMemo(() => expressions && objLen === varNum, [expressions, inputValues, varNum]);
  const btnTrigger = useMemo(() => objLen < 1);

  const handleSubmit = () => {
    if (trigger) {
      const expressionsArr = [...expressions];
      const newExpressionsArr = expressionsArr.map((e) => replaceVariables(e));
      axios.post('/calculation', { expressions: JSON.stringify(newExpressionsArr), outputs: JSON.stringify(outputVals) })
        .then(({ data }) => setOutputValues(data?.results))
        .catch(error => console.error('Error calculating:', error));
    };
    handleNext();
  };

  return (
    <div className="apps-wrapper-outer">
      {configPage?.error && <p>{configPage?.error}</p>}
      <div className="apps-wrapper-inner">
        {
          configPage && configPage?.image?.map((page, index) => (
            <div key={"apps-inner-" + index} style={{ display: index === currentPage ? "flex" : "none", width: "100%" }} className="apps-img-detail">
              <div className="apps-img">
                <img src={baseUrlImg + configPage?.image[index]} />
              </div>
              <div className="apps-info" style={{color: "#fff"}}>
                <div className="apps-info-header">
                  <h1>{configPage?.title[index]}</h1>
                  <h3 style={{fontWeight: "normal"}}>{configPage?.description[index]}</h3>
                </div>
                  { index !== configPage.image.length - 1 ? (
                    <div className="apps-info-inputs">
                      {
                        configPage?.variableName[index][0].split(",").map((name, i) => (
                          <input
                            key={`apps-${name}-${i}`}
                            type="number"
                            min={0}
                            id={name}
                            placeholder={configPage?.placeholder[index][0].split(",")[i]}
                            onChange={e => handleChange(name, e.target.value)}
                          />
                        ))
                      }
                    </div>
                    ): (
                      <div className="apps-info-output">
                        {
                          configPage?.outputValue.map((value, i) => (
                            <p key={"apps-outputname-" + i}>
                              <span>{configPage?.outputName[i] + ": "}</span>
                              <span>{outputValues?.[configPage?.outputValue?.[i]] ? outputValues?.[configPage?.outputValue?.[i]] : "No calculation yet"}</span>
                              <span> {configPage?.outputUnit?.[i]}</span>
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
        <div className="next-back-btn" style={{marginTop: "20px"}}>
          {currentPage !== 0 && 
            <button 
              style={currentPage === configPage?.image?.length - 1 ? {marginRight: "auto", marginLeft: "0"} : null} 
              onClick={handlePrev}
            >Back</button>}
          {currentPage !== configPage?.image?.length - 1 && 
            <button 
              onClick={currentPage === configPage?.image?.length - 2 ? handleSubmit : handleNext}
              disabled={btnTrigger}
              style={{cursor: btnTrigger ? "not-allowed" : "pointer"}}
            >
              Forward</button>}
        </div>
        {
          currentPage === configPage?.image?.length - 1 &&
          <DropInfo configName={configPage?.configName} />
        }
      </div>
    </div>
  );
};

export default AppsDetail;