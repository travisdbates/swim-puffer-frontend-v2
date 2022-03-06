import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Main from "./components/Main";
import Signup from "./components/Signup";
import ScrollToTop from "./components/ScrollTop";
import Home from "./pages/Home/Home";
import FAQ from "./pages/FAQ/FAQ";
import Callback from "./pages/Callback/Callback";
import AdminDashboard from "./pages/AdminDash/AdminDashboard";
import Auth from "./utils/auth";
import SignupSwimTeam from "./components/SignupSwimTeam";
const auth = new Auth();

const handleAuthentication = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
};

export default (props) => (
  <BrowserRouter>
    <ScrollToTop>
      <Switch>
        <Route
          path="/callback"
          render={(props) => {
            handleAuthentication(props);
            return <Callback {...props} />;
          }}
        />
        <Route exact path="/" component={Home} />
        <Route exact path="/faq" component={FAQ} />
        <Route exact path="/main" component={Main} />
        <Route exact path="/dash" component={Dashboard} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/signupswimteam" component={SignupSwimTeam} />
        <Route exact path="/admin" component={AdminDashboard} />
      </Switch>
    </ScrollToTop>
  </BrowserRouter>
);
