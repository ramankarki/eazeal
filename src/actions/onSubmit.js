import API from '../utils/API';

const onSubmit = (APP_STATE_TYPE, UI_STATE_TYPE) => (dispatch, getState) => {
  const uiState = getState()[UI_STATE_TYPE];
  const appState = getState()[APP_STATE_TYPE];
  const password = getState()[UI_STATE_TYPE]['Password']?.value;

  let isSubmitable = true;
  const newUIState = {};
  const apiData = {};
  // validate before submitting & collect data in new obj for API call
  for (let fieldName in uiState) {
    let { value, dbProp } = uiState[fieldName];
    const checkValidation = !uiState[fieldName].validate(value, password);

    newUIState[fieldName] = {
      ...uiState[fieldName],
      validationFailed: checkValidation,
    };
    apiData[dbProp] = value;

    if (isSubmitable && checkValidation) isSubmitable = false;
  }

  if (isSubmitable) {
    // start ajax req
    dispatch({
      type: APP_STATE_TYPE,
      payload: { ...appState, requestStatus: appState.requestEnum.pending },
    });

    API.post(appState.apiPath(), apiData)
      .then(() => {
        dispatch({
          type: APP_STATE_TYPE,
          payload: { ...appState, requestStatus: appState.requestEnum.success },
        });
      })
      .catch(({ response }) => {
        console.log(response);
        dispatch({
          type: APP_STATE_TYPE,
          payload: {
            ...appState,
            errorTag: response.data.message.split(':')[0],
            requestStatus: appState.requestEnum.failed,
          },
        });
      });
  } else {
    dispatch({ type: UI_STATE_TYPE, payload: newUIState });
  }
};

export default onSubmit;