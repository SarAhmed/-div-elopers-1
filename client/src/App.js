import React from 'react';
import { BrowserRouter, Router, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import HOD from "./components/routes/hod/hod.js";
import HR from './components/routes/hr/hr.js';
//Test pickers
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
function App() {
  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <BrowserRouter>
          <div className="App">
            <Route exact path="/" component={Login} />
            <Route exact path="/hod" component={HOD} />
            <Route exact path="/hr" component={HR} />
          </div>
        </BrowserRouter>
    </MuiPickersUtilsProvider>
        
    </div>
  );
}

export default App;
