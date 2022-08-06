// LibraryList ---------------------------------------------------------------

// List of available Libraries.

// External Modules ----------------------------------------------------------

import React, {/*useContext, useEffect, */useState} from "react";
//import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import {PlusCircleFill} from "react-bootstrap-icons";
import {CheckBox} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import { useAllLibrariesQuery } from "./LibraryApi";
import {HandleAction, HandleBoolean, HandleLibrary/*, Library*/} from "../../types";
import FetchingProgress from "../../components/FetchingProgress";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleAdd?: HandleAction;           // Handle request to add a Library [not allowed]
    handleEdit?: HandleLibrary;         // Handle request to edit a Library [not allowed]
}

// Component Details ---------------------------------------------------------

const LibraryList = (props: Props) => {

    const [active, setActive] = useState<boolean>(false);
    const { data, error, isFetching } = useAllLibrariesQuery( active ? {
        active: true,
    } : {});
    const libraries = data ? data : [];

    // Set the current active flag
    const handleActive: HandleBoolean = (theActive) => {
        setActive(theActive);
    }

    // Handle request to add a Library
    const handleAdd: HandleAction = () => {
        if (props.handleAdd) {
            props.handleAdd();
        }
    }

    // Handle request to edit a Library
    const handleEdit: HandleLibrary = (theLibrary) => {
        if (props.handleEdit) {
            props.handleEdit(theLibrary);
        }
    }

    return (
        <Container fluid id="LibraryList">
            <FetchingProgress
                error={error as Error}
                loading={isFetching}
                message="Fetching selected Libraries"
            />
            <Row className="mb-3">
                <Col className="text-start">
                    <span>TODO: Search Bar</span>
                </Col>
                <Col className="text-center">
                    <CheckBox
                        handleChange={handleActive}
                        label="Active Libraries Only?"
                        name="activeOnly"
                        value={active}
                    />
                </Col>
                <Col className="text-end">
                    <PlusCircleFill
                        color="primary"
                        onClick={handleAdd}
                        size={32}
                    />
                </Col>
            </Row>
            <Row className="mb-3">
                <Table
                    bordered={false}
                    hover={true}
                    size="sm"
                    striped={true}
                >
                    <thead>
                    <tr className="table-secondary">
                        <th>Name</th>
                        <th>Active</th>
                        <th>Notes</th>
                        <th>Scope</th>
                    </tr>
                    </thead>
                    <tbody>
                    {libraries.map((library) => (
                        <tr className="table-default"
                            key={library.id}
                            onClick={props.handleEdit ? (() => handleEdit(library)) : undefined}
                        >
                            <td>{library.name}</td>
                            <td>{library.active ? "Yes" : "No"}</td>
                            <td>{library.notes}</td>
                            <td>{library.scope}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Row>
            <Row className="mb-3">
                <Col className="text-end">
                    <PlusCircleFill
                        color="primary"
                        onClick={handleAdd}
                        size={32}
                    />
                </Col>
            </Row>
        </Container>
    )

}

export default LibraryList;
