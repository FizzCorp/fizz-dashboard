// imports
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { appActions } from '../../../actionCreators';
import StatefulButton from '../../Common/SemanticUI/StatefulButton.jsx';

// globals
const { create } = appActions;
const selectorId = '.ui.form.add-application';

// react class
class AddApplication extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  componentDidMount() {
    this.init();
  }

  render() {
    const props = this.props;
    return (
      <div style={{ backgroundColor: '#fff' }}>
        <h3 className='ui center aligned icon grey header' style={{ fontWeight: 400 }}>
          <i className='magic yellow inverted icon'></i>
          {'Create your application'}
        </h3>
        <form className='ui form add-application' onSubmit={this.handleSubmit}>
          <div className='field'>
            <label>{'Application name'}</label>
            <input type='text' name='applicationName' placeholder='' />
          </div>
          <br /><br />
          <div style={{ float: 'right' }}>
            <div style={{ float: 'right' }}>
              <StatefulButton
                defaultText='Create'
                successText='App created'
                errorText='App not created, please retry'
                currentState={this.props.createAppState}
              />
            </div>
            {
              props.showPrevButton &&
              <StatefulButton
                defaultText='Back'
                onClick={this.backClicked}
                style={{ marginRight: '10px' }}
              />
            }
          </div>
        </form>
        <br/>
        {this.props.showIntroText && <center style={{clear: 'both'}}>(Latest SDK release will be available after this step)</center>}
      </div>
    );
  }

  // form handlers
  init() {
    this.getForm().form({
      inline: true,
      fields: {
        applicationName: {
          optional: false,
          rules: [{ type: 'empty' }]
        }
      }
    })// stop refresh on enter press
      .submit(() => false);
  }

  getForm() {
    return $(selectorId);
  }

  // event handlers
  backClicked = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.previousStep();
  }

  handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!this.getForm().form('is valid')) {
      return;
    }

    const applicationName = $(`${selectorId} input[name=applicationName]`).val();
    const data = {
      appName: applicationName,
      userId: this.props.userId
    };

    if (this.props.companyData) {
      data.companyId = this.props.companyData.name;
      data.requestedFeatures = this.props.companyData.features;
      data.requestedPlatforms = this.props.companyData.platforms;
    }

    this.props.create(data);
  }
}

// component meta
AddApplication.propTypes = {
  showPrevButton: PropTypes.bool.isRequired,
  companyData: PropTypes.exact({
    name: PropTypes.string.isRequired,
    features: PropTypes.arrayOf(PropTypes.string).isRequired,
    platforms: PropTypes.arrayOf(PropTypes.string).isRequired
  })
};

AddApplication.defaultProps = {
  showPrevButton: false
};

// react-redux mapping methods
const mapStateToProps = (state/* , props*/) => {
  const userId = state.domain.user.id;
  const createAppState = state.ui.appList.viewState.createAppState;

  return {
    userId,
    createAppState
  };
};

const mapDispatchToProps = (dispatch/* , props*/) => {
  return {
    create: (params) => {
      return dispatch(create(params, {
        afterSuccessCb: (result) => {
          document.location.href = `${document.location.href}/${result.data[0].id}/keys`;
        }
      }));
    }
  };
};

// exports
const AddApplicationContainer = connect(mapStateToProps, mapDispatchToProps)(AddApplication);
export default withRouter(AddApplicationContainer);