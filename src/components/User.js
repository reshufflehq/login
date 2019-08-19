import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import pen from '../assets/pen.png';
import profile from '../assets/profile.png';
import trash from '../assets/trash.png';

/**
 * Render a single user entry.
 *
 * @typedef {object} Props
 * @prop {object} user -
 * @prop {function} onEdit - trigger edit operation
 * @prop {function} onRemove - delete item from the list
 *
 * @param {Props} props
 */
export default function User({ user, onEdit, onRemove }) {
  const { name, email } = user;
  return (
    <ListGroup.Item action variant='light'>
      <Row className='align-items-center'>
        <Col className='col-no-max-width pr-4'>
          <img src={profile} alt='avatar' className='logo-navbar' />
        </Col>
        <Col className='col-11'>
          <h5 className='font-weight-normal'>{name}</h5>
          <h5 className='font-weight-light'> {email}</h5>
        </Col>

        <Col>
          <Row>
            <Col className='col-no-max-width col-auto'>
              <img src={pen} alt='edit' className='logo-navbar' />
            </Col>
            <Col className='col-no-max-width col-auto'>
              <img src={trash} alt='remove' className='logo-navbar' />
            </Col>
          </Row>
        </Col>
      </Row>
    </ListGroup.Item>
  );
}
