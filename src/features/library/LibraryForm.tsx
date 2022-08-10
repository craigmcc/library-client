// Library -------------------------------------------------------------------

// Detail editing form for Library objects.

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

import {HandleAction, HandleLibrary, Library} from "../../types";
import {validateLibraryNameUnique} from "../../util/AsyncValidators";
import {validateLibraryScope} from "../../util/ApplicationValidators";

// Incoming Properties ------------------------------------------------------

export interface Props {
    autoFocus?: boolean;                // First element receive autoFocus? [false]
    handleInsert?: HandleLibrary;       // Handle Library insert request [not allowed]
    handleRemove?: HandleLibrary;       // Handle Library remove request [not allowed]
    handleReturn: HandleAction;         // Handle return to options view
    handleUpdate?: HandleLibrary;       // Handle Library update request [not allowed
    library: Library;                   // Initial values (id < 0 for adding)
}

// Component Details ---------------------------------------------------------

const LibraryForm = (props: Props) => {

    const [adding] = useState<boolean>(!props.library.id);
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
            props.handleRemove(props.library);
        }
    }

    const onSubmit: SubmitHandler<Library> = (values) => {
        const theLibrary: Library = {
            ...props.library,
            ...values,
        };
        if (adding && props.handleInsert) {
            props.handleInsert(theLibrary);
        } else if (!adding && props.handleUpdate) {
            props.handleUpdate(theLibrary);
        }
    }

    const validationSchema = Yup.object().shape({
        active: Yup.boolean(),
        name: Yup.string()
            .nullable()                 // Groan -- Javascript thinks "" is falsy
            .required("Name is required")
            .test("unique-name",
                "That name is already in use",
                async function (this) {
                    return validateLibraryNameUnique(this.parent);
                }
            ),
        notes: Yup.string()
            .nullable(),
        scope: Yup.string()
            .nullable()                 // Groan -- Javascript thinks "" is falsy
            .required("Scope is required")
            .test("valid-scope",
                "Only alphanumeric (a-z, A-Z, 0-9) characters are allowed",
                function(value) {
                    return validateLibraryScope(value ? value : undefined);
                })
        /* NOTE - server side does not enforce this (no uniqueness constraint)
                    .test("unique-scope",
                        "That scope is already in use",
                        async function(value) {
                            return validateLibraryScopeUnique(ToModel.LIBRARY(this.parent));
                        }),
        */
    });

    const {formState: {errors}, handleSubmit, register} = useForm<Library>({
        defaultValues: { ...props.library },
        mode: "onBlur",
        resolver: yupResolver(validationSchema),
    });

    return (

        <>

            {/* Details Form */}
            <Container id="LibraryDetails">

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
                            &nbsp;Library
                        </strong>
                    </Col>
                    <Col className="text-end">
                    </Col>
                </Row>

                <Form
                    id="LibraryDetails"
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
                            valid="Name of this Library (must be unique)."
                        />
                        <TextField
                            errors={errors}
                            label="Scope:"
                            name="scope"
                            register={register}
                            valid="Permission scope of this Library (must be unique)."
                        />
                    </Row>

                    <Row className="g-3 mb-3" id="notesRow">
                        <TextField
                            errors={errors}
                            label="Notes:"
                            name="notes"
                            register={register}
                            valid="Miscellaneous notes about this Library."
                        />
                    </Row>

                    <Row className="g-3 mb-3" id="activeRow">
                        <CheckBoxField
                            errors={errors}
                            label="Active?"
                            name="active"
                            register={register}
                        />
                    </Row>

                    <Row className="mb-3">
                        <Col className="col-11">
                            <Button
                                disabled={!props.handleInsert && !props.handleUpdate}
                                size="sm"
                                type="submit"
                                variant="primary"
                            >
                                Save
                            </Button>
                        </Col>
                        <Col className="col-1">
                            <Button
                                disabled={adding || (!props.handleRemove)}
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
                        Removing this Library is not reversible, and
                        <strong>
                            &nbsp;will also remove ALL related information.
                        </strong>.
                    </p>
                    <p>Consider marking this Library as inactive instead.</p>
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

export default LibraryForm;
