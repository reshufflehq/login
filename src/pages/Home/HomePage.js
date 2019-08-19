import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import AuthHelper from '../../utils/AuthHelper';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import User from '../../components/User';

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profile: '',
      users: undefined,
      items: undefined
    };

    this.auth = new AuthHelper();
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    if (!this.auth.loggedIn()) {
      this.handleLogout(false);
    } else {
      this.auth
        .getProfile()
        .then(profile => this.setState({ profile: profile }))
        /*TODO: redirect to ooops page*/
        .catch(error => this.handleLogout(false));
    }
  }

  handleLogout = event => {
    this.auth.logout();
    this.props.history.replace('/login');
  };

  handleDisplayUsers = event => {
    this.auth
      .getUsers()
      .then(list => {
        this.setState({ users: list });
        const items = [];
        for (const [index, value] of Object.entries(list)) {
          const { uid } = value;
          // items.push(<li key={index}>{value}</li>)
          items.push(<User key={uid} user={this.state.users[uid]} />);
        }
        this.setState({ items: items });
      })
      .catch(error => this.handleLogout(false));
  };

  render() {
    const { profile, users, items } = this.state;
    return (
      <div className='jumbotron bg-transparent '>
        <h1>
          Welcome{' '}
          {profile && profile.firstName
            ? profile.firstName + ' ' + profile.lastName
            : ''}
          !
        </h1>
        <p>You're logged in with AWESOMENESS INC.</p>

        <p>
          <button className='btn btn-link' onClick={this.handleDisplayUsers}>
            Show me users list
          </button>
        </p>
        {users && (
          <Row>
            <ListGroup variant='flush' className='w-100'>
              {items}
              {/*                 
              //   users.map(uid => (
              //   <User key={uid} user={users[uid]} />
              // ))} */}
            </ListGroup>
          </Row>
        )}
      </div>
    );
  }
}

export default withRouter(HomePage);
