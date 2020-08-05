import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import ThreeView from './view1/ThreeView'
import Home from './Home'

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/three-view">
            <ThreeView />
          </Route>
          {/* Home path must go last - it matches everything */}
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
