import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { injectReducer } from '../utils/dynamicReducers';
import HOFreducer from '../reducers/HOFreducer';
import { LOGIN, ROOT } from './contants';
import { APP_USER_STATE } from '../actions/constants';
import appState from '../appState';
import onGet from '../actions/onGet';

function Wrapper(props) {
  const { route, USER } = props;
  const { private: privateRoute, role, component } = route;

  injectReducer(
    APP_USER_STATE,
    HOFreducer(APP_USER_STATE, appState(APP_USER_STATE))
  );

  if (!USER) props.onGet(APP_USER_STATE);

  let user = localStorage.getItem('USER');
  if (user) {
    user = JSON.parse(user);
    injectReducer('USER', HOFreducer('USER', user));
  }

  // check if this page needs authentication.
  if (privateRoute) {
    // check if token is expired.
    if (!user || Date.now() > +user.expiryDate) return <Redirect to={LOGIN} />;

    // if page is accessible by user type.
    if (role !== user.user.role) return <Redirect to={ROOT} />;
  }

  return component;
}

const mapStateToProps = ({ USER }) => ({ USER });

export default connect(mapStateToProps, { onGet })(Wrapper);
