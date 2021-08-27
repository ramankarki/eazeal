import { Link } from 'react-router-dom';

import classes from '../../utils/classes';

import './linkButton.scss';

function LinkButton(props) {
  const { dark, bold, noBg, iconsrc, alt } = props;
  const classNames = classes('linkButton', {
    linkButton__dark: dark,
    linkButton__light: !dark,
    'linkButton-bold': bold,
    'linkButton__light-nobg': noBg,
  });

  return (
    <div className={classNames}>
      <Link {...props}>
        {iconsrc && <img src={iconsrc} alt={alt} />}
        {props.children}
      </Link>
    </div>
  );
}

export default LinkButton;