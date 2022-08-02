// LibrarySegment ------------------------------------------------------------

// Consolidated segment for listing and editing Library objects.

// External Modules ----------------------------------------------------------

import React, {/*useContext, */useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

//import LibraryContext from "./LibraryContext";
import LibraryForm from "./LibraryForm";
import LibraryList from "./LibraryList";
//import LoginContext from "../login/LoginContext";
import {HandleAction, HandleLibrary, Library/*, Scope*/} from "../../types";
//import useMutateLibrary from "../../hooks/useMutateLibrary";
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
    const [view, setView] = useState<View>(View.OPTIONS);

/*
    const mutateLibrary = useMutateLibrary({
        alertPopup: false,
    });
*/

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
        logger.debug({
            context: "LibraryView.handleAdd",
            library: theLibrary,
        });
        setLibrary(theLibrary);
        setView(View.DETAILS);
    }

    // Handle selection of a Library to edit details
    const handleEdit: HandleLibrary = (theLibrary) => {
        logger.debug({
            context: "LibraryView.handleEdit",
            library: theLibrary,
        });
        setLibrary(theLibrary);
        setView(View.DETAILS);
    }

    // Handle insert of a new Library
    const handleInsert: HandleLibrary = async (theLibrary) => {
        alert(`LibraryView.handleInsert(${JSON.stringify(theLibrary)})`);
/*
        const inserted = await mutateLibrary.insert(theLibrary);
        logger.debug({
            context: "LibraryView.handleInsert",
            library: Abridgers.LIBRARY(inserted),
        });
*/
        setView(View.OPTIONS);
//        libraryContext.handleRefresh();
    }

    // Handle remove of an existing Library
    const handleRemove: HandleLibrary = async (theLibrary) => {
        alert(`LibraryView.handleRemove(${JSON.stringify(theLibrary)}`);
/*
        const removed = await mutateLibrary.remove(theLibrary);
        logger.debug({
            context: "LibraryView.handleRemove",
            library: Abridgers.LIBRARY(removed),
        });
*/
        setView(View.OPTIONS);
//        libraryContext.handleRefresh();
    }

    // Handle return from View.DETAILS to redisplay View.OPTIONS
    const handleReturn: HandleAction = () => {
        logger.debug({
            context: "LibraryView.handleReturn",
        });
        setView(View.OPTIONS);
    }

    // Handle request to update an existing Library
    const handleUpdate: HandleLibrary = async (theLibrary) => {
        alert(`LibraryView.handleUpdate(${JSON.stringify(theLibrary)})`);
/*
        const updated = await mutateLibrary.update(theLibrary);
        logger.debug({
            context: "LibraryView.handleUpdate",
            library: Abridgers.LIBRARY(updated),
        });
*/
        setView(View.OPTIONS);
//        libraryContext.handleRefresh();
    }

    return (
        <>

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
