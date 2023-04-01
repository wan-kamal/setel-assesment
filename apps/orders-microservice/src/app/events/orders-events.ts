import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";

export const refreshOrders$ = new BehaviorSubject<boolean>(true);
