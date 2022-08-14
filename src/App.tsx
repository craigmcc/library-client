// App -----------------------------------------------------------------------

// Overall implementation of the entire client application.

// External Modules ----------------------------------------------------------

import React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

// Internal Modules ----------------------------------------------------------

import Navigation from "./app/Navigation";
import Home from "./features/home/Home";
import LibraryView from "./features/library/LibraryView";
import UserView from "./features/user/UserView";

// Public Objects ------------------------------------------------------------

function App() {
  return (
      <>
          <ToastContainer
              autoClose={5000}
              closeOnClick={true}
              draggable={false}
              hideProgressBar={false}
              newestOnTop={false}
              position="top-right"
              theme="colored"
          />
        <Router>
          <Routes>
              <Route path="/" element={<Navigation/>}>
                <Route path="" element={<Home/>}/>
                <Route path="/libraries" element={<LibraryView/>}/>
                <Route path="/users" element={<UserView/>}/>
              </Route>
          </Routes>
        </Router>
      </>
  );
}

export default App;
