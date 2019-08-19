import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import LoaderButton from '../../components/LoaderButton';
import { validationConstants } from '../../constants/validation.constants';
import { alertType, alertConstants } from '../../constants/alert.constants';
import { constants } from '../../constants/constants';
import AuthHelper from '../../utils/AuthHelper';

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      fields: {
        username: '',
        password: ''
      },
      errors: {}
    };

    this.auth = new AuthHelper();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.handleEnterPressed = this.handleEnterPressed.bind(this);
  }

  /**
   *  Handle input changes, save the new value to states.
   *
   *  @param event {object} - event details that was triggered
   */
  handleChange(event) {
    let fields = this.state.fields;
    fields[event.target.name] = event.target.value;
    fields[event.target.placeholder] = '';
    this.setState({
      fields
    });
  }

  /**
   *  Validate all the fields form on submition and set error message accordingly.
   */
  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields.username) {
      formIsValid = false;
      errors.username = validationConstants.USERNAME_EMPTY;
    }

    if (fields.username) {
      //regular expression for email validation
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(fields.username)) {
        formIsValid = false;
        errors.username = validationConstants.USERNAME_INVALID;
      }
    }

    if (!fields.password) {
      formIsValid = false;
      errors.password = validationConstants.PASSWORD_EMPTY;
    }
    /*  This field accept only accept user password details. This validation makes the user password very strong and which complies below format :
            Must be at least 8 characters
            At least 1 special character from @#$%&
            At least 1 number, 1 lowercase, 1 uppercase letter 
            if (!fields.password.match(/^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/)) {
        */
    if (fields.password) {
      if (fields.password.length < 5) {
        formIsValid = false;
        errors.password = validationConstants.PASSWORD_INVALID;
      }
    }

    this.setState({
      errors: errors
    });
    return formIsValid;
  }

  /*
   * Handle form submiting by pressing with keyboard Enter while in the input fields.
   */
  handleEnterPressed(event) {
    if (event.key === 'Enter') {
      this.handleSubmit(event);
    }
  }

  /**
   * Handle form submiting by pressing the submit button.
   *
   *  @param event {object} - event details that was triggered
   */
  handleSubmit(event) {
    event.preventDefault();

    this.setState({ isLoading: true });
    const { fields } = this.state;
    const { clearAlertMessage, handleAlert, history } = this.props;
    if (this.validateForm()) {
      this.auth
        .login(fields.username, fields.password)
        .then(res => {
          if (res) {
            history.push({
              pathname: '/'
            });
            clearAlertMessage();
          }
        })
        .catch(error => {
          handleAlert({
            alert: {
              type: alertType.DANGER,
              message: alertConstants.INVALID_CREDENTIAL
            }
          });
        })
        .finally(() => {
          this.setState({ isLoading: false });
        });
    } else {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { fields, errors } = this.state;
    return (
      <div className='row w-100'>
        <div className='d-none d-md-flex col-md-4 col-lg-6 bg-image'>
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
        <div className='align-items-center full-height'>
          <div className='col-md-9 col-lg-8 mx-auto'>
            <h3 className='login-heading mb-4'>Welcome back!</h3>

            <form name='form' onSubmit={this.handleSubmit}>
              <div className='form-label-group'>
                <input
                  id='username'
                  type='email'
                  autoFocus
                  placeholder={'Email address'}
                  onKeyPress={this.handleEnterPressed}
                  className='form-control'
                  required
                  name='username'
                  value={fields.username}
                  onChange={this.handleChange}
                />
                <label htmlFor='username'>Email address</label>
                <div className='error'>{errors.username}</div>
              </div>
              <div className='form-label-group'>
                <input
                  id='password'
                  type='password'
                  placeholder={'Password'}
                  onKeyPress={this.handleEnterPressed}
                  className='form-control'
                  required
                  name='password'
                  value={fields.password}
                  onChange={this.handleChange}
                />
                <label htmlFor='password'>Password</label>
                <div className='error'>{errors.password}</div>
              </div>
              <div className='form-group'>
                <LoaderButton
                  type='submit'
                  className='btn btn-lg btn-primary btn-block btn-login text-uppercase font-weight-bold mb-2'
                  isLoading={this.state.isLoading}
                  text={constants.LOGIN}
                  loadingText={constants.LOGGING_IN}
                />
                <Link to='/register' className='form-link btn btn-link'>
                  {constants.REGISTER}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(LoginPage);
