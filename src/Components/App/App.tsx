import React, { Fragment, useState } from "react";
import ReactDOM from "react-dom";
import logo from './logo.svg';
import './App.css';
import Camera from '../Camera/Camera';

function App() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cardImage, setCardImage] = useState();

  return (
    <Fragment>
      <div>
        {isCameraOpen && (
          <Camera
            onCapture={(blob: any) => setCardImage(blob)}
            onClear={() => setCardImage(undefined)}
          />
        )}

        {cardImage && (
          <div>
            <h2>Preview</h2>
            <img src={cardImage && URL.createObjectURL(cardImage)} />
          </div>
        )}

        <div>
          <button onClick={() => setIsCameraOpen(true)}>Open Camera</button>
          <button
            onClick={() => {
              setIsCameraOpen(false);
              setCardImage(undefined);
            }}
          >
            Close Camera
          </button>
        </div>
      </div>
    </Fragment>
  );
}

export default App;
