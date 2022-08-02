// App -----------------------------------------------------------------------

// Overall implementation of the entire client application.

// External Modules ----------------------------------------------------------

import React from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Internal Modules ----------------------------------------------------------

import Navigation from "./app/Navigation";
import Home from "./features/home/Home";
import LibraryView from "./features/library/LibraryView";

// Public Objects ------------------------------------------------------------

function App() {
  return (
      <>
        <Router>
          <Routes>
              <Route path="/" element={<Navigation/>}>
                <Route path="" element={<Home/>}/>
                <Route path="/libraries" element={<LibraryView/>}/>
              </Route>
          </Routes>
        </Router>
      </>
  );
}

export default App;
