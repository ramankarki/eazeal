import { ABOUT_US_PAGE, LOGIN, ROOT, SIGNUP } from '../../Routes/contants';

const buttons = [
  {
    value: 'Signup',
    path: SIGNUP,
    iconsrc: '/assets/signup icon.svg',
    private: false,
  },
  {
    value: 'Login',
    path: LOGIN,
    iconsrc: '/assets/login icon.svg',
    private: false,
  },
  {
    value: 'Logout',
    path: ROOT,
    iconsrc: '/assets/logout icon.svg',
    private: true,
  },
];

const dropdownData = (isAuth) =>
  buttons.filter((button) => button.private === isAuth);

export default dropdownData;

export const commonButtons = [
  {
    value: 'About us',
    path: ABOUT_US_PAGE,
    iconsrc: '/assets/about-us.svg',
    private: false,
  },
];
