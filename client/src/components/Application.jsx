// imports
import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';

import Dashboard from './Dashboard/Dashboard.jsx';
import { authenticationActions } from '../actionCreators';
import DotsLoader from './Common/DotsLoader/DotsLoader.jsx';

// globals
const { init } = authenticationActions;

// react class
class Application extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $(document).foundation();
    this.props.initAuthentication();
  }

  loading() {
    return (
      <div className='row'>
        <div className='small-12 columns vertical-align-center' style={{ height: '100vh' }}>
          <DotsLoader size={25} />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div style={{ height: '100%' }}>
        {
          Object.keys(this.props.user).length === 0 ?
            this.loading() :
            <Switch>
              <Route path='/dashboard' component={Dashboard} />
              <Redirect to='/dashboard' />
            </Switch>
        }
      </div>
    );
  }
}

// react-redux mapping methods
const mapStateToProps = (state/* , props*/) => {
  return {
    user: state.domain.user
  };
};

const mapDispatchToProps = (dispatch/* , props*/) => {
  return {
    initAuthentication: () => dispatch(init())
  };
};

// exports
const ApplicationContainer = connect(mapStateToProps, mapDispatchToProps)(Application);
export default ApplicationContainer;