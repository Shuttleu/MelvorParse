import { Col, Form, InputGroup, Row } from "react-bootstrap";
import { item, saveData } from "../type";

type settingsProps = {
    save: saveData;
    updateItem: (path: string, array: boolean, newValue: any) => void;
    items: Map<string, Array<item>>;
}

export default function Settings(props: settingsProps) {
    return (
        <>
            <Row>
                <Col>
                    <h1>Settings</h1>
                </Col>
            </Row>
            <Row>
                <Col xs="12">
                    { Object.entries(props.save.settings).map((setting) => {
                        
                        return (
                            <InputGroup className="mb-3 p-2">
                                <InputGroup.Text style={{width:"50%"}}>{setting[0]}</InputGroup.Text>
                               {
                                    typeof setting[1] == "string" ?
                                    <Form.Control
                                        onChange={(e) => props.updateItem("settings."+setting[0], false, e.target.value)}
                                        type="text"
                                        value={setting[1]}
                                        size="sm"
                                    /> : typeof setting[1] == "number" ?
                                    <Form.Control
                                        onChange={(e) => props.updateItem("settings."+setting[0], false, e.target.value)}
                                        type="number"
                                        value={setting[1]}
                                        size="sm"
                                    /> : typeof setting[1] == "boolean" ?
                                    <Form.Check
                                        onChange={(e) => props.updateItem("settings."+setting[0], false, e.target.value)}
                                        type="switch"
                                        checked={setting[1]}
                                    /> : undefined
                                    
                                }
                                
                            </InputGroup>
                        )
                    })}
                </Col>
            </Row>
        </>
    )
}