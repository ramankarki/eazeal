import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  APP_SHOPPING_CART_STATE,
  UI_ORDER_STATE,
} from '../../actions/constants';
import { ejectReducer, injectReducer } from '../../utils/dynamicReducers';
import HOFreducer from '../../reducers/HOFreducer';
import fields from '../../utils/fields';
import onChangeAndBlur from '../../actions/onChangeAndBlur';
import onDelete from '../../actions/onDelete';
import { ROOT } from '../../Routes/contants';

import Header from '../../templates/Header';
import BreadCrumb from '../../components/BreadCrumb';
import HeroSection from '../../templates/HeroSection';
import RequestStatusModalBg from '../../templates/RequestStatusModalBg';
import SpinnerLoading from '../../components/SpinnerLoading';
import Button from '../../components/Button';

import './cart.scss';

function Cart(props) {
  useEffect(() => {
    const products = fields('OrderProducts');
    products.OrderProducts.value = props.shoppingCart?.map((product) => ({
      ...product,
      quantity: 1,
    }));
    injectReducer(UI_ORDER_STATE, HOFreducer(UI_ORDER_STATE, products));

    return () => {
      ejectReducer(UI_ORDER_STATE);
    };
  }, [props.shoppingCart]);

  const onQuantityChange = (index) => (event) => {
    const dupProducts = [...props.OrderProducts.value];
    dupProducts[index].quantity = event.target.value;
    props.onChangeAndBlur(UI_ORDER_STATE, 'OrderProducts', dupProducts);
  };

  const removeProduct = (productId) => () => {
    props.onDelete(APP_SHOPPING_CART_STATE, {}, productId);
  };

  return (
    <div className="cart">
      <Header />
      <BreadCrumb />
      <HeroSection
        imgUrl="url('/assets/cart.webp')"
        heading="Place your order"
        text='Select the product quantity you want. Place your order by clicking "Place order" button and your products will arive at your address in no time. Payment will be on cash after delivery.'
      />

      {props.shoppingCart &&
        (props.shoppingCart.length ? (
          <div className="cart__table">
            <div className="cart__productsTable">
              <div className="cart__tableHead">
                <p>Product</p>
                <p>Quantity</p>
                <p>Price</p>
              </div>
              {props.OrderProducts?.value?.map(
                (
                  {
                    categoryName,
                    productId,
                    imageUrl,
                    price,
                    quantity,
                    productName,
                  },
                  index
                ) => (
                  <div key={productId} className="cart__tableCell tableCell">
                    <div className="tableCell__product">
                      <img src={imageUrl[0]} alt="product" />
                      <p>{productName}</p>
                    </div>
                    <select value={quantity} onChange={onQuantityChange(index)}>
                      {Array(props.shoppingCart[index]?.quantity)
                        .fill(0)
                        .map((val, i) => (
                          <option key={Date.now() + i + 'option'} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                    </select>
                    <p className="tableCell__price">{quantity * +price}</p>
                    <Button
                      onClick={removeProduct(productId)}
                      style={{ gridColumn: 'span 1', backgroundColor: 'white' }}
                    >
                      <img src="/assets/exit icon.svg" alt="exit icon" />
                    </Button>
                  </div>
                )
              )}
            </div>
            <div className="cart__placeOrder">
              <h2>Cart</h2>
              <div>
                <p>
                  Total amount:{' '}
                  <b>
                    Rs.{' '}
                    {props.OrderProducts?.value?.reduce(
                      (acc, { quantity, price }) => acc + quantity * price,
                      0
                    )}
                  </b>
                </p>
                <p>
                  Name:{' '}
                  <b>
                    {props.user?.firstName} {props.user?.lastName}
                  </b>
                </p>
                <p>
                  Phone: <b>+977-{props.user?.phoneNumber}</b>
                </p>
                <p>
                  Shipping address: <b>hello world</b>
                </p>
                <Button>
                  <picture>
                    <img src="/assets/order icon.svg" alt="cart icon" />
                  </picture>
                  Place order
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <p className="noProductsMsg">
            There are no products on cart.{' '}
            <Link to={ROOT}>
              <b>Shop now</b>
            </Link>
          </p>
        ))}

      {/* modal */}
      {props.requestStatus && (
        <RequestStatusModalBg
          requestStatus={props.requestStatus}
          APP_STATE={APP_SHOPPING_CART_STATE}
        >
          {props.requestStatus === 'pending' ? (
            <SpinnerLoading />
          ) : (
            props.modalMsg(props.requestStatus, props.errorTag)
          )}
        </RequestStatusModalBg>
      )}
    </div>
  );
}

const mapStateToProps = ({
  APP_SHOPPING_CART_STATE,
  SHOPPING_CART,
  UI_ORDER_STATE,
  USER,
}) => ({
  ...APP_SHOPPING_CART_STATE,
  ...SHOPPING_CART,
  ...UI_ORDER_STATE,
  ...USER,
});

export default connect(mapStateToProps, { onChangeAndBlur, onDelete })(Cart);
