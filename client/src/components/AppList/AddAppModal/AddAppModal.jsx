// imports
import React from 'react';
import PropTypes from 'prop-types';
import StepWizard from 'react-step-wizard';

import AddCompany from './AddCompany.jsx';
import AddApplication from './AddApplication.jsx';

// globals
const selectorId = '.ui.modal.add-app-modal';

// exports - react class
export default class AddAppModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      companyData: null
    };
  }

  // react lifecycle
  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  render() {
    return (
      <div className='ui modal add-app-modal'>
        <div className='ui very padded basic segment' style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          {
            this.props.showAddCompany
              ?
              <StepWizard>
                <AddCompany setCompanyData={this.setCompanyData} />
                <AddApplication showPrevButton={true} companyData={this.state.companyData} showIntroText={true} />
              </StepWizard>
              :
              <AddApplication />
          }
        </div>
      </div>
    );
  }

  // modal helpers - general
  getModal() {
    return $(selectorId);
  }

  // modal helpers - show / hide
  show() {
    const modal = this.getModal();

    // modal.form('reset');
    modal.modal({
      inverted: false
    }).modal('setting', 'transition', 'slide up').modal('show');
  }

  remove() {
    this.getModal()
      .modal()
      .remove();
  }

  // event handlers
  handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
  }

  setCompanyData = (companyData, cb) => {
    this.setState({
      companyData: companyData
    }, () => {
      cb && typeof cb === 'function' && cb();
    });
  }
}

// component meta
AddAppModal.propTypes = {
  onRef: PropTypes.func
};

AddAppModal.defaultProps = {
  onRef: (/* ref*/) => { }
};