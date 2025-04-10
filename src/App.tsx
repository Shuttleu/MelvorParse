import { useState } from "react";
import { parseString } from "./reader.ts"
import { parseSave } from "./writer.ts";

function App() {

  const [saveString, setSaveString] = useState("");

  const parsedString = (): string => {
    const parsed = parseString(saveString);
    return JSON.stringify(parsed.saveData, (_, value) => {
      if(value instanceof Map) {
        return Array.from(value.entries()).reduce((obj, [key, value]) => {
          // @ts-ignore
          obj[key] = value;
          return obj;
        }, {});
      } else if(value instanceof Set) {
        return Array.from(value);
      } else {
        return value;
      }
    }, 4);
  }

  const generateSave = () => {
    const save = parseString(saveString);
    console.log(parseSave(save.saveData, save.initialSize));
  }


  return (
    <div className="container py-4 px-3 mx-auto">
      <div className="row">
        <div className="col p-3">
          <h1>Melvor Idle Parser</h1>
        </div>
      </div>
      <div className="row">
        <div className="col p-3">
          <label className="form-label"><b>Save String</b></label>
          <textarea className="form-control" aria-label="With textarea" style={{height: "calc(100vh - 200px)"}} value={saveString} onChange={e => setSaveString(e.target.value)}></textarea>
        </div>
        <div className="col p-3">
          <label className="form-label"><b>Parsed</b></label>
          <textarea className="form-control" aria-label="With textarea" readOnly style={{height: "calc(100vh - 200px)"}} value={parsedString()}></textarea>
          <button className="btn" onClick={generateSave}>test</button>
        </div>
      </div>
    </div>
  )
}

export default App
