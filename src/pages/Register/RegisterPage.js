import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import LoaderButton from '../../components/LoaderButton';
import { validationConstants } from '../../constants/validation.constants';
import { alertType } from '../../constants/alert.constants';
import AuthHelper from '../../utils/AuthHelper';
import { constants } from '../../constants/constants';

class RegisterPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      fields: {
        firstName: '',
        lastName: '',
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

  /*
   * Handle form submiting by pressing with keyboard Enter while in the input fields.
   */
  handleEnterPressed(event) {
    if (event.key === 'Enter') {
      this.handleSubmit(event);
    }
  }

  handleChange(e) {
    let fields = this.state.fields;
    fields[e.target.name] = e.target.value;
    this.setState({
      fields
    });
  }

  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields.firstName) {
      formIsValid = false;
      errors.firstName = validationConstants.FIRSTNAME_EMPTY;
    }

    if (fields.firstName) {
      //regular expression for alphabet characters validation
      if (!fields.firstName.match(/^[a-zA-Z ]*$/)) {
        formIsValid = false;
        errors.firstName = validationConstants.ALPHABET_CHAEACTERS;
      }
    }

    if (!fields.lastName) {
      formIsValid = false;
      errors.lastName = validationConstants.LASTNAME_EMPTY;
    }

    if (fields.lastName) {
      //regular expression for alphabet characters validation
      if (!fields.lastName.match(/^[a-zA-Z ]*$/)) {
        formIsValid = false;
        errors.lastName = validationConstants.ALPHABET_CHAEACTERS;
      }
    }

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

  handleSubmit = e => {
    e.preventDefault();

    this.setState({ isLoading: true });
    const { fields } = this.state;
    const { clearAlertMessage, handleAlert, history } = this.props;

    if (this.validateForm()) {
      this.auth
        .register(fields)
        .then(res => {
          history.push({
            pathname: '/',
            state: { res: res }
          });
          clearAlertMessage();
        })
        .catch(error => {
          handleAlert({ alert: { type: alertType.DANGER, message: error } });
        })
        .finally(() => {
          this.setState({ isLoading: false });
        });
    } else {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { fields, errors } = this.state;
    return (
      <div className='py-5'>
        <div className='container'>
          <div className='row align-items-center full-height'>
            <div className='col-md-9 col-lg-8 mx-auto'>
              <h3 className='login-heading mb-4'>Register</h3>
              <form name='form' onSubmit={this.handleSubmit}>
                <div className='form-label-group'>
                  <input
                    id='firstName'
                    placeholder={'First Name'}
                    type='text'
                    autoFocus
                    onKeyPress={this.handleEnterPressed}
                    className='form-control'
                    name='firstName'
                    value={fields.firstName}
                    onChange={this.handleChange}
                  />
                  <label htmlFor='firstName'>First Name</label>
                  <div className='error'>{errors.firstName}</div>
                </div>
                <div className='form-label-group'>
                  <input
                    id='lastName'
                    placeholder={'Last Name'}
                    type='text'
                    onKeyPress={this.handleEnterPressed}
                    className='form-control'
                    name='lastName'
                    value={fields.lastName}
                    onChange={this.handleChange}
                  />
                  <label htmlFor='lastName'>Last Name</label>
                  <div className='error'>{errors.lastName}</div>
                </div>
                <div className='form-label-group'>
                  <input
                    id='username'
                    placeholder={'Email'}
                    type='text'
                    onKeyPress={this.handleEnterPressed}
                    className='form-control'
                    name='username'
                    value={fields.username}
                    onChange={this.handleChange}
                  />
                  <label htmlFor='username'>Email</label>
                  <div className='error'>{errors.username}</div>
                </div>
                <div className='form-label-group'>
                  <input
                    id='password'
                    placeholder={'Password'}
                    type='password'
                    className='form-control'
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
                    text={constants.REGISTER}
                    loadingText={constants.SIGNING_UP}
                  />
                  <Link to='/login' className='form-link btn btn-link'>
                    {constants.CANCEL}
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(RegisterPage);
