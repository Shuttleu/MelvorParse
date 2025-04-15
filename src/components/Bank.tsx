import { Button, ButtonGroup, ButtonToolbar, Col, Form, InputGroup, Nav, NavLink, Pagination, Row } from "react-bootstrap";
import { saveData } from "../type"
import { useState } from "react";

type tabsProps = {
    save: saveData;
    changeBankItem: (path: string, array: boolean, newValue: any) => void;
    removeBankItem: (path: string, array: boolean) => void;
}

type defaultTabsProps = {
    save: saveData;
}

type bankProps = {
    save: saveData;
    changeBankItem: (path: string, array: boolean, newValue: any) => void;
    removeBankItem: (path: string, array: boolean) => void;
}

function Tabs(props: tabsProps) {

    const [currentTab, setCurrentTab] = useState(0);

    const processTab = (tab: Map<string, number>) => {
        var items: Array<{item: string, qty: number}> = [];
        tab.forEach((qty, item) => {
            items.push({item: item, qty: qty})
        })
        return items;
    }

    return (
        <>
            <Row>
                <Col><h1>Tabs</h1></Col>
                <Col>
                    <Pagination>
                        { props.save.bank.tabs.map((_, tabNumber) => 
                            <Pagination.Item onClick={() => setCurrentTab(tabNumber)} key={tabNumber} activeLabel="" active={tabNumber === currentTab}>
                                {tabNumber+1}
                            </Pagination.Item>
                        ) }
                    </Pagination>
                </Col>
            </Row>
            <Row>
                { processTab(props.save.bank.tabs[currentTab]).map((item) => {
                    return (
                        <Col xs={12} lg={6}>
                            <InputGroup className="mb-3">
                                <InputGroup.Text style={{width: "60%"}}>{item.item}</InputGroup.Text>
                                <Form.Control
                                    onChange={(e) => props.changeBankItem("bank.tabs."+currentTab+"."+item.item, false, e.target.value)}
                                    type="number"
                                    value={item.qty}
                                />
                                <InputGroup.Text onClick={() => props.removeBankItem("bank.tabs."+currentTab+"."+item.item, false)}>X</InputGroup.Text>
                            </InputGroup>
                        </Col>
                    )
                })}

            </Row>
        </>
    )
}
function DefaultTabs(props: tabsProps) {

    const [currentTab, setCurrentTab] = useState(0);

    const processTab = (tab: Map<string, number>) => {
        var items: Array<{item: string, tab: number}> = [];
        tab.forEach((qty, item) => {
            items.push({item: item, tab: qty})
        })
        return items;
    }

    return (
        <>
            <Row>
                <Col><h1>Default Tabs</h1></Col>
                <Col>
                    <Pagination>
                        { props.save.bank.tabs.map((_, tabNumber) => 
                            <Pagination.Item onClick={() => setCurrentTab(tabNumber)} key={tabNumber} activeLabel="" active={tabNumber === currentTab}>
                                {tabNumber+1}
                            </Pagination.Item>
                        ) }
                    </Pagination>
                </Col>
            </Row>
            <Row>
                { processTab(props.save.bank.defaultTabs).map((item) => {
                    if (item.tab == currentTab)
                        return (
                            <Col xs={12} lg={6}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text style={{width: "75%"}}>{item.item.split(":")[1].replace(/_/g, " ")}</InputGroup.Text>
                                    <InputGroup.Text onClick={() => props.removeBankItem("bank.defaultTabs."+item.item, false)}>X</InputGroup.Text>
                                </InputGroup>
                            </Col>
                        )
                })}

            </Row>
        </>
    )
}
function SortOrder(props: tabsProps) {

    return (
        <>
            <Row>
                <Col><h1>Sort Order</h1></Col>
            </Row>
            <Row>
                { props.save.bank.sortOrder.map((item, index) => {
                    return (
                        <Col xs={12} lg={6}>
                            <InputGroup className="mb-3">
                                <InputGroup.Text style={{width: "75%"}}>{item.split(":")[1].replace(/_/g, " ")}</InputGroup.Text>
                                <InputGroup.Text onClick={() => props.removeBankItem("bank.sortOrder."+index, true)}>X</InputGroup.Text>
                            </InputGroup>
                        </Col>
                    )
                })}

            </Row>
        </>
    )
}
function LockedItems(props: tabsProps) {

    return (
        <>
            <Row>
                <Col><h1>Locked Items</h1></Col>
            </Row>
            <Row>
                { props.save.bank.lockedItems.map((item, index) => {
                    return (
                        <Col xs={12} lg={6}>
                            <InputGroup className="mb-3">
                                <InputGroup.Text style={{width: "75%"}}>{item.split(":")[1].replace(/_/g, " ")}</InputGroup.Text>
                                <InputGroup.Text onClick={() => props.removeBankItem("bank.lockedItems."+index, true)}>X</InputGroup.Text>
                            </InputGroup>
                        </Col>
                    )
                })}

            </Row>
        </>
    )
}
function GlowingIcons(props: tabsProps) {

    return (
        <>
            <Row>
                <Col><h1>Glowing Icons</h1></Col>
            </Row>
            <Row>
                { props.save.bank.glowing.map((item, index) => {
                    return (
                        <Col xs={12} lg={6}>
                            <InputGroup className="mb-3">
                                <InputGroup.Text style={{width: "75%"}}>{item.split(":")[1].replace(/_/g, " ")}</InputGroup.Text>
                                <InputGroup.Text onClick={() => props.removeBankItem("bank.glowing."+index, true)}>X</InputGroup.Text>
                            </InputGroup>
                        </Col>
                    )
                })}

            </Row>
        </>
    )
}
function TabIcons(props: tabsProps) {

    const ProcessItems = (tab: Map<number, string>) => {
        var items: Array<{item: string, tab: number}> = [];
        tab.forEach((item, tab) => {
            items.push({item: item, tab: tab})
        })
        return items;
    }

    return (
        <>
            <Row>
                <Col><h1>Tab Icons</h1></Col>
            </Row>
            <Row>
                { ProcessItems(props.save.bank.icons).map((item, index) => {
                    return (
                        <Col xs={12} lg={6}>
                            <InputGroup className="mb-3">
                            <InputGroup.Text style={{width: "75%"}}>{item.item.split(":")[1].replace(/_/g, " ")}</InputGroup.Text>
                                <Form.Control
                                    readOnly
                                    type="number"
                                    value={item.tab}
                                />
                                <InputGroup.Text onClick={() => props.removeBankItem("bank.glowing."+index, true)}>X</InputGroup.Text>
                            </InputGroup>
                        </Col>
                    )
                })}

            </Row>
        </>
    )
}

