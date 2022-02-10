// imports
import React from 'react';
import { connect } from 'react-redux';

import { STATES } from '../../constants';
import { billingActions } from '../../actionCreators';

import Invoice from './Invoice.jsx';
import Costing from './Costing.jsx';
import DotsLoader from '../Common/DotsLoader/DotsLoader.jsx';

// globals
const { plans } = billingActions;
const TopMargin = { marginTop: '2%' };
const BottomMargin = { marginBottom: '2%' };

// react class
class Billing extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  componentDidMount() {
    this.props.billingPlans(this.props.billingManagerEmail);
  }

  render() {
    const { plans, fetchPlansStatus } = this.props;
    if (fetchPlansStatus === STATES.UPDATE_FAIL) {
      return this.renderError();
    }

    if (fetchPlansStatus === STATES.UPDATE_IN_PROGRESS || fetchPlansStatus === STATES.UNCHANGED) {
      return this.renderLoading();
    }

    const { tiers, cycle } = plans;
    return (
      <div className='row collapse' style={BottomMargin}>
        <div className='small-12 large-4 columns' style={TopMargin}>
          <Invoice
            billingCycle={cycle}
          />
        </div>
        <div className='small-12 large-8 columns' style={TopMargin}>
          <Costing
            billingTiers={tiers}
          />
        </div>
      </div>
    );
  }

  // render helpers
  renderError() {
    return (
      <div className='ui left aligned segment'>
        {`Couldn't Fetch Plans!`}
      </div>
    );
  }

  renderLoading() {
    return (
      <div className='row'>
        <div className='small-12 vertical-align-center' style={{ height: '80vh' }}>
          <DotsLoader size={20} />
        </div>
      </div>
    );
  }
}

// react-redux mapping methods
const mapStateToProps = (state/* , props*/) => {
  const billing = state.ui.billing.viewState;
  const { plans, fetchPlansState } = billing;

  const billingManagerEmail = state.domain.user.email;
  return {
    plans,
    billingManagerEmail,
    fetchPlansStatus: fetchPlansState
  };
};

const mapDispatchToProps = (dispatch/* , props*/) => {
  return {
    billingPlans: billingManagerEmail => dispatch(plans({ billingManagerEmail }))
  };
};

// exports
const BillingContainer = connect(mapStateToProps, mapDispatchToProps)(Billing);
export default BillingContainer;