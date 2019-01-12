import { Params, RouterStateSnapshot } from '@angular/router';
import {routerReducer, RouterStateSerializer} from '@ngrx/router-store';
import {ActionReducerMap, State} from '@ngrx/store';

export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
}

export interface ActiveRouterState {
  state: RouterStateUrl;
  navigationId: number;
}

export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route = routerState.root;
    
    while (route.firstChild) {
      route = route.firstChild;
    }
    
    const {
      url,
      root: { queryParams },
    } = routerState;
    const { params } = route;
    
    // Only return an object including the URL, params and query params
    // instead of the entire snapshot
    return { url, params, queryParams };
  }
}

// @ts-ignore - the State requires a type to make it non-generic
export const reducers: ActionReducerMap<State> = {
  router: routerReducer
};
