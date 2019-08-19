import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from '../../components/Header';
import '../../index.css';
import PageNotFound from '../PageNotFound/PageNotFound';
import HomePage from '../Home/HomePage';
import LoginPage from '../Login/LoginPage';
import RegisterPage from '../Register/RegisterPage';
import AuthHelper from '../../utils/AuthHelper';
import WrapperRouter from '../../components/WrapperRouter';
import WithAuthenticationRouter from '../../components/WithAuthenticationRouter';

class App extends Component {
  constructor() {
    super();

    this.state = {
      alert: ''
    };

    this.auth = new AuthHelper();
    this.clearAlertMessage = this.clearAlertMessage.bind(this);
    this.handleAlertMessage = this.handleAlertMessage.bind(this);
  }

  /**
   *  Prop that will be passed to children component.
   *  Set alert details, alert object including a type and a message.
   *
   *  @param respone {object} - alert details
   */
  handleAlertMessage = respone => {
    this.setState({ alert: respone.alert });
  };

  /**
   *  Prop that will be passed to children component.
   *  Clear alert details, will be remove alert from the screen.
   */
  clearAlertMessage = () => {
    this.setState({ alert: '' });
  };

  render() {
    const { alert } = this.state;
    const childProps = {
      handleAlert: this.handleAlertMessage,
      clearAlertMessage: this.clearAlertMessage
    };
    return (
      <Router>
        <div className='container-fluid'>
          <Header childProps={childProps} />

          {/* <div className='row'> */}
          {/* <div className='d-none d-md-flex col-md-4 col-lg-6 bg-image'>
              <div className='h-100 row center align-items-center'>
                <div className='col-7'>
                  <h1 className='title-heading mb-4'>
                    Welcome to the place where magic happens!
                  </h1>
                  <h4 className='title-heading mb-4'>
                    Dive in now, to experience the magic yourself
                  </h4>
                </div>
              </div>
            </div>
            <div className='col-md-8 col-lg-6 align-items-center'> */}
          {/* {alert.message && (
                <div className={`alert alert-${alert.type}`}>
                  {' '}
                  {alert.message}{' '}
                </div>
              )} */}
          <Switch>
            <WithAuthenticationRouter
              exact
              path='/'
              component={HomePage}
              props={childProps}
            />
            <WrapperRouter
              exact
              path='/login'
              component={LoginPage}
              props={childProps}
            />
            <WrapperRouter
              exact
              path='/register'
              component={RegisterPage}
              props={childProps}
            />
            <Route component={PageNotFound} />
          </Switch>
          {/* </div> */}
        </div>
        {/* </div> */}
      </Router>
    );
  }
}

export default App;
