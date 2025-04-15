import { Col, Nav, NavLink, Row } from "react-bootstrap"
import { saveData, item } from "../type"
import { useState } from "react"
import Header from "./Header"
import Bank from "./Bank"
import Settings from "./Settings"

type SaveProps = {
    save: saveData;
    updateItem: (path: string, newValue: any, dataType: number) => void;
    addItem: (path: string, item: any, dataType: number) => void;
    removeItem: (path: string, dataType: number) => void;
    items: Map<string, Array<item>>;
}

export default function Save(props: SaveProps) {

    const [selectedCategory, setSelectedCategory] = useState(0);

    const changeSelected = (category: number) => {
        setSelectedCategory(category);
    }

    const getItem = (object: any, paths: Array<string>) => {
        if (paths.length > 1)
            return getItem(object[paths[0]], paths.slice(1))
        else
            return object[paths[0]];
    }   

    const printItem = (savePath: string) => {
        var paths = savePath.split(".");
        var object = getItem(props.save, paths)
        console.log(object);
    }

    const renderCategory = (selected: number) => {
        switch(selected) {
            case 0:
                return <Header save={props.save}></Header>;
            case 1:
                return <Bank items={props.items} removeItem={props.removeItem} updateItem={props.updateItem} addItem={props.addItem} save={props.save}></Bank>;
            case 5:
                return <Settings items={props.items} updateItem={props.updateItem} save={props.save}></Settings>;
            default:
                return undefined;
        }
    }

    return (
        <Row>
            <Col xs="2">
            <Nav className="flex-column" variant="pills" defaultActiveKey="link-0">
                <NavLink onClick={() => changeSelected(0)} eventKey="link-0">Header Data</NavLink>
                <NavLink onClick={() => changeSelected(1)} eventKey="link-1">Bank</NavLink>
                <NavLink onClick={() => changeSelected(2)} eventKey="link-2">Skills</NavLink>
                <NavLink onClick={() => changeSelected(3)} eventKey="link-3">Combat</NavLink>
                <NavLink onClick={() => changeSelected(4)} eventKey="link-4">Goblin Raid</NavLink>
                <NavLink onClick={() => changeSelected(5)} eventKey="link-5">Settings</NavLink>
                </Nav>
            </Col>
            <Col xs="10">
                { renderCategory(selectedCategory) }
            </Col>
        </Row>
    )
}