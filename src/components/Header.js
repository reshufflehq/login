import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import AuthHelper from '../utils/AuthHelper';
import '../index.css';

class Header extends Component {
  constructor(props) {
    super(props);

    this.auth = new AuthHelper();
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout = event => {
    this.auth.logout();
    this.props.history.replace('/login');
  };

  render() {
    return (
      <div className='position-absolute w-100 nav-header navbar inline sticky-top navbar-light bg-transparent display-4 '>
        <Link to='/' className='text-white navbar-brand text-uppercase'>
          awesomeness inc.
        </Link>
        {this.auth.loggedIn() ? (
          <Link
            to='/login'
            onClick={this.handleLogout}
            className='navbar-brand navbar-right'
          >
            Logout
          </Link>
        ) : (
          <Link to='/register' className='navbar-brand navbar-right'>
            Not a memebr? register now
          </Link>
        )}
      </div>
    );
  }
}

export default withRouter(Header);
