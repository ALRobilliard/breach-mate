import React, { Fragment, useState } from "react";
import Tesseract from 'tesseract.js';
import './App.css';
import Camera from '../Camera/Camera';

interface IAnalysisResponse {
  pattern: RegExpMatchArray | null;
  text: string;
  confidence: number
}

function App() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [screenImage, setScreenImage] = useState<Blob>();
  const [imageObjectUrl, setImageObjectUrl] = useState<string>();
  const [patterns, setPatterns] = useState<RegExpMatchArray | null>();
  const [analysisResp, setAnalysisResp] = useState<IAnalysisResponse>();

  function analyseImage() {
    window.alert('hit analyse')
    let imageObj = imageObjectUrl;
    if (imageObj) {
      Tesseract.recognize(imageObj, 'eng')
        .catch(err => {
          console.error(err)
        })
        .then(result => {
          let confidence,
            text,
            patterns;
          console.log(result);
          if (result) {
            // Get Confidence score
            confidence = result.data.confidence

            // Get full output
            text = result.data.text

            // Get codes
            const charWhitelist = /\b[0123456789ABCDEF]{2,2}\b/g
            patterns = result.data.text.match(charWhitelist);

            // Update state
            setPatterns(patterns);
            setAnalysisResp({
              pattern: patterns,
              text,
              confidence
            });
          }
        });
    }
  }

  return (
    <Fragment>
      <div>
        {isCameraOpen && (
          <Camera
            onCapture={(blob: any) => {
              setScreenImage(blob);
              setImageObjectUrl(URL.createObjectURL(blob));
              analyseImage();
            }}
            onClear={() => setScreenImage(undefined)}
          />
        )}

        {screenImage && (
          <div>
            <h2>Preview</h2>
            <img src={screenImage && imageObjectUrl} />
          </div>
        )}

        <div>
          <button onClick={() => setIsCameraOpen(true)}>Open Camera</button>
          <button
            onClick={() => {
              setIsCameraOpen(false);
              setScreenImage(undefined);
            }}
          >
            Close Camera
          </button>
        </div>
      </div>
    </Fragment>);
}
export default App;
