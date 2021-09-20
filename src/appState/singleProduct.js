import { APP_SINGLE_PRODUCT_STATE } from '../actions/constants';
import { SINGLE_PRODUCT } from '../Routes/contants';
import getErrorTag from '../utils/errorTags';

import { Redirect } from 'react-router';

const singleProduct = {
  [APP_SINGLE_PRODUCT_STATE]: {
    postRoute: (categoryName) => `/api/v1/single-product/${categoryName}`,
    getRoute: () => {
      const [categoryName, productId] = window.location.hash
        .split('/')
        .slice(1);
      return `/api/v1/single-product/${categoryName}/${productId}`;
    },
    modalMsg: (requestStatus, errorTag) => {
      switch (requestStatus) {
        case 'postSuccess':
          return <Redirect to={SINGLE_PRODUCT} />;
        default:
          return getErrorTag(errorTag);
      }
    },
    domainState: SINGLE_PRODUCT,
    noSuccessModal: true,
  },
};

export default singleProduct;
