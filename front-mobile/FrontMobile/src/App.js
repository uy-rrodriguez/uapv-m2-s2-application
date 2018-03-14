import React from 'react';
import LoginFormController from "./LoginFormController";
import Navigator from "./Navigator";
import globalEmitter from "./helpers/globalEmitter";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false
    };
  }

  componentDidMount() {
    let _this = this;

    globalEmitter.addListener('afterLogin', function() {
      _this.handleLogin();
    });

    globalEmitter.addListener('afterLogout', function() {
      _this.handleLogout();
    });
  }

  handleLogin() {
    this.setState({isAuthenticated: true});
  }

  handleLogout() {
    this.setState({isAuthenticated: false})
  }

  render() {
    if (! this.state.isAuthenticated) {
      return (
        <LoginFormController />
      );
    }
    else {
      return (
        <Navigator />
      );
    }
  }
}

export default App;