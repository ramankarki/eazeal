import { connect } from 'react-redux';
import { useEffect, useState, useRef } from 'react';

import onGet from '../../actions/onGet';
import {
  APP_CATEGORY_STATE,
  CATEGORY,
  APP_ALL_PRODUCTS_STATE,
} from '../../actions/constants';
import { injectReducer, ejectReducer } from '../../utils/dynamicReducers';
import HOFreducer from '../../reducers/HOFreducer';
import HOFdomainReducer from '../../reducers/HOFdomainReducer';
import appState from '../../appState';
import { ROOT } from '../../Routes/contants';
import { useIntersection } from '../../utils/useIntersection';

import Header from '../../templates/Header';
import SpinnerLoading from '../../components/SpinnerLoading';
import BreadCrumb from '../../components/BreadCrumb';
import LinkButton from '../../components/LinkButton';
import ProductCardGen from '../../templates/ProductCardGen';

import './allProducts.scss';

function AllProducts(props) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('');
  const [noOfProductsHistory, setNoOfProductsHistory] = useState(0);

  const spinnerRef = useRef();

  let { categories, products } = props;

  // inject category
  injectReducer(CATEGORY, HOFdomainReducer(CATEGORY, 'categories', 'category'));
  injectReducer(
    APP_CATEGORY_STATE,
    HOFreducer(APP_CATEGORY_STATE, appState(APP_CATEGORY_STATE))
  );

  // inject all products
  injectReducer(
    APP_ALL_PRODUCTS_STATE,
    HOFreducer(APP_ALL_PRODUCTS_STATE, appState(APP_ALL_PRODUCTS_STATE))
  );

  useEffect(() => {
    props.onGet(APP_CATEGORY_STATE);

    return () => {
      ejectReducer(CATEGORY);
      ejectReducer(APP_CATEGORY_STATE);
      ejectReducer(APP_ALL_PRODUCTS_STATE);
    };
  }, []);

  const noOfProducts = categories?.reduce(
    (acc, val) => acc + val.noOfProducts,
    0
  );

  if (categories && categories[0].categoryName !== 'All products')
    categories?.unshift({ noOfProducts, categoryName: 'All products' });

  const path = window.location.hash.split('/')[1] || 'All products';

  const loadAllProducts = () => {
    if (products?.length !== noOfProductsHistory) {
      props.onGet(APP_ALL_PRODUCTS_STATE, page, sort);
      setPage(page + 1);
      setNoOfProductsHistory(products?.length);
    }
  };

  useIntersection(spinnerRef, loadAllProducts);

  return (
    <div className="allProducts">
      <Header />
      <BreadCrumb />

      {/* hero section */}
      <div className="allProducts__heroSection">
        <picture
          style={{ backgroundImage: `url('/assets/hero image.webp')` }}
        ></picture>
        <div className="allProducts__heroContent">
          <h1>Get the products you want</h1>
          <p>
            Search for the products you want by simplying using search box above
            and typing keywords, or by clicking the category buttons of your
            products below.
          </p>
        </div>
      </div>

      {/* category bar */}
      <div className="allProducts__categoryBar">
        <div className="allProducts__categoryBarWrapper">
          {categories?.map(({ noOfProducts, categoryName }, index) => (
            <LinkButton
              key={categoryName}
              to={!index ? ROOT : '/' + categoryName}
              dark={path === categoryName}
            >
              {categoryName}
              <span>({noOfProducts})</span>
            </LinkButton>
          ))}
        </div>
      </div>

      {/* products grid */}
      <ProductCardGen products={products} />

      {/* spinner */}
      <div ref={spinnerRef} className="spinnerWrapper">
        <SpinnerLoading />
      </div>
    </div>
  );
}

const mapStateToProps = ({ CATEGORY, MULTIPLE_PRODUCTS }) => ({
  ...CATEGORY,
  ...MULTIPLE_PRODUCTS,
});

export default connect(mapStateToProps, { onGet })(AllProducts);
