// imports
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { STATES } from '../../../../../constants';
import { queryActions } from '../../../../../actionCreators';
import StatefulButton from '../../../../Common/SemanticUI/StatefulButton.jsx';

// globals
const exportQueryMessages = queryActions.exportQueryMessages;

// react class
class ExportChatResults extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  render() {
    const { exportingPage, exportResultsBtnStatus, exportResultsLblStatus, exportResultsTotalPages } = this.props;
    const hasError = (exportResultsLblStatus === STATES.UPDATE_FAIL);
    const exporting = (exportResultsBtnStatus === STATES.UPDATE_IN_PROGRESS);

    const displayBtnStyle = (exportResultsTotalPages === 0) ? { display: 'none' } : {};
    const exportingMessage = `Exporting Page ${exportingPage} of ${exportResultsTotalPages}`;
    const errorMessage = `Exported Pages ${exportingPage - 1} of ${exportResultsTotalPages}, retry remaining`;

    return (
      <div className='row' style={displayBtnStyle}>
        {(exporting || hasError) && <div className='content'>{hasError ? errorMessage : exportingMessage}</div>}&nbsp;
        <StatefulButton
          class='mini'
          defaultText='Export'
          id='exportResultsBtn'
          onClick={this.export}
          currentState={exportResultsBtnStatus}
        />
        &nbsp;
      </div>
    );
  }

  // query handlers
  export = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.props.exportQueryMessages();
  }
}

// react-redux mapping methods
const mapStateToProps = (state/*, props*/) => {
  const chatSearch = state.ui.appHome.analytics.chatSearch;
  const exportResultsViewState = chatSearch.resultForm.exportResults.viewState;
  const { exportingPage, exportResultsBtnState, exportResultsLblState, exportResultsTotalPages } = exportResultsViewState;

  return {
    exportingPage,
    exportResultsTotalPages,
    exportResultsBtnStatus: exportResultsBtnState,
    exportResultsLblStatus: exportResultsLblState
  };
};

const mapDispatchToProps = (dispatch/* , props*/) => {
  return {
    exportQueryMessages: () => dispatch(exportQueryMessages())
  };
};

// exports
const ExportChatResultsContainer = connect(mapStateToProps, mapDispatchToProps)(ExportChatResults);
export default withRouter(ExportChatResultsContainer);