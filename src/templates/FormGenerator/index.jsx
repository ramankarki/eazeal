import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { injectReducer, ejectReducer } from '../../utils/dynamicReducers';
import onPost from '../../actions/onPost';
import HOFreducer from '../../reducers/HOFreducer';
import appState from '../../appState/';
import { ROOT } from '../../Routes/contants';

import Button from '../../components/Button';
import InputField from '../../components/InputField';
import SpinnerLoading from '../../components/SpinnerLoading';
import RequestStatusModalBg from '../../templates/RequestStatusModalBg';
import LazyImg from '../../components/LazyImg';

import './formGenerator.scss';

function FormGenerator(props) {
  const {
    fieldsObj,
    UI_STATE,
    APP_STATE,
    REDUX_APP_STATE,
    redirect,
    redirectMsg,
    topLogo,
    formHeading,
    buttonValue,
    forgotPassword,
    forgotPasswordLinkStyle,
  } = props;
  let { modalMsg, requestStatus, errorTag } = REDUX_APP_STATE;
  errorTag = errorTag === 'alreadyExists' ? errorTag + 'Signup' : errorTag;

  injectReducer(UI_STATE, HOFreducer(UI_STATE, fieldsObj));
  injectReducer(APP_STATE, HOFreducer(APP_STATE, appState(APP_STATE)));
  useEffect(
    () => () => {
      ejectReducer(UI_STATE);
      ejectReducer(APP_STATE);
    },
    [UI_STATE, APP_STATE]
  );

  const formElements = (fieldsObj, TYPE) =>
    Object.keys(fieldsObj).map((fieldName) => {
      const inputType = /password/gi.test(fieldName) ? 'password' : false;

      return (
        <InputField
          key={fieldName}
          TYPE={TYPE}
          labelName={fieldName}
          dbProp={fieldsObj[fieldName].dbProp}
          inputType={inputType}
        />
      );
    });

  const onSubmitHandler = (event) => {
    event.preventDefault();
    props.onPost(APP_STATE, UI_STATE);
  };

  const LinkStyle = {
    textAlign: 'center',
    marginTop: '2rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#2b4775',
  };

  return (
    <div className="Form">
      {/* logo */}
      {topLogo && (
        <div className="Form__logo">
          <Link to={ROOT}>
            <LazyImg src="/assets/logo.png" alt="eazeal Logo" />
          </Link>
        </div>
      )}

      {/* form */}
      <section className="Form__section">
        <h1 className="Form__heading">{formHeading}</h1>
        <form onSubmit={onSubmitHandler} className="Form__form">
          {formElements(fieldsObj, UI_STATE)}

          {/* forgot password page link */}
          {forgotPassword && (
            <Link to={forgotPassword} style={forgotPasswordLinkStyle}>
              Forgot password
            </Link>
          )}

          <Button value={buttonValue} />
        </form>
        {redirect && (
          <Link to={redirect} style={LinkStyle}>
            {redirectMsg}
          </Link>
        )}
      </section>

      {/* modal */}
      {requestStatus && (
        <RequestStatusModalBg
          requestStatus={requestStatus}
          APP_STATE={APP_STATE}
        >
          {requestStatus === 'pending' ? (
            <SpinnerLoading />
          ) : (
            modalMsg(requestStatus, errorTag)
          )}
        </RequestStatusModalBg>
      )}
    </div>
  );
}

export default connect(null, { onPost })(FormGenerator);
