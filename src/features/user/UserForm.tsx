// UserForm ------------------------------------------------------------------

// Detail editing form for User objects.

// External Modules ----------------------------------------------------------

import React, {useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import {CaretLeftSquare} from "react-bootstrap-icons";
import {SubmitHandler, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {CheckBoxField, TextField} from "@craigmcc/shared-react";

// Internal Modules ----------------------------------------------------------

import {HandleAction, HandleUser, User} from "../../types";
import {validateUserUsernameUnique} from "../../util/AsyncValidators";

// Incoming Properties ------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // First element receive autoFocus? [false]
    handleInsert?: HandleUser;          // Handle User insert request [not allowed]
    handleRemove?: HandleUser;          // Handle User remove request [not allowed]
    handleReturn: HandleAction;         // Handle return to previous view
    handleUpdate?: HandleUser;          // Handle User update request [not allowed]
    user: User;                         // Initial values (id < 0 for adding)
}

// Component Details ---------------------------------------------------------

const UserForm = (props: Props) => {

    const [adding] = useState<boolean>(!props.user.id);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);

    const onConfirm = (): void => {
        setShowConfirm(true);
    }

    const onConfirmNegative = (): void => {
        setShowConfirm(false);
    }

    const onConfirmPositive = (): void => {
        setShowConfirm(false);
        if (props.handleRemove) {
            props.handleRemove(props.user)
        }
    }

    const onSubmit: SubmitHandler<User> = (values) => {
        const theUser: User = {
            ...props.user,
            ...values,
        };
        if (adding && props.handleInsert) {
            props.handleInsert(theUser);
        } else if (!adding && props.handleUpdate) {
            props.handleUpdate(theUser);
        }
    }

    // NOTE - there is no server-side equivalent for this because there is
    // not an individual logged-in user performing the request
    const validateRequestedScope = (requested: string | undefined): boolean => {
        return true; // NOTE - must implement server side somehow
    }

    const validationSchema = Yup.object().shape({
        active: Yup.boolean(),
        googleBooksApiKey: Yup.string()
            .nullable(),
        name: Yup.string()
            .required("Name is required"),
        password: Yup.string()
            .nullable(), // NOTE - required on add, optional on edit
        scope: Yup.string()
            .required("Scope is required")
            .test("allowed-scope",
                "You are not allowed to assign a scope you do not possess",
                function(value) {
                    return validateRequestedScope(value);
                }),
        username: Yup.string()
            .required("Username is required")
            .test("unique-username",
                "That username is already in use",
                async function (this) {
                    return validateUserUsernameUnique(this.parent);
                }),
    });

    const {formState: {errors}, handleSubmit, register} = useForm<User>({
        defaultValues: { ...props.user },
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
    });

    return (

        <>

            {/* Details Form */}
            <Container id="UserDetails">

                <Row className="mb-3">
                    <Col className="text-start">
                        <CaretLeftSquare
                            onClick={props.handleReturn}
                            size={32}
                        />
                    </Col>
                    <Col className="text-center">
                        <strong>
                            {(adding)? (
                                <span>Add New</span>
                            ) : (
                                <span>Edit Existing</span>
                            )}
                            &nbsp;User
                        </strong>
                    </Col>
                    <Col className="text-end">
                    </Col>
                </Row>

                <Form
                    id="UserDetails"
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                >

                    <Row className="g-3 mb-3" id="nameScopeRow">
                        <TextField
                            autoFocus={(props.autoFocus !== undefined) ? props.autoFocus : undefined}
                            errors={errors}
                            label="Name:"
                            name="name"
                            register={register}
                            valid="Name of this User."
                        />
                        <TextField
                            errors={errors}
                            label="Scope:"
                            name="scope"
                            register={register}
                            valid="Space-separated scope(s) granted to this user."
                        />
                    </Row>

                    <Row className="g-3 mb-3" id="usernamePasswordRow">
                        <TextField
                            errors={errors}
                            label="Username:"
                            name="username"
                            register={register}
                            valid="Login username of this User (must be unique)."
                        />
                        <TextField
                            errors={errors}
                            label="Password:"
                            name="password"
                            register={register}
                            valid="Login password of this User (set this ONLY on new Users or if you want to change the password for an existing User)."
                        />
                    </Row>

                    <Row className="g-3 mb-3" id="googleBooksApiKeyActiveRow">
                        <TextField
                            errors={errors}
                            label="Google Books API Key:"
                            name="googleBooksApiKey"
                            register={register}
                            valid="This User's API Key for Google Books (if any)."
                        />
                        <CheckBoxField
                            errors={errors}
                            label="Active?"
                            name="active"
                            register={register}
                        />
                    </Row>

                    <Row className="g-3 mb-3">
                        <Col className="text-start">
                            <Button
                                disabled={!props.handleInsert && !props.handleUpdate}
                                size="sm"
                                type="submit"
                                variant="primary"
                            >
                                Save
                            </Button>
                        </Col>
                        <Col className="text-end">
                            <Button
                                disabled={adding || !props.handleRemove}
                                onClick={onConfirm}
                                size="sm"
                                type="button"
                                variant="danger"
                            >
                                Remove
                            </Button>
                        </Col>
                    </Row>

                </Form>

            </Container>

            {/* Remove Confirm Modal */}
            <Modal
                animation={false}
                backdrop="static"
                centered
                dialogClassName="bg-danger"
                onHide={onConfirmNegative}
                show={showConfirm}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>WARNING:  Potential Data Loss</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Removing this User is not reversible, and
                        <strong>
                            &nbsp;will also remove ALL related information.
                        </strong>.
                    </p>
                    <p>Consider marking this User as inactive instead.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={onConfirmPositive}
                        size="sm"
                        type="button"
                        variant="danger"
                    >
                        Remove
                    </Button>
                    <Button
                        onClick={onConfirmNegative}
                        size="sm"
                        type="button"
                        variant="primary"
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

        </>

    )
}

export default UserForm;
