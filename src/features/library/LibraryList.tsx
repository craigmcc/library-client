// LibraryList ---------------------------------------------------------------

// List of available Libraries.

// External Modules ----------------------------------------------------------

import React/*, {useContext, useEffect, useState}*/ from "react";
//import Button from "react-bootstrap/Button";
//import Container from "react-bootstrap/Container";
//import Col from "react-bootstrap/Col";
//import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

// Internal Modules ----------------------------------------------------------

import { useAllLibrariesQuery } from "../api/ApiSlice";
import { Library } from "../../types";

// Incoming Properties -------------------------------------------------------

export interface Props {
}

// Component Details ---------------------------------------------------------

const LibraryList = (props: Props) => {

    const { data } = useAllLibrariesQuery();
    const libraries = data ? data : [];

    return (
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
                >
                    <td>{library.name}</td>
                    <td>{library.active ? "Yes" : "No"}</td>
                    <td>{library.notes}</td>
                    <td>{library.scope}</td>
                </tr>
            ))}
            </tbody>
        </Table>
    )

}

export default LibraryList;
