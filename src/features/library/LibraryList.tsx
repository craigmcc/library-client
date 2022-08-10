// LibraryList ---------------------------------------------------------------

// List of available Libraries.

// External Modules ----------------------------------------------------------

import React, {/*useContext, */useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import {PlusCircleFill} from "react-bootstrap-icons";
import {CheckBox, SearchBar} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import {allLibrariesParams, useAllLibrariesQuery} from "./LibraryApi";
import {HandleAction, HandleBoolean, HandleLibrary, HandleValue/*, Library*/} from "../../types";
import FetchingProgress from "../../components/FetchingProgress";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleAdd?: HandleAction;           // Handle request to add a Library [not allowed]
    handleEdit?: HandleLibrary;         // Handle request to edit a Library [not allowed]
}

// Component Details ---------------------------------------------------------

const LibraryList = (props: Props) => {

    const [active, setActive] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [params, setParams] = useState<allLibrariesParams>({});

    const { data, error, isFetching } = useAllLibrariesQuery(params);
    const libraries = data ? data : [];

    useEffect(() => {
        const theParams: allLibrariesParams = {};
        if (active) {
            theParams.active = true;
        }
        if (name.length > 0) {
            theParams.name = name;
        }
        setParams(theParams);
    }, [active, name]);

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

    // Set the current search value
    const handleChange: HandleValue = (theName) => {
        setName(theName);
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
                <Col className="col-6">
                    <SearchBar
                        autoFocus
                        handleChange={handleChange}
                        htmlSize={50}
                        label="Search for Libraries:"
                        placeholder="Search by all or part of name"
                    />
                </Col>
                <Col>
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
