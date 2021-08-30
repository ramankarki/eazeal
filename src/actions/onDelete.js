import { batch } from 'react-redux';

import API from '../utils/API';
import { DELETE, CRITICAL_MODAL_STATE } from './constants';
import { ejectReducer } from '../utils/dynamicReducers';

const onDelete =
  (APP_STATE, deleteObj, ...args) =>
  (dispatch, getState) => {
    const appState = getState()[APP_STATE];
    const { domainState, dynamicState } = appState;

    dispatch({
      type: APP_STATE,
      payload: { ...appState, requestStatus: 'pending' },
    });

    API.delete(appState.deleteRoute(...args))
      .then(() =>
        batch(() => {
          ejectReducer(CRITICAL_MODAL_STATE);
          dispatch({
            type: dynamicState ? domainState + DELETE : domainState,
            payload: deleteObj,
          });
          dispatch({
            type: APP_STATE,
            payload: { ...appState, requestStatus: null },
          });
        })
      )
      .catch(({ response }) =>
        dispatch({
          type: APP_STATE,
          payload: {
            ...appState,
            errorTag: response.data.message.split(':')[0],
            requestStatus: 'failed',
          },
        })
      );
  };

export default onDelete;