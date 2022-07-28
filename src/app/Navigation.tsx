// Navigation ----------------------------------------------------------------

// Top-level navigation menu, with support for react-router-dom@6.

// External Modules ----------------------------------------------------------

import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import {NavLink, Outlet} from "react-router-dom";

// Internal Modules ----------------------------------------------------------

const Navigation = () => {
    return (
        <>
            <Navbar
                bg="primary"
                className="mb-3"
                collapseOnSelect
                sticky="top"
                variant="dark"
            >
                <Navbar.Brand className="ms-2">
                    <img
                        alt="Library Management"
                        height={60}
                        src="./books.jpeg"
                        width={100}
                    />
                    <span className="ms-2">Library Client</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse>
                    <Nav className="me-auto">
                        <NavLink className="nav-link" to="/">Home</NavLink>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <Outlet/>
        </>
    )

}

export default Navigation;
