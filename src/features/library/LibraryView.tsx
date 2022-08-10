// LibraryView ---------------------------------------------------------------

// Consolidated view for listing and editing Library objects.

// External Modules ----------------------------------------------------------

import React, {/*useContext, */useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import {
    useInsertLibraryMutation,
    useRemoveLibraryMutation,
    useUpdateLibraryMutation
} from "./LibraryApi";
//import LibraryContext from "./LibraryContext";
import LibraryForm from "./LibraryForm";
import LibraryList from "./LibraryList";
//import LoginContext from "../login/LoginContext";
import {HandleAction, HandleLibrary, Library/*, Scope*/} from "../../types";
import MutatingProgress from "../../components/MutatingProgress";
import logger from "../../util/ClientLogger";

// Component Details ---------------------------------------------------------

enum View {
    DETAILS = "Details",
    OPTIONS = "Options",
}

const LibraryView = () => {

//    const libraryContext = useContext(LibraryContext);
//    const loginContext = useContext(LoginContext);

    const EMPTY: Library = {
        id: null,
        active: true,
        name: null,
        notes: null,
        scope: null,
    };

    const [canInsert, setCanInsert] = useState<boolean>(false);
    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
    const [library, setLibrary] = useState<Library>(EMPTY);
    const [message, setMessage] = useState<string>("");
    const [view, setView] = useState<View>(View.OPTIONS);

    const [insertLibrary, {error: insertError, isLoading: insertLoading}] = useInsertLibraryMutation();
    const [removeLibrary, {error: removeError, isLoading: removeLoading}] = useRemoveLibraryMutation();
    const [updateLibrary, {error: updateError, isLoading: updateLoading}] = useUpdateLibraryMutation();

    useEffect(() => {

        logger.debug({
            context: "LibraryView.useEffect",
            library: library,
            view: view.toString(),
        });

//        const isSuperuser = loginContext.validateScope(Scope.SUPERUSER);
        const isSuperuser = true; // TODO - refine once login supported
        setCanInsert(isSuperuser);
        setCanRemove(isSuperuser);
        setCanUpdate(isSuperuser);

    }, [/*loginContext, loginContext.data.loggedIn,*/
        library, view]);

    // Create an empty Library to be added
    const handleAdd: HandleAction = () => {
        const theLibrary: Library = {
            ...EMPTY,
        };
        setLibrary(theLibrary);
        setView(View.DETAILS);
    }

    // Handle selection of a Library to edit details
    const handleEdit: HandleLibrary = (theLibrary) => {
        setLibrary(theLibrary);
        setView(View.DETAILS);
    }

    // Handle insert of a new Library
    const handleInsert: HandleLibrary = async (theLibrary) => {
        setMessage(`Inserting Library '${theLibrary.name}`);
        await insertLibrary(theLibrary);
        setLibrary({ ...EMPTY});
        setView(View.OPTIONS);
    }

    // Handle remove of an existing Library
    const handleRemove: HandleLibrary = async (theLibrary) => {
        setMessage(`Removing Library '${theLibrary.name}')`);
        await removeLibrary({ libraryId: theLibrary.id! });
        setLibrary({ ...EMPTY});
        setView(View.OPTIONS);
    }

    // Handle return from View.DETAILS to redisplay View.OPTIONS
    const handleReturn: HandleAction = () => {
        setLibrary({ ...EMPTY});
        setView(View.OPTIONS);
    }

    // Handle request to update an existing Library
    const handleUpdate: HandleLibrary = async (theLibrary) => {
        setMessage(`Updating Library '${theLibrary.name}`);
        await updateLibrary({libraryId: theLibrary.id!, library: theLibrary});
        setLibrary({ ...EMPTY});
        setView(View.OPTIONS);
    }

    return (
        <>

            <MutatingProgress
                error={insertError as Error}
                executing={insertLoading}
                message={message}
            />
            <MutatingProgress
                error={removeError as Error}
                executing={removeLoading}
                message={message}
            />
            <MutatingProgress
                error={updateError as Error}
                executing={updateLoading}
                message={message}
            />

            {(view === View.DETAILS) ? (
                <LibraryForm
                    autoFocus
                    handleInsert={canInsert ? handleInsert : undefined}
                    handleRemove={canRemove ? handleRemove : undefined}
                    handleReturn={handleReturn}
                    handleUpdate={canUpdate ? handleUpdate : undefined}
                    library={library}
                />
            ) : null }

            {(view === View.OPTIONS) ? (
                <LibraryList
                    handleAdd={handleAdd}
                    handleEdit={handleEdit}
                />
            ) : null }

        </>
    )

}

export default LibraryView;
