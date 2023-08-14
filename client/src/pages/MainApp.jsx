import { useEffect, useState } from "react";
import axios from "axios";

const MainApp = () => {
  const baseUrlImg = "http://localhost:5000";
  // const baseUrlImg = "https://calculation-tool.vercel.app";

  const [lastPage, setLastPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const handleNext = () => setCurrentPage(prevPage => prevPage + 1);

  const handlePrev = () => setCurrentPage(prevPage => prevPage - 1);

  useEffect(() => {
    axios.get("/app")
      .then(({ data }) => setLastPage(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="app-wrapper">
      {lastPage?.error && <p>No page configured yet...</p>}
      <>
        {
          lastPage && lastPage.image.map((page, index) => (
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
                            key={"input-" + i}
                            type="number"
                            id={name}
                            placeholder={lastPage?.placeholder[index][0].split(",")[i]}
                          />
                        ))
                      }
                    </div>
                    ): (
                      <div className="app-info-output">
                        {
                          lastPage?.outputValue.map((value, i) => (
                            <input
                              key={"output-" + i}
                              type="number"
                              id={value}
                              placeholder={lastPage?.outputName[i]}
                            />
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