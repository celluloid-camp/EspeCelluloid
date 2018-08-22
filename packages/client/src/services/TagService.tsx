import * as Constants from './Constants';
import { TagData } from '@celluloid/types';

export default class Tags {
  static list() {
    const headers = {
      'Accepts': 'application/json'
    };

    return fetch('/api/tags', {
      method: 'GET',
      headers: new Headers(headers),
      credentials: 'include'
    }).then(response => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error(Constants.ERR_UNAVAILABLE);
    });
  }

  static post(tag: TagData) {
    const headers = {
      'Accepts': 'application/json'
    };

    return fetch('/api/tags', {
      method: 'POST',
      headers: new Headers(headers),
      credentials: 'include'
    }).then(response => {
      if (response.status === 201 || response.status === 400) {
        return response.json();
      } else if (response.status === 401) {
        throw new Error(Constants.ERR_NOT_LOGGED_IN);
      }
      throw new Error(Constants.ERR_UNAVAILABLE);
    });
  }
}