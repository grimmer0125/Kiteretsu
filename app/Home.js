import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import CommonStyles from './styles/common';
import { connectDBtoCheckUser } from './actions/userAction';
import Login from './Login';
import MainScreen from './MainScreen';
import Registration from './Registration';

class Home extends Component {
  constructor(props) {
    super(props);

    // ref: initial actions in constructor vs in componentDidMount
    // https://discuss.reactjs.org/t/constructor-vs-componentwillmount-vs-componentdidmount/4287
    // Actually, the rule is: If your initialization depends upon the DOM, use componentDidMount,
    // otherwise use constructor.
    this.props.dispatch(connectDBtoCheckUser());
  }

  render() {
    const { authenticatingWithFirebase, currentUser } = this.props;
    if (authenticatingWithFirebase) {
      return (
        <View style={CommonStyles.container}>
          <Text style={CommonStyles.welcome}>
            Loading...
          </Text>
        </View>
      );
    }

    if (currentUser && currentUser.isLogin) {
      if (currentUser.KID || currentUser.KID === '') {
        return <MainScreen />;
      }

      return (
        <View style={CommonStyles.container}>
          <Registration />
        </View>);

      // undefine
    }
    return <Login />;
  }
}

// function debugState(state) {
//   return state.currentUser;
// }

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  authenticatingWithFirebase: state.authenticatingWithFirebase,
});

export default connect(mapStateToProps)(Home);
