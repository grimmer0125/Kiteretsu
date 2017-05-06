
import { ActionTypes } from '../actions/userAction';
import { combineReducers } from 'redux';

const initialState = {
  maoID: null,
  displayName: "bb8",
  isLogin: false,
};

// may move to user
export function userChecking(state = true, action = {}) {
  // console.log("in userChecking reducer3:", action)
  switch (action.type) {
    case ActionTypes.USER_DATA:
      console.log("in userChecking reducer2:", action)
      return false;
    default:
      return state;
  }
}

export function registerStatus(state = "", action) {
  // console.log("INVALID_REGISTERID:", action);
  switch (action.type) {
    case ActionTypes.INVALID_REGISTERID:
      console.log("INVALID_REGISTERID2");
      return 'invalid id';
    case ActionTypes.EXISTING_REGISTERID:
      console.log("EXISTING_REGISTERID !!!");
      return 'existing id';
    default:
      return state;
  }
}

export function user(state = initialState, action = {}) {
  console.log("got action");
  switch (action.type) {
    case ActionTypes.USER_DATA:
      return {
        ...state,
        isLogin:action.payload.result,
        ...action.payload.userData,
        // maoID: action.payload.userData,
      };
    case ActionTypes.LOGIN_SUCCESS:
      console.log("reducer user1:", action.payload.displayName);
      return {
        ...state,
        isLogin:true,
        // displayName: action.payload.displayName //就算成功第二次也不會show name,
        // use 1. set/update to firebase 2. get user_data value change (the below action)
      };
    case ActionTypes.LOGOUT:
      console.log("got logout action in reducer")
      return initialState;
    default:
      return state;
    }
}
// export default combineReducers({
//   user,
//   userChecking
// });

export const userRoot = {
  user, userChecking, registerStatus,
}
