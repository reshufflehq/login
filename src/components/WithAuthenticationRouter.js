import React from "react";
import { Route, Redirect } from "react-router-dom";
import AuthHelper from '../utils/AuthHelper';

export default ({ component: Component, props: Props, ...rest }) => {
    const auth = new AuthHelper();
    return (
        <Route
            {...rest}
            render={props =>
                auth.loggedIn()
                    ? <Component {...props} {...Props} />
                    : <Redirect to={`/login?redirect=${props.location.pathname}`} />
            } />
    );
};