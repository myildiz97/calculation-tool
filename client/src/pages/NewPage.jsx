import { useState } from "react";
import { useParams } from "react-router-dom";
import InputPage from "../components/InputPage.jsx";

const NewPage = () => {
  const { configName } = useParams();
  
  const [inputPageNumber, setInputPageNumber] = useState([]);
  const [numberOfPages, setNumberOfPages] = useState(null);
  const [numberError, setNumberError] = useState(null);

  return (
    <div className="new-page">
      {
        inputPageNumber.length < 1 ? (
          <div className="form-inputNums">
            <label htmlFor="inputPageNumber">Enter the number of input pages: </label>
            <div>
              <input type="number" id="inputPageNumber" placeholder="2" min="0" onChange={(e) => setNumberOfPages(parseInt(e.target.value) + 1)} />
              <button onClick={() => {
                if (!numberOfPages) setNumberError("Page number must be entered!");
                if (numberOfPages < 2) {
                  setNumberError("Page number must be positive!");
                } else {
                  const array = Array.from({ length: numberOfPages }, (_, index) => index.toString());
                  setInputPageNumber(array);
                }
              }}>Set Pages</button>
            </div>
            {numberError && <p className="errors">{numberError}</p>}
          </div>
        ) : (
          <InputPage inputPageNumber={inputPageNumber} configName={configName} />
          )
        }
    </div>
  );
};

export default NewPage;