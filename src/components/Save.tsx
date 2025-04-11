import { Col, Nav, NavLink, Row } from "react-bootstrap"
import { saveData } from "../type"
import { useState } from "react"
import Header from "./Header"
import Bank from "./Bank"

type SaveProps = {
    save: saveData
}

export default function Save(props: SaveProps) {

    const [selectedCategory, setSelectedCategory] = useState(0);

    const changeSelected = (category: number) => {
        setSelectedCategory(category);
    }

    const renderCategory = (selected: number) => {
        switch(selected) {
            case 0:
                return <Header save={props.save}></Header>;
            case 1:
                return <Bank save={props.save}></Bank>;
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