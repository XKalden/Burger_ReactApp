import React, { Component } from 'react';
import Layout from './hoc/Layout/Layout';
import {Route, Switch, Redirect} from 'react-router-dom';
// HOC router
import {withRouter} from 'react-router-dom';

import BurgerBuilder from './container/BurgerBuilder/BurgerBuilder';
// import Checkout from './container/Checkout/Checkout';
// import Orders from './container/Orders/Orders';
// import Auth from './container/Auth/Auth';
import Logout from './container/Auth/Logout/Logout';


// localStorage
import {connect} from 'react-redux';
import * as actions from './store/actions/index';


// Lazy Loading for components 
import asyncComponent from './hoc/asyncComponent/asyncComponent';

// import(./)  <-- this is a promise
const asyncCheckout = asyncComponent(()=>{
  return import('./container/Checkout/Checkout');
});

const asyncOrder = asyncComponent(()=>{
  return import('./container/Orders/Orders');
});

const asyncAuth = asyncComponent(()=>{
  return import('./container/Auth/Auth');
});





class App extends Component {
  componentDidMount(){
    this.props.onTryAutoSignup();
  }



  render() {
    
    let routes = (
      <Switch>
        <Route path="/auth" component={asyncAuth}/> 
        <Route path="/" exact component={BurgerBuilder}></Route>
        <Redirect to="/" />
      </Switch>
    );

    if(this.props.isAuthenticated){
      routes = (
        <Switch>
          <Route path="/checkout" component={asyncCheckout}></Route>
          <Route path="/orders" component={asyncOrder}/> 

          {/* Toggle between routh Auth and Logout */}
          <Route path="/auth" component={asyncAuth}/> 
          <Route path="/logout" component={Logout}/>
          <Route path="/" exact component={BurgerBuilder}></Route>
          <Redirect to="/" />
        </Switch>
        );
    }
  
    return (
      <div>
        <Layout>
          {routes}
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())

  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
