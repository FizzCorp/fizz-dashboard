// imports
import React from 'react';
import { connect } from 'react-redux';
import { STATES } from '../../../constants';
import { appActions } from '../../../actionCreators';

import TabHeader from '../TabHeader.jsx';
import DotsLoader from '../../Common/DotsLoader/DotsLoader.jsx';
import SimpleCheckBox from '../../Common/SemanticUI/SimpleCheckBox.jsx';

// globals
const { fetchPreferences, updatePreferences } = appActions;

// react class
class Preferences extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  componentDidMount() {
    this.fetchPreferences();
  }

  render() {
    const { fetchPreferencesStatus } = this.props;
    const isLoading = (fetchPreferencesStatus === STATES.UPDATE_IN_PROGRESS);
    return isLoading ? this.renderLoading() : this.renderPreferences();
  }

  // render helpers
  renderLoading() {
    return (
      <div className='vertical-align-center' style={{ height: '50vh' }}>
        <DotsLoader size={20} />
      </div>
    );
  }

  renderPreferences() {
    const { app, fields } = this.props;
    return (
      <div>
        <TabHeader sectionHeading={`App Preferences`} />
        <h2 className='ui blue header'>{app.name}</h2>
        <div className='preferences'>
          <table className='ui celled table'>
            <thead></thead>
            <tbody>
              <tr>
                <td className='collapsing'>
                  <div className='ui ribbon blue label'> {'Forced Content Moderation'} </div>
                </td>
                <td>
                  <SimpleCheckBox
                    label=' '
                    type='slider'
                    name='forcedModeration'
                    checked={fields.force_content_moderation}
                    handleOnChange={this.updateForcedModeration}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // event handlers
  fetchPreferences = () => {
    const { app, fetchPreferences } = this.props;
    const { id, clientSecret } = app;
    fetchPreferences({ appId: id, appSecret: clientSecret });
  }

  updateForcedModeration = (checked) => {
    const { app, updatePreferences } = this.props;
    const { id, clientSecret } = app;
    const appMeta = { appId: id, appSecret: clientSecret };
    updatePreferences({ appMeta, fields: { force_content_moderation: checked } });
  }
}

// react-redux mapping methods
const mapStateToProps = (state, props) => {
  const currentAppId = props.match.params.appId;
  const preferencesViewState = state.ui.appHome.preferences.viewState;
  const { fields, fetchPreferencesState, updatePreferencesState } = preferencesViewState;

  return {
    fields,
    app: state.domain.apps.byIds[currentAppId],
    fetchPreferencesStatus: fetchPreferencesState,
    updatePreferencesStatus: updatePreferencesState
  };
};

const mapDispatchToProps = (dispatch/* , props*/) => {
  return {
    fetchPreferences: params => dispatch(fetchPreferences(params)),
    updatePreferences: params => dispatch(updatePreferences(params))
  };
};

// exports
const PreferencesContainer = connect(mapStateToProps, mapDispatchToProps)(Preferences);
export default PreferencesContainer;