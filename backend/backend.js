import { get, update, create, remove } from '@binaris/shift-db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
// import { errorConstants } from '../src/constants/error.constants';

dotenv.config();

/**
 *  Authenticate the user by given username and password.
 *  First trying to retrieve user id by user email,
 *  if found , retrieve user details included user hashed password by his uid.
 *  bcrypt is comparing the given password to the hashed password that was retrieved from the db.
 *
 * @param username {string}  - user email
 * @param password {string}  - user password
 *
 * @return {string} if the authentication was valid, return new jwt of the user, if not return error.
 */
/* @expose */
export async function signIn(username, password) {
  const uid = await get(`email.${username}`);
  if (!uid) throw new Error('User is not exist');
  const user = await get(`uid.${uid}`);
  if (user === undefined) throw new Error('User is not exist');
  return await bcrypt
    .compare(password, user.password)
    .then(res => {
      if (!res) {
        throw new Error(`Wrong password ${!res}`);
      }
      return jwt.sign({ username: user.email }, process.env.SECRET_TOKEN, {
        expiresIn: '24h'
      });
    })
    .catch(error => {
      throw new Error('Wrong password');
    });
}

/* @expose */
export async function signUp(user) {
  let uid;
  try {
    const nextUid = await update('uid', (prev = 0) => prev + 1);
    uid = await update(`email.${user.username}`, prev => prev || nextUid);
  } catch (err) {
    console.log('this error');
    console.log(err);
  }
  const hash = await bcrypt.hash(user.password, 8);
  remove('emails');

  // const emails = await update('emails', (savedEmails = []) => {
  //   const allEmails = [...savedEmails];
  //   console.log(`json allEmails: ${JSON.stringify(allEmails)}`);
  //   const exist = allEmails.find(email => email.uid === uid);
  //   console.log(`exist: ${exist}`);
  //   allEmails.push(user.email);
  //   console.log(`push new to allEmails: ${JSON.stringify(allEmails)}`);
  //   return allEmails;
  // });
  return await create(`uid.${uid}`, {
    uid: uid,
    email: user.username,
    password: hash,
    firstName: user.firstName,
    lastName: user.lastName
  });
}

/* @expose */
export async function getUsersList() {
  return await get('emails');
}

/* @expose */
export async function validateUser(token) {
  try {
    return await jwt.verify(token, process.env.SECRET_TOKEN);
  } catch (e) {
    return undefined;
  }
}

/* @expose */
export async function getUserDetails(token) {
  const decode = await validateUser(token);
  const uid = decode && (await get(`email.${decode.username}`));
  return (
    uid &&
    (await get(`uid.${uid}`)
      .then(user => {
        if (user) {
          return {
            firstName: user.firstName,
            lastName: user.lastName
          };
        }
      })
      .catch(error => {
        return error;
      }))
  );
}
