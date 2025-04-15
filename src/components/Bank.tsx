import { Button, Col, Form, InputGroup, Nav, NavLink, Overlay, OverlayTrigger, Pagination, Popover, Row } from "react-bootstrap";
import { saveData, item } from "../type"
import { MouseEventHandler, useRef, useState } from "react";

type tabsProps = {
    save: saveData;
    updateItem: (path: string, newValue: any, dataType: number) => void;
    addItem: (path: string, item: any, dataType: number) => void;
    removeItem: (path: string, dataType: number) => void;
    items: Map<string, Array<item>>;
}

type defaultTabsProps = {
    save: saveData;
}

type bankProps = {
    save: saveData;
    updateItem: (path: string, newValue: any, dataType: number) => void;
    addItem: (path: string, item: any, dataType: number) => void;
    removeItem: (path: string, dataType: number) => void;
    items: Map<string, Array<item>>;
}

function Tabs(props: tabsProps) {

    const [currentTab, setCurrentTab] = useState(0);
    const [showNewItem, setShowNewItem] = useState(false);
    const [target, setTarget] = useState(null);
    const [newItem, setNewItem] = useState("melvorD:Normal_Logs");

    const processTab = (tab: Map<string, number>) => {
        var items: Array<{item: string, qty: number}> = [];
        tab.forEach((qty, item) => {
            items.push({item: item, qty: qty})
        })
        return items;
    }

    const findItem = (item: string): item | undefined => {
        var foundItem = undefined;
        props.items.forEach((items) => {
            const found = items.find((possItem) => possItem.namespace == item);
            if (found != undefined)
                foundItem = found;
        });
        return foundItem;
    }

    const processItems = (category: Map<string, Array<item>>) => {
        var allItems: Array<item> = [];
        category.forEach((items) => {
            allItems = allItems.concat(items);
        })
        return allItems;
    }

    const clickNewItem = (e: any) => {
        setShowNewItem(!showNewItem);
        setTarget(e.target);
    }

    return (
        <>
            <Row>
            <Col><h1>Tabs</h1></Col>
            <Col><Overlay
                show={showNewItem}
                target={target}
                placement="bottom"
                containerPadding={20}
                rootClose={true}
                rootCloseEvent="click"
                onHide={ () => {setShowNewItem(false);}}
                >
                        <Popover>
                        <Popover.Header as="h3">Choose item to add</Popover.Header>
                        <Popover.Body>
                        <Form.Select value={newItem} onChange={(e) => setNewItem(e.target.value)} aria-label="Default select example">
                            {   processItems(props.items).map((item) => <option key={item.namespace} value={item.namespace}>{item.name}</option>) }
                            </Form.Select>
                            <Button className="mt-3" onClick={() => props.addItem("bank.tabs."+currentTab+"."+newItem, 1, 1)} style={{width: "100%"}}>Add</Button>
                        </Popover.Body>
                        </Popover>
                </Overlay>
                
                <Button onClick={clickNewItem} variant="secondary">Add item to bank</Button></Col>
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
                    const foundItem = findItem(item.item);
                    return (
                        <Col key={item.item} xs={6} lg={2} style={{textAlign: "center"}}>
                            <img width="50px" src={"https://cdn2-main.melvor.net/"+foundItem!.image}></img>
                            <InputGroup className="mb-3 p-2">
                                <Form.Control
                                    onChange={(e) => props.updateItem("bank.tabs."+currentTab+"."+item.item, e.target.value, 1)}
                                    type="number"
                                    value={item.qty}
                                    size="sm"
                                />
                                <InputGroup.Text onClick={() => props.removeItem("bank.tabs."+currentTab+"."+item.item, 1)}>X</InputGroup.Text>
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
                                    <InputGroup.Text onClick={() => props.removeItem("bank.defaultTabs."+item.item, 1)}>X</InputGroup.Text>
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
                                <InputGroup.Text onClick={() => props.removeItem("bank.sortOrder."+index, 0)}>X</InputGroup.Text>
                            </InputGroup>
                        </Col>
                    )
                })}

            </Row>
        </>
    )
}
function LockedItems(props: tabsProps) {

    const findItem = (item: string): item | undefined => {
        var foundItem = undefined;
        props.items.forEach((items) => {
            const found = items.find((possItem) => possItem.namespace == item);
            if (found != undefined)
                foundItem = found;
        });
        return foundItem;
    }

    return (
        <>
            <Row>
                <Col><h1>Locked Items</h1></Col>
            </Row>
            <Row>
                { props.save.bank.lockedItems.map((item, index) => {
                    const foundItem = findItem(item);
                    return (
                        <Col xs={6} lg={2} className="p-2">
                            <img width="50px" onClick={() => props.removeItem("bank.lockedItems."+index, 0)} src={"https://cdn2-main.melvor.net/"+foundItem!.image}></img>
                        </Col>
                    )
                })}

            </Row>
        </>
    )
}
function GlowingIcons(props: tabsProps) {

    const findItem = (item: string): item | undefined => {
        var foundItem = undefined;
        props.items.forEach((items) => {
            const found = items.find((possItem) => possItem.namespace == item);
            if (found != undefined)
                foundItem = found;
        });
        return foundItem;
    }

    return (
        <>
            <Row>
                <Col><h1>Glowing Icons</h1></Col>
            </Row>
            <Row>
                { props.save.bank.glowing.map((item, index) => {
                    const foundItem = findItem(item);
                    return (
                        <Col xs={6} lg={2} className="p-2">
                            <img width="50px" onClick={() => props.removeItem("bank.glowing."+index, 0)} src={"https://cdn2-main.melvor.net/"+foundItem!.image}></img>
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
                                <InputGroup.Text onClick={() => props.removeItem("bank.glowing."+index, 1)}>X</InputGroup.Text>
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
                return <Tabs items={props.items} removeItem={props.removeItem} updateItem={props.updateItem} addItem={props.addItem} save={props.save}></Tabs>;
            case 1:
                return <DefaultTabs items={props.items} removeItem={props.removeItem} updateItem={props.updateItem} addItem={props.addItem} save={props.save}></DefaultTabs>;
            case 2:
                return <GlowingIcons items={props.items} removeItem={props.removeItem} updateItem={props.updateItem} addItem={props.addItem} save={props.save}></GlowingIcons>;
            case 3:
                return <LockedItems items={props.items} removeItem={props.removeItem} updateItem={props.updateItem} addItem={props.addItem} save={props.save}></LockedItems>;
            case 4:
                return <SortOrder items={props.items} removeItem={props.removeItem} updateItem={props.updateItem} addItem={props.addItem} save={props.save}></SortOrder>;
            case 5:
                return <TabIcons items={props.items} removeItem={props.removeItem} updateItem={props.updateItem} addItem={props.addItem} save={props.save}></TabIcons>;
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