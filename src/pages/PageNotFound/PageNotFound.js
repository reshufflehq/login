import React from "react";
import "./PageNotFound.css";
import { Link } from 'react-router-dom';

export default () =>
  <div id="notfound">
    <div className="notfound-bg"></div>
    <div className="notfound">
      <div className="notfound-404">
        <h1>404</h1>
      </div>
      <h2>Oops! Page Not Found</h2>

      <Link to='/'>Back To Homepage</Link>
    </div>
  </div>;
