import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";

const MainApp = () => {
  const baseUrlImg = "http://localhost:5000";
  // const baseUrlImg = "https://calculation-tool.vercel.app";

  const [lastPage, setLastPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [varNum, setVarNum] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [outputValues, setOutputValues] = useState(null);

  useEffect(() => {
    axios.get("/app")
      .then(({ data }) => {
        setLastPage(data);
        setVarNum((prevVarNum) => {
          let total = 0;
          data.variableName.forEach((v) => {
            total += v[0].split(",").length;
          });
          return total;
        });
        setOutputValues(new Array(data.outputName.length).fill(null));
      })
      .catch((err) => console.error(err));
  }, []);

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
  
    return expression;
  };

  const expressions = useMemo(() => lastPage && [...lastPage?.calculation], [lastPage]);
  const trigger = useMemo(() => expressions && Object.keys(inputValues).length === varNum, [expressions, inputValues, varNum]);

  useEffect(() => {
    if (trigger) {
      const newOutputValues = expressions.map((e) => {
        const modifiedExpression = replaceVariables(e);
        return eval(modifiedExpression);
      });
      setOutputValues((prevOutputValues) => {
        const updatedOutputValues = [...prevOutputValues];
        newOutputValues.forEach((value, index) => {
          updatedOutputValues[index] = value;
        });
        return updatedOutputValues;
      });
    }
  }, [trigger]);

  return (
    <div className="app-wrapper">
      {lastPage?.error && <p>No page configured yet...</p>}
      <>
        {
          lastPage && lastPage?.image?.map((page, index) => (
            <div key={index} style={{ display: index === currentPage ? 'block' : 'none' }}>
              <div className="app-img">
                <img src={baseUrlImg + lastPage?.image[index]} width={60} />
              </div>
              <div className="app-info">
                <div className="app-info-header">
                  <h1>{lastPage?.title[index]}</h1>
                  <h3>{lastPage?.description[index]}</h3>
                </div>
                  { index !== lastPage.image.length - 1 ? (
                    <div className="app-info-inputs">
                      {
                        lastPage?.variableName[index][0].split(",").map((name, i) => (
                          <input
                            key={`${name}-${i}`}
                            type="number"
                            id={name}
                            placeholder={lastPage?.placeholder[index][0].split(",")[i]}
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
                              {lastPage?.outputName[i] + "= "}
                              <span>{outputValues[i] ? outputValues[i] : "No calculation"}</span>
                              <span> {outputValues[i] && lastPage?.outputUnit[i]}</span>
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
        <div>
          {currentPage !== 0 && <button onClick={handlePrev}>Back</button>}
          {currentPage !== lastPage?.image?.length - 1 && <button onClick={handleNext}>Forward</button>}
        </div>
      </>
    </div>
  );
};

export default MainApp;