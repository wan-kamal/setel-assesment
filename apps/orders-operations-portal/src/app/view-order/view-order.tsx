import { IOrder } from '@data-access';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ajax } from 'rxjs/ajax';
import { environment } from '../../environments/environment';
import styles from './view-order.module.css';

export function ViewOrder() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<IOrder>()

  useEffect(() => {
    const req = ajax.get(`http://localhost:3000/api/v1/orders/${id}`, { 'authorization': `bearer ${environment.visa}` }).subscribe({
      next: resolved => {
        setOrder(resolved.response);
      },
      error: err => window.alert(err.response.data)
    });
    return () => req.unsubscribe();
  }, [id]);

  return (
    <div>
      <aside className={styles['order-title']}>
        <Link to="../">
          <button className="button m-1 is-link is-outlined">
            {'< Return'}
          </button>
        </Link>
        <h3 style={{ margin: 0 }}>View Order: {id}</h3>
      </aside>
      {order ? (
        <main>
          <div className="field control">
            <label>Status</label>
            <input
              className="input"
              type="text"
              value={order.status?.toString().toUpperCase()}
              readOnly
            ></input>
          </div>
          <div className="field control">
            <label>Created By</label>
            <input
              className="input"
              type="text"
              value={order.createdBy?.toString()}
              readOnly
            ></input>
          </div>
          <div className="field control">
            <label>Updated By</label>
            <input
              className="input"
              type="text"
              value={order.updatedBy?.toString()}
              readOnly
            ></input>
          </div>
          <div className="field control">
            <label>Created Date</label>
            <input
              className="input"
              type="text"
              value={order.createdDate?.toString().split('T')[0]}
              readOnly
            ></input>
          </div>
          <div className="field control">
            <label>Updated Date</label>
            <input
              className="input"
              type="text"
              value={order.updatedDate?.toString().split('T')[0]}
              readOnly
            ></input>
          </div>
        </main>
      ) : (
        <main></main>
      )}
    </div>
  );
}

export default ViewOrder;