export default function Bank (props: bankProps) {

    const [bankCategory, setBankCategory] = useState(0);

    const changeSelected = (category: number) => {
        setBankCategory(category);
    }
    
    const renderBank = (selected: number) => {
        switch(selected) {
            case 0:
                return <Tabs removeBankItem={props.removeBankItem} changeBankItem={props.changeBankItem} save={props.save}></Tabs>;
            case 1:
                return <DefaultTabs removeBankItem={props.removeBankItem} changeBankItem={props.changeBankItem} save={props.save}></DefaultTabs>;
            case 2:
                return <GlowingIcons removeBankItem={props.removeBankItem} changeBankItem={props.changeBankItem} save={props.save}></GlowingIcons>;
            case 3:
                return <LockedItems removeBankItem={props.removeBankItem} changeBankItem={props.changeBankItem} save={props.save}></LockedItems>;
            case 4:
                return <SortOrder removeBankItem={props.removeBankItem} changeBankItem={props.changeBankItem} save={props.save}></SortOrder>;
            case 5:
                return <TabIcons removeBankItem={props.removeBankItem} changeBankItem={props.changeBankItem} save={props.save}></TabIcons>;
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
                    <NavLink onClick={() => changeSelected(2)} eventKey="link-2">Glowing Icons</NavLink>
                    <NavLink onClick={() => changeSelected(3)} eventKey="link-3">Locked Items</NavLink>
                    <NavLink onClick={() => changeSelected(4)} eventKey="link-4">Sort Order</NavLink>
                    <NavLink onClick={() => changeSelected(5)} eventKey="link-5">Icons</NavLink>
                </Nav>
            </Col>
            <Col xs="10">
                { renderBank(bankCategory) }
            </Col>
        </Row>
    )
}