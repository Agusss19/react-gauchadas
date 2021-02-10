import axios from 'axios';

const call = axios.create({
  baseURL: process.env.REACT_APP_HOST,
});

export class Backend {

  constructor() {
    this.cancellationToken = axios.CancelToken.source();
  }

  callRequest(url, method, params, data) {
    return call({ url, method, params, data, cancelToken: this.cancellationToken.token });
  }

  dispose() {
    this.cancellationToken.cancel();
  }

  isCancelled(value) {
    return axios.isCancel(value);
  }
}

export const GET_USER = 'GET_USER';
export const GET_POSTS = 'GET_POSTS';
export const GET_POST = 'GET_POST';
export const GET_COMMENTS = 'GET_COMMENTS';
export const GET_RESPONSES = 'GET_RESPONSES';
export const POST_USER = 'POST_USER';
export const POST_POST = 'POST_POST';
export const POST_COMMENT = 'POST_COMMENT';
export const POST_RESPONSE = 'POST_RESPONSE';
export const DELETE_POST = 'DELETE_POST';
export const RESTORE_POST = 'RESTORE_POST';

export const getRequestConfig = (request, pathParams = null, queryParams = null, bodyParams = null) => {
  const { userID, postID, commentID } = pathParams;
  let url, method, params, data, err;
  switch (request) {
    case GET_USER:
      url = `api/users/${userID}`;
      method = 'get';
      break;
    case GET_POSTS:
      url = 'api/posts';
      method = 'get';
      break;
    case GET_POST:
      url = `api/posts/${postID}`;
      method = 'get';
      break;
    case DELETE_POST:
      if (postID) {
        url = `api/posts/${postID}`;
        method = 'delete';
        break;
      }
      break;
    case RESTORE_POST:
      if (postID) {
        url = `api/posts/${postID}`;
        method = 'put';
        break;
      }
      break;
    case GET_COMMENTS:
      url = `api/posts/${postID}/comments`;
      method = 'get';
      break;
    case GET_RESPONSES:
      url = `api/posts/${postID}/comments/${commentID}`;
      method = 'get';
      break;
    case POST_USER:
      url = `api/users`;
      method = 'post';
      break;
    case POST_POST:
      url = `api/posts`;
      method = 'post';
      break;
    case POST_COMMENT:
      if (bodyParams && postID) {
        url = `api/posts/${postID}/comments`;
        method = 'post';
        params = queryParams;
        data = JSON.stringify(bodyParams);
        break;
      }
      err = "Some request param missing."
      break;
    case POST_RESPONSE:
      if (bodyParams && postID && commentID) {
        url = `api/posts/${postID}/comments/${commentID}`;
        method = 'post';
        params = queryParams;
        data = JSON.stringify(bodyParams);
        break;
      }
      err = "Some request param missing."
      break;
    default:
      err = "Invalid request."
      break;
  }
  return [url, method, params, data, err];
}