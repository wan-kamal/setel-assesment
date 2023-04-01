import './home.module.css';
import { IOrder } from '@data-access';
import { useEffect, useState } from 'react';
import { environment } from '../../environments/environment';
import { Link } from 'react-router-dom';
import { ajax } from 'rxjs/ajax';
import { exhaustMap } from 'rxjs/operators';
import { timer } from 'rxjs';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  getOrderSuccess,
  createOrderSuccess,
  cancelOrderSuccess,
} from '../store/orders';

export function Home() {
  const [pagination, setPagination] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<IOrder[]>([]);
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [cancelLoading, setCancelLoading] = useState<boolean>(false);

  const orders = useAppSelector((state) => state.orderCollection);

  const dispatch = useAppDispatch();
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000/api/v1/orders');
    ws.addEventListener('message', message => {
      dispatch(getOrderSuccess(JSON.parse(message.data.toString()).data))
    });
    return () => ws.close();
    // const req = timer(0, 1000)
    //   .pipe(
    //     exhaustMap(() =>
    //       ajax.get('http://localhost:3000/api/v1/orders', {
    //         Authorization: environment.visa,
    //       })
    //     )
    //   )
    //   .subscribe({
    //     // next: console.log,
    //     next: (resolved) => dispatch(getOrderSuccess(resolved.response.data)),
    //     error: console.error,
    //   });
    //   return () => req.unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    setCurrentPage(orders.slice((pagination - 1) * 10, pagination * 10));
  }, [orders, pagination]);

  const createOrderHandler = () => {
    setCreateLoading(true);
    const req = ajax
      .post(
        'http://localhost:3000/api/v1/orders',
        {},
        { Authorization: environment.visa, 'Content-Type': 'application/json' }
      )
      .subscribe({
        next: (resolved) => {
          // dispatch(createOrderSuccess(resolved.response.data));
          setCreateLoading(false);
        },
        error: (err) => {
          window.alert(err.response.data);
          setCreateLoading(false);
        },
      });
    return () => req.unsubscribe();
  };

  const cancelOrderHandler = (id: string) => {
    setCancelLoading(true);
    const req = ajax
      .put(
        `http://localhost:3000/api/v1/orders/${id}/cancel`,
        {},
        { Authorization: environment.visa, 'Content-Type': 'application/json' }
      )
      .subscribe({
        next: (resolved) => {
          dispatch(cancelOrderSuccess(resolved.response.data));
          setCancelLoading(false);
        },
        error: (err) => {
          window.alert(err.response.data);
          setCancelLoading(false);
        },
      });
    return () => req.unsubscribe();
  };

  return (
    <div>
      <div>
        {createLoading ? (
          <button
            onClick={createOrderHandler}
            className="button is-primary is-outlined is-loading"
          >
            Create New Order
          </button>
        ) : (
          <button
            onClick={createOrderHandler}
            className="button is-primary is-outlined"
          >
            Create New Order
          </button>
        )}
        <nav
          className="pagination is-small is-right"
          role="navigation"
          aria-label="pagination"
        >
          <ul className="pagination-list">
            {orders.map((o, i) => {
              if (!((i - 1) % 10)) {
                return (
                  <li key={Math.ceil(i / 10)}>
                    {pagination === Math.ceil(i / 10) ? (
                      <span
                        onClick={() => setPagination(Math.ceil(i / 10))}
                        className="pagination-link is-current"
                        aria-label={`Go to page ${Math.ceil(i / 10)}`}
                      >
                        {Math.ceil(i / 10)}
                      </span>
                    ) : (
                      <span
                        onClick={() => setPagination(Math.ceil(i / 10))}
                        className="pagination-link"
                        aria-label={`Go to page ${Math.ceil(i / 10)}`}
                      >
                        {Math.ceil(i / 10)}
                      </span>
                    )}
                  </li>
                );
              } else {
                return null;
              }
            })}
          </ul>
        </nav>
      </div>
      <table className="table">
        <thead>
          <tr key="header">
            <th>Order ID</th>
            <th>Status</th>
            <th>Created By</th>
            <th>Updated By</th>
            <th>Created Date</th>
            <th>Updated Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPage.map((o) => {
            return (
              <tr key={o._id.toString()}>
                <td>{o.orderId}</td>
                <td>
                  <span className="tag is-info">{o.status?.toUpperCase()}</span>
                </td>
                <td>{o.createdBy}</td>
                <td>{o.updatedBy}</td>
                <td>{o.createdDate?.toString().split('T')[0]}</td>
                <td>{o.updatedDate?.toString().split('T')[0]}</td>
                <td>
                  <div className="buttons are-small">
                    <Link to={`./orders/${o.orderId}`}>
                      <button className="button m-1 is-link is-outlined">
                        View
                      </button>
                    </Link>
                    {cancelLoading ? (
                      <button
                        onClick={() => cancelOrderHandler(o.orderId)}
                        className="button m-1 is-danger is-outlined is-loading"
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        onClick={() => cancelOrderHandler(o.orderId)}
                        className="button m-1 is-danger is-outlined"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Home;
