import React from "react";
import { Route, Redirect } from "react-router-dom";
import AuthHelper from '../utils/AuthHelper';

const querystring = (name, url = window.location.href) => {
    name = name.replace(/[[]]/g, "\\$&");

    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i");
    const results = regex.exec(url);

    if (!results) {
        return null;
    }
    if (!results[2]) {
        return "";
    }

    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export default ({ component: Component, props: Props, ...rest }) => {
    const redirect = querystring("redirect");
    const auth = new AuthHelper();
    return (
        <Route
            {...rest}
            render={props =>
                auth.loggedIn()
                    ? <Redirect to={redirect === "" || redirect === null ? "/" : redirect} />
                    : <Component {...props} {...Props} />}
        />);
};