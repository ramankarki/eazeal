import asideButtonData from './asideButtonsData';

import Header from '../../templates/Header';
import BreadCrumb from '../../components/BreadCrumb';
import LinkButton from '../../components/LinkButton';
import RequestStatusModalBg from '../RequestStatusModalBg';
import SpinnerLoading from '../../components/SpinnerLoading';

import './clientDashboard.scss';

function ClientDashboard(props) {
  const { requestStatus, modalMsg, errorTag, heading, APP_STATE } = props;

  const currentPath = window.location.hash.slice(1);

  return (
    <div className="client">
      <Header />
      <BreadCrumb />

      <div className="client__mainCover">
        <div className="client__aside">
          {asideButtonData.map(({ iconsrc, value, path }) => (
            <LinkButton
              key={iconsrc}
              to={path}
              iconsrc={iconsrc}
              alt={iconsrc}
              nobg={currentPath !== path ? 'true' : ''}
              bgonhover={'true'}
              style={{ padding: '1rem', fontSize: '.9rem' }}
            >
              {value}
            </LinkButton>
          ))}
        </div>

        {/* right panel */}
        <div className="client__panel">
          <h1>{heading}</h1>
          {props.children}
        </div>
      </div>

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

export default ClientDashboard;