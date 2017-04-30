// export function selectTab(tabValue) {
//   return {
//     type: SELECT_TAB,
//     payload: {
//       tabValue,
//     },
//   };
// }

const FBSDK = require('react-native-fbsdk');
const {
  AccessToken,
} = FBSDK;

const LOGIN_DATA = 'LOGIN_DATA';
const LOGIN_SUCCESS = `LOGIN_SUCCESS`;
const LOGIN_FAIL = `LOGIN_SUCCESS`;

export const ActionTypes = {
  LOGIN_DATA,
  LOGIN_SUCCESS,
};

import * as firebase from 'firebase';
import firebaseConfig from '../firebaseConfig';

// https://github.com/acdlite/redux-actions
export function fetchLoginData(result, maoID) {
  return {
    type: LOGIN_DATA,
    payload: {
      result,
      maoID,
    }
  };
}

export function LoginSuccess(displayName) {
  return {
    type: LOGIN_SUCCESS,
    payload:{
      displayName,
    }
  };
}

export function handleFBLogin(error, result) {

  return (dispatch) => {

    if (error) {
      //TODO handle FB login error
      alert("login has error: " + result.error);
    } else if (result.isCancelled) {
      alert("login is cancelled.");
    } else {
      console.log("grimmer login ok, result:", result);//not much info
      AccessToken.getCurrentAccessToken()
      .then(data => {

        console.log("grimmer access token data:", data);
        //userID 10208940635412999"

        const token = data.accessToken.toString();

        return firebase.auth().signInWithCredential(
          firebase.auth.FacebookAuthProvider.credential(token))
          // alert(data.accessToken.toString());
      }).then(result=>{
        console.log("grimmer login FB result:", result);
        console.log("grimmer result property:", result.displayName,";",result.email,";",result.uid  );

        if(result.displayName){
          console.log("welcome! " + result.displayName);
          // alert("welcome! " + result.displayName);
        }



        //null, null, KdyxdxZjvhuUFo4VLBm4U1m1iy2
        // but U.displayName: "Teng-Chieh Kang"

        //u or xe/displayName "Teng-Chieh Kang
        //uid:SKdyxdxZjvhuUFo4VLBm4U1m1iy2" ???

        dispatch(LoginSuccess(result.displayName));
        // 寫入uid/某狀態值v/state.user?,
        // 然後user.uid會影響到這個 input id 可不可以寫or show input txt之類的

        // let itmes = firebaseApp.database().ref().child('items');
        // console.log("itmes:", itmes);
        //
        // // ok了
        // itmes.on('value', (snap) => {
        //
        //     const itmes2 = snap.val();
        //     console.log("itmes2:", itmes2);
        //
        // });

      }).catch(function(error) {
        //TODO handle FB + firebase login fail or
        // getCurrentAccessToken fail
        console.log("use fb's token to login firebase error:", error);

      });
    }
  };
}

// function facebookToFirebase(token){
//
//   // https://firebase.google.com/docs/auth/web/custom-auth??
//     firebase.auth().signInWithCredential(firebase.auth.FacebookAuthProvider.credential(token))
//     .then(result=>{
//       console.log("grimmer login result:", result);
//       console.log("grimmer result property:", result.displayName,";",result.email,";",result.uid  );
//
//       if(result.displayName){
//         alert("welcome! " + result.displayName);
//       }
//
//       //null, null, KdyxdxZjvhuUFo4VLBm4U1m1iy2
//       // but U.displayName: "Teng-Chieh Kang"
//
//       //u or xe/displayName "Teng-Chieh Kang
//       //uid:SKdyxdxZjvhuUFo4VLBm4U1m1iy2" ???
//
//       let itmes = firebaseApp.database().ref().child('items');
//       console.log("itmes:", itmes);
//
//       // ok了
//       itmes.on('value', (snap) => {
//
//           const itmes2 = snap.val();
//           console.log("itmes2:", itmes2);
//
//       });
//
//     }).catch(function(error) {
//       console.log("grimmer error:", error);
//     });
//
//     // https://github.com/fullstackreact/react-native-firestack, ios/android firebase wrapper, not node.js
//     //firestack.auth.signInWithProvider('facebook', data.accessToken, '') // facebook will need only access token.
// //     .then((user)=>{
// //       console.log("Inside ");
// //       console.log(user); 
// //     })
//
//     //firebase.auth().signInWithCustomToken(token)
// }


export function initLoginChecker() {
  return (dispatch) => {

    const firebaseApp = firebase.initializeApp(firebaseConfig);

    firebase.auth().onAuthStateChanged((user)=> {
      console.log("got auth user change:", user);

      if (user) {

        // user.
        const dataPath = "/user/" + user.uid +"/maoID";

        let maoID  = firebaseApp.database().ref(dataPath).child('items');

        maoID.on('value', (snap) => {

          const maoIDInfo = snap.val();

          if (maoIDInfo) {
            console.log("no maoID for:", user.uid);
          } else {
            console.log("maoID for:", user.uid, ";maoid:", maoIDInfo);
          }
        }

        dispatch(fetchLoginData(true, maoIDInfo));


        // let userData = await firebase.auth().currentUser;
        //user.uid
//        let userMobilePath = "/user/" + userId + "/details";


        // login
        // 檢查 database裡的值
        //  a. 已login 但無maoid
        //    b. 已login 有id

      } else {
        // userChecking=false, 直接回到loing 第一頁

        dispatch(fetchLoginData(false));
      }
    });


    // // step 1. read app setting value, e.g. product api url
    //
    // // step 2. to get product id
    // productID = AppManager.instance().getProductID();
    // dispatch(getProductIDAction(productID));
    //
    // // step 3. use this product id to get product name
    // queryProductInformation()
    // .then(data => {
    //   if (data === '{"statusCode":404,"error":"Not Found"}') {
    //     AppManager.instance().redirectToLogin();
    //   }
    //
    //   rlog(`get product information:${data}`);
    //   const json = JSON.parse(data);
    //   dispatch(getOkamiProductInfo(json));
    //
    //   dispatch(breadcrumbsExtraAlias('ProductName', json.label));
    //
    //   const url = AppManager.instance().getItemURL(UrlItem.PRODUCTS);
    //   dispatch(breadcrumbsExtraURL('Product', url));
    // });

  };
}
