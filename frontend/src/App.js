import React, { /*useCallback, useMemo, useRef,*/ useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import RangeSlider from "./rangeSlider";

import './App.css';

function App() {
  const fileTypes = ["wav", "aiff", "mp3"];

  const [file1, setFile1] = useState(null)
  //const fileInput1 = useRef(null)

  const [file2, setFile2] = useState(null)
  //const fileInput2 = useRef(null)

  const [minVal, setMinVal] = useState(0)
  const [maxVal, setMaxVal] = useState(100)

  const setValues = (min, max) => {
    setMinVal(min);
    setMaxVal(max);
  }

  const upload = () => {
    var formData = new FormData();
    formData.append("file", file1);
    formData.append("file", file2);
    formData.append('start', minVal);
    formData.append('end', maxVal);
    console.log("file1", formData);
    console.log("start", minVal);
    console.log("end", maxVal);
    var request = new XMLHttpRequest();
    request.open("POST", "http://192.168.0.109:9000/upload", true);
    request.responseType = 'blob';
    request.onload = function (ev) {
      if (request.status === 200) {
        console.log('upload success');
        var blob = ev.target.response;
        var contentDispo = ev.target.getResponseHeader('Content-Disposition');
        console.log("contentDispo", contentDispo);
        saveBlob(blob, `${file1.name}-${minVal}-${maxVal}-${file2.name}`);
      } else {
        console.log("Error " + request.status + " occurred when trying to upload your file.<br />");
      }
    };

    request.send(formData);
  }

  function saveBlob(blob, fileName) {
    var a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = fileName;
    a.dispatchEvent(new MouseEvent('click'));
  }

  return (
    <div className="App">
      <header className="App-header">
          <FileUploader
            handleChange={(file) => setFile1(file)}
            name="file1"
            types={fileTypes}
          />
        <p>{file1 ? file1.name : "no files uploaded yet"}</p>
          <FileUploader
            handleChange={(file) => setFile2(file)}
            name="file2"
            types={fileTypes}
          />
        <p>{file2 ? file2.name : "no files uploaded yet"}</p>
        <RangeSlider min={0} max={100} thumbsize={15} setter={setValues} classes="additional-css-classes" />

        <button onClick={() => upload()}>Upload</button>

        {/*
        <div>
          <h3>Download Section</h3> <br/>
          <form action="/download" method="get">
              <button type="submit">Download</button>
          </form>
        </div>
        */}
      </header>
    </div>
  );
}

export default App;
