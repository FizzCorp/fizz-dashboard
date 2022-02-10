// imports
import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { STATES } from '../../../../../constants';
import { chatActions } from '../../../../../actionCreators';
import DotsLoader from '../../../../Common/DotsLoader/DotsLoader.jsx';
import SimplePageControl from '../../../../Common/SemanticUI/SimplePageControl.jsx';
import { SimpleAccordion, SimpleAccordionSectionTitle } from '../../../../Common/SemanticUI/SimpleAccordion.jsx';

// globals
const PAGE_SIZE = 10;
const { fetchAdminLogsHistory } = chatActions;

// react class
class AdminLogs extends React.Component {
  constructor(props) {
    super(props);
    this.state = { currentPage: 0 };
  }

  // react lifecycle
  render() {
    const { validProfile, fetchAdminLogsHistoryStatus } = this.props;
    if (!validProfile) {
      return (<div />);
    }

    const isLoading = (fetchAdminLogsHistoryStatus === STATES.UPDATE_IN_PROGRESS);
    return (
      <div className='row'>
        <div className='small-12 columns'>
          <div className='ui segment' style={{ marginBottom: '10px' }}>
            <SimpleAccordion
              name='adminLogMessages'
              handleOnOpened={this.fetchLogMessages}
              sections={[{
                id: 'logsLoader',
                title: <SimpleAccordionSectionTitle textLeft={'View Logs'} />,
                content: isLoading ? this.renderLoading() : this.renderMessages()
              }]}
            />
          </div>
        </div>
      </div>
    );
  }

  // render helpers
  renderLoading() {
    // the first div is used to byPass semantic accordian display override
    return (
      <div>
        <div className='vertical-align-center' style={{ marginBottom: '10px' }}>
          <DotsLoader size={15} />
        </div>
      </div>
    );
  }

  renderMessages() {
    const { adminLogs } = this.props;
    const { currentPage } = this.state;

    const totalLogs = adminLogs.length;
    if (totalLogs === 0) {
      return (<div className='content'>{'No Logs Yet!'}</div>);
    };

    return (
      <table className='ui selectable celled table search-result-cells'>
        <thead><tr>
          <th className='wide'>{'Log'}</th>
          <th className='wide'>{'Created'}</th>
        </tr></thead>
        <tbody>
          {
            adminLogs.slice(currentPage, currentPage + PAGE_SIZE).map((logItem, idx) => {
              return (
                <tr key={idx}>
                  <td className='id-info'>{logItem.body}</td>
                  <td className='general-info'>{moment(logItem.created).format('lll')}</td>
                </tr>
              );
            })
          }
        </tbody>
        <tfoot>
          <tr>
            <th colSpan='2' style={{ marginBottom: '10px' }}>
              <SimplePageControl
                currentPage={currentPage}
                totalPages={totalLogs / PAGE_SIZE}
                handlePageSelect={selectedPage => this.setState({ currentPage: selectedPage })}
              />
            </th>
          </tr>
        </tfoot>
      </table>
    );
  }

  // event handlers
  fetchLogMessages = (/* sectionId*/) => {
    const { fetchAdminLogsHistory } = this.props;
    fetchAdminLogsHistory();
  }
}

// react-redux mapping methods
const mapStateToProps = (state, props) => {
  const currentAppId = props.match.params.appId;

  const config = state.domain.apps.byIds[currentAppId].config;
  const chatViewState = state.ui.appHome.admin.chat.viewState;
  const { adminLogs, fetchAdminLogsHistoryState } = chatViewState;

  const { adminId, adminNick } = config;
  const validProfile = (adminId && adminId.length > 0 && adminNick && adminNick.length > 0);

  return {
    adminLogs,
    validProfile,
    fetchAdminLogsHistoryStatus: fetchAdminLogsHistoryState
  };
};

const mapDispatchToProps = (dispatch/* , props*/) => {
  return {
    fetchAdminLogsHistory: params => dispatch(fetchAdminLogsHistory(params))
  };
};

// exports
const AdminLogsContainer = connect(mapStateToProps, mapDispatchToProps)(AdminLogs);
export default withRouter(AdminLogsContainer);