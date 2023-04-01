import {
  BrowserRouter as Router, Route, Switch
} from "react-router-dom";
import Home from "./home/home";
import ViewOrder from "./view-order/view-order";

export function App() {
  return (
    <div className="container">
      <div className="card">
        <div className="card-content">
          <div className="content">
            <h1>Orders Operation Portal</h1>
            <Router>
              <Switch>
                <Route path="/orders/:id">
                  <ViewOrder></ViewOrder>
                </Route>
                <Route path="/">
                  <Home></Home>
                </Route>
              </Switch>
            </Router>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
