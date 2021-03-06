import classes from '../../utils/classes';

import Button from '../../components/Button';
import ProductCard from '../ProductCard';

import './orderCard.scss';

function OrderCard(props) {
  const totalAmount = props.products?.reduce(
    (acc, val) => acc + val.quantity * val.price,
    0
  );

  const statusClass = classes({
    Cancelled: props.status === 'Cancelled',
    Delivered: props.status === 'Delivered',
  });
  const cardDetailsClass = classes('orderCard__cardDetails', {
    'orderCard__cardDetails-admin': props.admin,
  });

  return (
    <div className="orderCard">
      {/* card details */}
      <div className={cardDetailsClass}>
        <span>
          Total: <b>Rs. {totalAmount}</b>
        </span>
        <span>
          Order ID: <b>{props.orderId}</b>
        </span>
        <span>
          Status: <b className={statusClass}>{props.status}</b>
        </span>
        {props.admin && props.status === 'Pending' ? (
          <Button
            onClick={props.onOrderDeliver}
            value="Deliver order"
            small="true"
          />
        ) : (
          ''
        )}
        {props.status === 'Pending' ? (
          <Button
            onClick={props.onOrderCancel}
            value="Cancel order"
            small="true"
            danger="true"
          />
        ) : (
          <span></span>
        )}
      </div>

      {props.admin && (
        <div className="orderCard__cardDetails orderCard__cardDetails-userData">
          <span>
            Name:{' '}
            <b>
              {props.firstName} {props.lastName}
            </b>
          </span>
          <span>
            Phone: <b>{props.phoneNumber}</b>
          </span>
          <span>
            Address: <b>{props.fullAddress}</b>
          </span>
          <span>
            Email: <b>{props.email}</b>
          </span>
        </div>
      )}

      {/* heading */}
      <h2>Ordered products</h2>

      {/* product cards */}
      <div className="orderCard__products">
        {props.products?.map((product) => (
          <ProductCard key={product._id} {...product} small="true" />
        ))}
      </div>
    </div>
  );
}

export default OrderCard;
