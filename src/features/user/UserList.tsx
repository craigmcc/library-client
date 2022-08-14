// UserList -----------------------------------------------------------------

// List Users that match search criteria, offering callbacks for adding,
// editing, and removing Users.

// External Modules ----------------------------------------------------------

import React, {/*useContext, */useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import {PlusCircleFill} from "react-bootstrap-icons";
import {skipToken} from "@reduxjs/toolkit/query/react";
import {CheckBox, Pagination, SearchBar} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import {allUsersParams, useAllUsersQuery} from "./UserApi";
//import LoginContext from "../login/LoginContext";
import FetchingProgress from "../../components/FetchingProgress";
import {HandleAction, HandleBoolean, HandleUser, HandleValue, User} from "../../types";
import logger from "../../util/ClientLogger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleAdd?: HandleAction;           // Handle request to add a User [not allowed]
    handleEdit?: HandleUser;            // Handle request to edit a User [not allowed]
}

// Component Details ---------------------------------------------------------

const UserList = (props: Props) => {

//    const loginContext = useContext(LoginContext);

    const [active, setActive] = useState<boolean>(false);
    const [availables, setAvailables] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(100);
    const [username, setUsername] = useState<string>("");

    const [params, setParams] = useState<allUsersParams | null>(null);

    const {data: users, error, isFetching} = useAllUsersQuery(params ?? skipToken);

    useEffect(() => {

        const theParams: allUsersParams = {
            limit: pageSize,
            offset: (currentPage - 1) * pageSize,
        };
        if (active) {
            theParams.active = true;
        }
        if (username.length > 0) {
            theParams.username = username;
        }
        logger.debug({
            context: "UserList.useEffect",
            params: theParams,
        });
        setParams(theParams);

        //        const isSuperuser = loginContext.validateScope(Scope.SUPERUSER);
        const isSuperuser = true; // TODO - fix when loginContext is available
        if (isSuperuser && users) {
            setAvailables(users);
        } else {
            setAvailables([]);
        }

    }, [/*loginContext, loginContext.data.loggedIn,*/ users,
        active, availables, currentPage, pageSize, username]);

    // Set the current active flag
    const handleActive: HandleBoolean = (theActive) => {
        setActive(theActive);
    }

    // Handle request to add a User
    const handleAdd: HandleAction = () => {
        if (props.handleAdd) {
            props.handleAdd();
        }
    }

    // Set the current search value
    const handleChange: HandleValue = (theSearchText) => {
        setUsername(theSearchText);
    }

    // Handle request to edit a User
    const handleEdit: HandleUser = (theUser) => {
        if (props.handleEdit) {
            props.handleEdit(theUser);
        }
    }

    // Increment the current page
    const handleNext: HandleAction = () => {
        setCurrentPage(currentPage + 1);
    }

    // Decrement the current page
    const handlePrevious: HandleAction = () => {
        setCurrentPage(currentPage - 1);
    }

    return (
        <Container fluid id="UserList">

            <FetchingProgress
                error={error as Error}
                loading={isFetching}
                message="Fetching selected Users"
            />

            <Row className="mb-3">
                <Col className="col-6">
                    <SearchBar
                        autoFocus
                        handleChange={handleChange}
                        htmlSize={50}
                        label="Search For Users:"
                        placeholder="Search by all or part of username"
                    />
                </Col>
                <Col>
                    <CheckBox
                        handleChange={handleActive}
                        label="Active Users Only?"
                        name="activeOnly"
                        value={active}
                    />
                </Col>
                <Col className="text-end">
                    <Pagination
                        currentPage={currentPage}
                        handleNext={handleNext}
                        handlePrevious={handlePrevious}
                        lastPage={(availables.length === 0) ||
                            (availables.length < pageSize)}
                        variant="secondary"
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

            <Row className="g-2">
                <Table
                    bordered={true}
                    hover={true}
                    size="sm"
                    striped={true}
                >

                    <thead>
                    <tr className="table-secondary">
                        <th scope="col">Username</th>
                        <th scope="col">Active</th>
                        <th scope="col">Name</th>
                        <th scope="col">Scope</th>
                    </tr>
                    </thead>

                    <tbody>
                    {availables.map((user) => (
                        <tr
                            className="table-default"
                            key={user.id}
                            onClick={props.handleEdit ? (() => handleEdit(user)) : undefined}
                        >
                            <td>{user.username}</td>
                            <td>{user.active ? "Yes" : "No"}</td>
                            <td>{user.name}</td>
                            <td>{user.scope}</td>
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

export default UserList;
