import { useState } from "react";
import { parseString } from "./reader.ts"
import { parseSave } from "./writer.ts";
import { saveData } from "./type.ts";

function App() {

  const [saveString, setSaveString] = useState("");
  const [save, setSave] = useState<{saveData: saveData, initialSize: number}>();
  const [newSavestring, setNewSaveString] = useState("");

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
    if (save)
      setNewSaveString(parseSave(save.saveData, save.initialSize));
  }


  return (
    <div className="container py-4 px-3 mx-auto">
      <div className="row">
        <div className="col p-3">
          <h1>Melvor Idle Parser</h1>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="accordion" id="accordionExample">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                  Save String
                </button>
              </h2>
              <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <textarea className="form-control" aria-label="With textarea" style={{height: "calc(100vh - 400px)"}} value={saveString} onChange={e => {setSaveString(e.target.value); setSave(parseString(e.target.value))}}></textarea>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                  Parsed Save File
                </button>
              </h2>
              <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                <textarea className="form-control" aria-label="With textarea" readOnly style={{height: "calc(100vh - 400px)"}} value={parsedString()}></textarea>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree" onClick={generateSave}>
                  New Save String
                </button>
              </h2>
              <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                <textarea className="form-control" aria-label="With textarea" style={{height: "calc(100vh - 400px)"}} value={newSavestring} readOnly></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
