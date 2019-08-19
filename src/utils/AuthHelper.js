import {
  signIn,
  signUp,
  getUserDetails,
  getUsersList
} from '../../backend/backend';
import '@binaris/shift-code-transform/macro';
import { alertConstants } from '../constants/alert.constants';

export default class AuthHelper {
  /**
   * Authenticate the user by sending to the backend the given username and password.
   * If the credential is invalid the backed will return an Error and catch block
   * will send INVALID_CREDENTIAL to display to the user.
   * If the credential is valid, the backend will return json web token (JWT) .
   *
   * @param username {string} - email of the user, unique id.
   * @param password  {string} - password of the user.
   * @return {bool/string} true is the authentication was succeessed otherwise, error messasge.
   *
   */
  login = (username, password) => {
    try {
      return signIn(username, password)
        .then(res => {
          if (!res) throw new Error();

          this.setToken(res);
          return true;
        })
        .catch(error => {
          throw new Error(error);
        });
    } catch (error) {
      throw new Error(error);
    }
  };

  register = user => {
    // Register a new user to db, is the user exist the backed will return false
    return signUp(user)
      .then(res => {
        if (!res) return Promise.reject(alertConstants.INVALID_USERNAME);

        return this.login(user.username, user.password);
      })
      .catch(error => {
        return error;
      });
  };

  loggedIn = () => {
    // Checks if there is a saved token
    const token = this.getToken(); // Getting token from localstorage
    return !!token;
  };

  setToken = token => {
    // Saves user token to localStorage
    localStorage.setItem('id', token);
  };

  getToken = () => {
    // Retrieves the user token from localStorage
    return localStorage.getItem('id');
  };

  logout = () => {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id');
  };

  getProfile = () => {
    // Retrieves the user details from db after the user is loggedin
    return getUserDetails(this.getToken())
      .then(profile => {
        return profile;
      })
      .catch(err => {
        return err;
      });
  };

  getUsers = () => {
    // Retrieves users list from db
    return getUsersList()
      .then(users => {
        return users;
      })
      .catch(err => {
        return err;
      });
  };
}
