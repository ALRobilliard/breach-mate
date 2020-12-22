import React, { Fragment, useState } from "react";
import { createWorker, PSM, OEM } from 'tesseract.js';
import './App.css';
import Camera from '../Camera/Camera';

interface IAnalysisResponse {
  text: string;
  confidence: number
}

const SPARSE_TEXT_OSD = "12";
const DEFAULT = 3;

function App() {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [screenImage, setScreenImage] = useState<Blob>();
  const [imageObjectUrl, setImageObjectUrl] = useState<string>();
  const [analysisResp, setAnalysisResp] = useState<string>();

  async function analyseImageAsync(imageObj: string) {
    // Init worker.
    const worker = createWorker();
    await worker.load();
    await worker.loadLanguage('osd');
    await worker.initialize('osd');
    await worker.setParameters({
      tessedit_char_whitelist: '0123456789ABCDEF',
      tessedit_pageseg_mode: SPARSE_TEXT_OSD as PSM,
      tessedit_ocr_engine_mode: DEFAULT as OEM
    });

    const { data: { text } } = await worker.recognize(imageObj);
    await worker.terminate();

    return text;
  }

  return (
    <Fragment>
      <div>
        {isCameraOpen && (
          <Camera
            onCapture={async (blob: any) => {
              setScreenImage(blob);
              setImageObjectUrl(URL.createObjectURL(blob))

              if (imageObjectUrl)
                setAnalysisResp(await analyseImageAsync(imageObjectUrl));
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
        <textarea value={analysisResp}></textarea>
      </div>
    </Fragment>);
}
export default App;
