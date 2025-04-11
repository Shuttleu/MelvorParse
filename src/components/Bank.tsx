import { Col, Nav, NavLink, Row } from "react-bootstrap";
import { saveData } from "../type"
import { useState } from "react";

type saveProps = {
    save: saveData;
}

function Tabs(props: saveProps) {

    const processTab = (tab: Map<number, number>) => {
        var items: Array<string> = [];
        tab.forEach((qty, item) => {
            items.push(item + ": " + qty.toLocaleString())
        })
        return items;
    }

    return (
        <>
            { props.save.bank.tabs.map((tab, number) => {
                return (
                    <>
                        <h1>Tab {number+1}</h1>
                        { 
                            processTab(tab).map((item) => {
                                return <p>{item}</p>
                            })
                        }
                    </>
                )
            })}
        </>
    )
}
function DefaultTabs(props: saveProps) {

    const processTab = (tab: Map<number, number>) => {
        var items: Array<string> = [];
        tab.forEach((qty, item) => {
            items.push(item + ": " + qty.toLocaleString())
        })
        return items;
    }

    return (
        <>
            { processTab(props.save.bank.defaultTabs).map((item) => {
                return <p>{item}</p>
            })}
        </>
    )
}

export default function Bank (props: saveProps) {

    const [bankCategory, setBankCategory] = useState(0);

    const changeSelected = (category: number) => {
        setBankCategory(category);
    }
    
    const renderBank = (selected: number) => {
        switch(selected) {
            case 0:
                return <Tabs save={props.save}></Tabs>;
            case 1:
                return <DefaultTabs save={props.save}></DefaultTabs>;
            default:
                return undefined;
        }
    }

    return (
        <Row>
            <Col xs="2">
            <Nav className="flex-column" variant="pills" defaultActiveKey="link-0">
                    <NavLink onClick={() => changeSelected(0)} eventKey="link-0">Tabs</NavLink>
                    <NavLink onClick={() => changeSelected(1)} eventKey="link-1">Default tabs</NavLink>
                    <NavLink onClick={() => changeSelected(2)} eventKey="link-2">Skills</NavLink>
                    <NavLink onClick={() => changeSelected(3)} eventKey="link-3">Combat</NavLink>
                    <NavLink onClick={() => changeSelected(4)} eventKey="link-4">Goblin Raid</NavLink>
                    <NavLink onClick={() => changeSelected(5)} eventKey="link-5">Settings</NavLink>
                </Nav>
            </Col>
            <Col xs="10">
                { renderBank(bankCategory) }
            </Col>
        </Row>
    )
}