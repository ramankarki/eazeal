import { connect } from 'react-redux';
import { useEffect, useState, useRef } from 'react';

import onGet from '../../actions/onGet';
import {
  APP_CATEGORY_STATE,
  CATEGORY,
  MULTIPLE_PRODUCTS,
  RESET,
} from '../../actions/constants';
import { injectReducer, ejectReducer } from '../../utils/dynamicReducers';
import HOFreducer from '../../reducers/HOFreducer';
import HOFdomainReducer from '../../reducers/HOFdomainReducer';
import appState from '../../appState';
import { ROOT } from '../../Routes/contants';
import { useIntersection } from '../../utils/useIntersection';
import resetAppState from '../../actions/resetAppState';

import Header from '../../templates/Header';
import SpinnerLoading from '../../components/SpinnerLoading';
import BreadCrumb from '../../components/BreadCrumb';
import LinkButton from '../../components/LinkButton';
import ProductCardGen from '../../templates/ProductCardGen';

import './multipleProductsPage.scss';

function MultipleProductsPage(props) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('');
  const [showSpinner, setShowSpinner] = useState(true);

  const spinnerRef = useRef();

  let { categories, products, APP_MULTIPLE_PRODUCTS_STATE, Search } = props;

  const [history, setHistory] = useState(window.location.hash);

  const resetMultipleProducts = () => {
    setShowSpinner(true);
    setPage(1);
    props.resetAppState(MULTIPLE_PRODUCTS + RESET, {});
  };

  window.addEventListener('popstate', () => {
    setHistory(window.location.hash);
    resetMultipleProducts();
  });

  useEffect(() => {
    // inject category
    injectReducer(
      CATEGORY,
      HOFdomainReducer(CATEGORY, 'categories', 'category')
    );

    injectReducer(
      APP_CATEGORY_STATE,
      HOFreducer(APP_CATEGORY_STATE, appState(APP_CATEGORY_STATE))
    );

    props.onGet(APP_CATEGORY_STATE);

    return () => {
      ejectReducer(CATEGORY);
      ejectReducer(APP_CATEGORY_STATE);
    };
  }, []);

  useEffect(() => {
    // inject all products
    injectReducer(
      APP_MULTIPLE_PRODUCTS_STATE,
      HOFreducer(
        APP_MULTIPLE_PRODUCTS_STATE,
        appState(APP_MULTIPLE_PRODUCTS_STATE)
      )
    );
    injectReducer(
      MULTIPLE_PRODUCTS,
      HOFdomainReducer(MULTIPLE_PRODUCTS, 'products')
    );

    return () => {
      ejectReducer(APP_MULTIPLE_PRODUCTS_STATE);
      ejectReducer(MULTIPLE_PRODUCTS);
    };
  }, [history]);

  // filter option onChange
  // reset multiple products
  // set page value to 1
  // set showSpinner to true
  useEffect(() => {
    if (!products) return;

    resetMultipleProducts();
  }, [sort]);

  const noOfProducts = categories?.reduce(
    (acc, val) => acc + val.noOfProducts,
    0
  );

  if (categories && categories[0].categoryName !== 'All products')
    categories?.unshift({ noOfProducts, categoryName: 'All products' });

  const currentCategory = window.location.hash.split('/')[1] || 'All products';

  const loadAllProducts = () => {
    if (showSpinner) {
      props.onGet(
        APP_MULTIPLE_PRODUCTS_STATE,
        (data) => {
          setShowSpinner(!!data.products.length);
          setPage(page + 1);
        },
        page,
        sort,
        Search?.value
      );
    }
  };

  useIntersection(spinnerRef, loadAllProducts, products);

  const onFilterChange = (event) => setSort(event.target.value);

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

      {/* category bar with filter button aside */}
      <div className="allProducts__categoryFilterBar">
        <div className="allProducts__categoryBar">
          <div className="allProducts__categoryBarWrapper">
            {categories?.map(({ noOfProducts, categoryName }, index) => (
              <LinkButton
                key={categoryName}
                to={!index ? ROOT : '/' + categoryName}
                dark={currentCategory === categoryName}
              >
                {categoryName}
                <span>({noOfProducts})</span>
              </LinkButton>
            ))}
          </div>
        </div>
        <label className="allProducts__filterBtn">
          <span>Sort by:</span>
          <select onChange={onFilterChange}>
            <option value="">Best match</option>
            <option value="price">Price low to high</option>
            <option value="-price">Price high to low</option>
          </select>
        </label>
      </div>

      {/* search result message */}
      {currentCategory === 'search' ? (
        <p className="searchResultMsg">Search results for "{Search?.value}"</p>
      ) : (
        ''
      )}

      {/* products grid */}
      <ProductCardGen products={products} />

      {/* spinner */}
      {showSpinner && (
        <div ref={spinnerRef} className="spinnerWrapper">
          <SpinnerLoading />
        </div>
      )}
    </div>
  );
}

const mapStateToProps = ({ CATEGORY, MULTIPLE_PRODUCTS, UI_SEARCH_STATE }) => ({
  ...CATEGORY,
  ...MULTIPLE_PRODUCTS,
  ...UI_SEARCH_STATE,
});

export default connect(mapStateToProps, { onGet, resetAppState })(
  MultipleProductsPage
);
