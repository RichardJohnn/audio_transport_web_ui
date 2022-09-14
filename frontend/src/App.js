import React, { useCallback, useMemo, /*useRef,*/ useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import RangeSlider from "./rangeSlider";

import './App.css';

function App() {
  const fileTypes = ["wav", "aiff", "mp3"];

  //const [file1, setFile1] = useState(null)
  //const [file2, setFile2] = useState(null)
  //const fileInput1 = useRef(null)
  //const fileInput2 = useRef(null)

  //const handleChange = (file) => {
    //setFile1(file);
  //};

  return (
    <div className="App">
      <header className="App-header">
        {/*
        <FileUploader
          handleChange={(file) => setFile1(file)}
          name="file"
          types={fileTypes}
        />
        <FileUploader
          handleChange={(file) => setFile2(file)}
          name="file"
          types={fileTypes}
        />
        */}
        <form
          id='uploadForm'
          action='http://192.168.0.109:9000/upload'
          method='post'
          encType="multipart/form-data">
          <input type="file" name="file1" />
          <input type="file" name="file2" />
          <input type='submit' value='Upload!' />
        </form>
        <RangeSlider min={0} max={100} thumbsize={15} classes="additional-css-classes" />
        <div>
          <h3>Download Section</h3> <br/>
          <form action="/download" method="get">
              <button type="submit">Download</button>
          </form>
        </div>
      </header>
    </div>
  );
}

export default App;
