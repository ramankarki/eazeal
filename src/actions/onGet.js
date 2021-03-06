import { batch } from 'react-redux';

import API from '../utils/API';
import { READ } from './constants';

/**
 *
 * @param {Object} APP_STATE
 * @param {Function} callbackFunc
 * @param  {...any} args
 */
const onGet =
  (APP_STATE, callbackFunc = () => {}, ...args) =>
  (dispatch, getState) => {
    const appState = getState()[APP_STATE];
    const { domainState, dynamicState, noGetSuccessModal } = appState;

    dispatch({
      type: APP_STATE,
      payload: { ...appState, requestStatus: 'pending' },
    });

    API()
      .get(appState.getRoute(...args))
      .then(({ data }) =>
        batch(() => {
          if (appState.domainState === 'USER') {
            const user = JSON.parse(localStorage.getItem('USER')) || {};
            user.user = data.user;

            if (data.token) {
              user.token = data.token;
              user.expiryDate = Date.now() + 7776000000 + '';
            }

            localStorage.setItem('USER', JSON.stringify(user));
          }

          dispatch({
            type: dynamicState ? domainState + READ : domainState,
            payload: data,
          });
          dispatch({
            type: APP_STATE,
            payload: {
              ...appState,
              requestStatus: noGetSuccessModal
                ? null
                : appState.requestEnum.getSuccess,
            },
          });
          callbackFunc(data);
        })
      )
      .catch(({ response }) =>
        dispatch({
          type: APP_STATE,
          payload: {
            ...appState,
            errorTag: response?.data.message.split(':')[0],
            requestStatus: 'failed',
          },
        })
      );
  };

export default onGet;
