// UserView ---------------------------------------------------------------

// Top-level view for managing User objects.

// External Modules ----------------------------------------------------------

import React, {/*useContext, */useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import UserForm from "./UserForm";
import UserList from "./UserList";
//import LoginContext from "../login/LoginContext";
import {HandleAction, HandleUser/*, Scope*/, User} from "../../types";
import MutatingProgress from "../../components/MutatingProgress";
import logger from "../../util/ClientLogger";
import {useInsertUserMutation, useRemoveUserMutation, useUpdateUserMutation} from "../user/UserApi";

// Component Details ---------------------------------------------------------

enum View {
    DETAILS = "Details",
    OPTIONS = "Options",
}

const UserView = () => {

//    const loginContext = useContext(LoginContext);

    const EMPTY: User = {
        id: null,
        active: true,
        googleBooksApiKey: null,
        name: null,
        password: null,
        scope: null,
        username: null,
    }

    const [canInsert, setCanInsert] = useState<boolean>(false);
    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [user, setUser] = useState<User>(EMPTY);
    const [view, setView] = useState<View>(View.OPTIONS);

    const [insertUser, {error: insertError, isLoading: insertLoading}] = useInsertUserMutation();
    const [removeUser, {error: removeError, isLoading: removeLoading}] = useRemoveUserMutation();
    const [updateUser, {error: updateError, isLoading: updateLoading}] = useUpdateUserMutation();

    useEffect(() => {

        logger.debug({
            context: "UserView.useEffect",
            user: user,
            view: view.toString(),
        });

//        const isSuperuser = loginContext.validateScope(Scope.SUPERUSER);
        const isSuperuser = true; // TODO - refine once login is supported
        setCanInsert(isSuperuser);
        setCanRemove(isSuperuser);
        setCanUpdate(isSuperuser);

    }, [/*loginContext, loginContext.data.loggedIn,*/
        user, view]);

    // Create an empty User to be added
    const handleAdd: HandleAction = () => {
        const theUser: User = {
            ...EMPTY,
        };
        setUser(theUser);
        setView(View.DETAILS);
    }

    // Handle selection of a User to edit details
    const handleEdit: HandleUser = (theUser) => {
        setUser(theUser);
        setView(View.DETAILS);
    }

    // Handle insert of a new User
    const handleInsert: HandleUser = async (theUser) => {
        setMessage(`Inserting User '${theUser.username}'`);
        await insertUser(theUser);
        setView(View.OPTIONS);
    }

    // Handle remove of an existing User
    const handleRemove: HandleUser = async (theUser) => {
        setMessage(`Removing User '${theUser.username}'`);
        await removeUser({ userId: theUser.id! });
        setView(View.OPTIONS);
    }

    // Handle return from View.DETAILS to redisplay View.OPTIONS
    const handleReturn: HandleAction = () => {
        setUser({ ...EMPTY});
        setView(View.OPTIONS);
    }

    // Handle request to update an existing User
    const handleUpdate: HandleUser = async (theUser) => {
        setMessage(`Updating User '${theUser.username}'`);
        await updateUser({userId: theUser.id!, user: theUser});
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
                <UserForm
                    autoFocus
                    handleInsert={canInsert ? handleInsert : undefined}
                    handleRemove={canRemove ? handleRemove : undefined}
                    handleReturn={handleReturn}
                    handleUpdate={canUpdate ? handleUpdate : undefined}
                    user={user}
                />
            ) : null }

            {(view === View.OPTIONS) ? (
                <UserList
                    handleAdd={handleAdd}
                    handleEdit={handleEdit}
                />
            ) : null }

        </>
    )

}

export default UserView;
