// imports
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import moment from 'moment';
import { moderationActions } from '../../../../actionCreators';
import { STATES, FIZZ_CHAT, VALIDATIONS } from '../../../../constants';

import DotsLoader from '../../../Common/DotsLoader/DotsLoader.jsx';
import SimpleDropDown from '../../../Common/SemanticUI/SimpleDropDown.jsx';
import StatefulButton from '../../../Common/SemanticUI/StatefulButton.jsx';
import SimplePageControl from '../../../Common/SemanticUI/SimplePageControl.jsx';

// globals
const PAGE_SIZE = 6;
const { fetchStatus, updateStatus } = moderationActions;

const { ModerationAction } = FIZZ_CHAT;
const DurationHash = {
  '1': { text: '1 Day' },
  '2': { text: '2 Days' },
  '3': { text: '3 Days' },
  '7': { text: '7 Days' },
  '15': { text: '15 Days' },
  // '30': { text: '1 Month' },
  '90': { text: '3 Months' },
  // '365': { text: '1 Year' },
  '1095': { text: '3 Years' }
};

// helper methods
function getCurrentStatusText(isMuted, isBanned) {
  let statusText = (!isMuted && !isBanned) ? 'None, ' : '';
  statusText = isMuted ? 'Muted, ' : statusText;
  statusText = isBanned ? `${statusText}Banned, ` : statusText;
  statusText = statusText.slice(0, -2);

  return statusText;
}

// react class
class UserModerationModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 0,
      userId: undefined,
      channelId: undefined
    };
  }

  // react lifecycle
  componentDidMount() {
    this.props.onRef(this);

    this.init();
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  componentWillReceiveProps(newProps) {
    const { moderationAction, updateModerationStatus } = this.props;
    const oldStatus = updateModerationStatus[moderationAction];
    const newStatus = newProps.updateModerationStatus[moderationAction];

    if (oldStatus === STATES.UPDATE_FAIL && newStatus === STATES.UNCHANGED) {
      this.getModal().modal('hide');
    }
  }

  render() {
    const { userId } = this.state;
    const { fetchModerationHistoryStatus } = this.props;
    const renderLoading = (fetchModerationHistoryStatus === STATES.UPDATE_IN_PROGRESS);

    return (
      <div className='ui basic modal moderate-user'>
        <div className='scrollable content'>
          {this.renderModerationForm()}
          {renderLoading && this.renderLoading()}
          {!renderLoading && userId && this.renderModerationList()}
        </div>
      </div>
    );
  }

  // render helpers
  renderLoading() {
    return (
      <div className='vertical-align-center'>
        <DotsLoader
          size={20}
          color='white'
        />
      </div>
    );
  }

  renderModerationForm() {
    this.clearErrors();

    const { userId, channelId } = this.state;
    const { fetchModerationHistoryStatus } = this.props;
    const isLoading = (fetchModerationHistoryStatus === STATES.UPDATE_IN_PROGRESS);

    $('input[name=reportUserId]').val(userId || '');
    $('input[name=reportChannelId]').val(channelId || '');

    return (
      <div className='ui segment'>
        <form ref='moderateUserForm' className='ui form row small-collapse medium-uncollapse' onSubmit={this.handleDirectModeration}>
          <div className='field small-12 medium-4 columns' style={{ paddingLeft: '0px' }}>
            <input type='text' name='reportUserId' disabled={isLoading} placeholder={`User's ID`} style={{ borderRadius: '4px' }} />
          </div>
          <div className='show-for-small-only small-12 columns' style={{ paddingBottom: '5px' }} />
          <div className='field small-12 medium-4 columns'>
            <input type='text' name='reportChannelId' disabled={isLoading} placeholder={`Channel's ID`} style={{ borderRadius: '4px' }} />
          </div>
          <div className='show-for-small-only small-12 columns' style={{ paddingBottom: '5px' }} />
          <div className='small-12 medium-4 columns' style={{ paddingRight: '0px' }}>
            <StatefulButton
              class='fluid'
              defaultText='Search'
              currentState={fetchModerationHistoryStatus}
            />
          </div>
        </form>
      </div>
    );
  }

  renderModerationList() {
    return (
      <div>
        {this.renderStatusHistory()}
        {this.renderActionControls()}
      </div>
    );
  }

  renderStatusHistory() {
    const { status } = this.props;
    const { currentPage } = this.state;

    const { history, isMuted, isBanned } = status;
    const totalMessages = history.length;
    const currentStatus = getCurrentStatusText(isMuted, isBanned);

    return (
      <table className='ui selectable celled table search-result-cells'>
        {
          totalMessages !== 0 &&
          <thead>
            <tr>
              <th className='wide'>{'Status'}</th>
              <th className='wide'>{'Start'}</th>
              <th className='wide'>{'End'}</th>
              <th className='wide'>{'Admin ID'}</th>
              <th className='wide'>{'Admin Nick'}</th>
            </tr>
          </thead>
        }
        <tbody>
          {
            history.slice(currentPage, currentPage + PAGE_SIZE).map((historyItem) => {
              const { id, end, start, status, adminId, adminNick } = historyItem;
              return (
                <tr key={id}>
                  <td className='general-info'>{status}</td>
                  <td className='general-info'>{start ? moment(start).format('lll') : '-'}</td>
                  <td className='general-info'>{end ? moment(end).format('lll') : '-'}</td>
                  <td className='general-info'>{adminId || '-'}</td>
                  <td className='general-info'>{adminNick || '-'}</td>
                </tr>
              );
            })
          }
        </tbody>
        <tfoot>
          <tr>
            <th colSpan='5' style={{ marginBottom: '10px' }}>
              {`Current Status: ${currentStatus}`}
              <SimplePageControl
                currentPage={currentPage}
                totalPages={totalMessages / PAGE_SIZE}
                handlePageSelect={selectedPage => this.setState({ currentPage: selectedPage })}
              />
            </th>
          </tr>
        </tfoot>
      </table>
    );
  }

  renderActionControls() {
    const { channelId } = this.state;
    const { ban, mute, unban, unmute } = ModerationAction;
    const { updateModerationStatus, status: { isMuted, isBanned } } = this.props;

    const banBtnAction = isBanned ? unban : ban;
    const muteBtnAction = isMuted ? unmute : mute;
    const banBtnIcon = isBanned ? 'unlock alternate' : 'ban';
    const muteBtnIcon = isMuted ? 'microphone' : 'microphone slash';

    return (
      <div className='row ui segment'>
        <div className='small-12 medium-6 columns'>
          <SimpleDropDown
            defaultKey='1'
            name='duration'
            removeable={false}
            hash={DurationHash}
          />
        </div>
        <div className='show-for-small-only small-12 columns' style={{ paddingBottom: '5px' }} />
        <div className='small-6 medium-3 columns'>
          <StatefulButton
            color='red'
            icon={banBtnIcon}
            disabled={!channelId}
            class='labeled icon fluid'
            defaultText={banBtnAction}
            onClick={this.changeUserStatus(banBtnAction)}
            currentState={updateModerationStatus[banBtnAction]}
          />
        </div>
        <div className='small-6 medium-3 columns'>
          <StatefulButton
            icon={muteBtnIcon}
            class='labeled icon fluid'
            defaultText={muteBtnAction}
            onClick={this.changeUserStatus(muteBtnAction)}
            currentState={updateModerationStatus[muteBtnAction]}
          />
        </div>
      </div>
    );
  }

  // modal helpers - general
  getModal() {
    return $('.ui.basic.modal.moderate-user');
  }

  // modal helpers - show / hide
  remove() {
    this.getModal()
      .modal()
      .remove();
  }

  show(params = {}) {
    const { userId, channelId } = params;
    const { currentAppId, currentAppSecret, fetchUserModerationStatus } = this.props;
    userId && fetchUserModerationStatus({ userId, channelId, appId: currentAppId, appSecret: currentAppSecret });

    this.getModal()
      .modal({ autofocus: false, observeChanges: true })
      .modal('show');

    this.setState({ userId, channelId });
  }

  // form handlers
  init() {// semantic validation
    const moderationValidator = VALIDATIONS.moderation;
    $(this.refs.moderateUserForm)
      .form({
        inline: true,
        fields: {
          reportUserId: moderationValidator.userId
        }
      })// stop refresh on enter press
      .submit(() => false);
  }

  clearErrors() {
    $(this.refs.moderateUserForm).find('.ui.error.message ul').remove();
    $(this.refs.moderateUserForm).find('.error').removeClass('error').find('.prompt').remove();
  }

  // event handlers
  handleDirectModeration = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const isValid = $(this.refs.moderateUserForm).form('is valid');
    if (!isValid) {
      return;
    }

    const userId = $('input[name=reportUserId]').val();
    const channelId = $('input[name=reportChannelId]').val();

    const { currentAppId, currentAppSecret, fetchUserModerationStatus } = this.props;
    fetchUserModerationStatus({ userId, channelId, appId: currentAppId, appSecret: currentAppSecret });
    this.setState({ userId, channelId });
  }

  changeUserStatus = (moderationAction) => {
    return (event) => {
      event.preventDefault();
      event.stopPropagation();

      const { userId, channelId } = this.state;
      const days = parseInt($('input[name=duration]').val());
      const { currentAppId, currentAppSecret, updateUserModerationStatus } = this.props;
      updateUserModerationStatus({ days, userId, channelId, moderationAction, appId: currentAppId, appSecret: currentAppSecret });
    };
  }
}

// component meta
UserModerationModal.propTypes = {
  onRef: PropTypes.func
};

UserModerationModal.defaultProps = {
  onRef: (/* ref*/) => { }
};

// react-redux mapping methods
const mapStateToProps = (state, props) => {
  const currentAppId = props.match.params.appId;
  const currentAppSecret = state.domain.apps.byIds[currentAppId].clientSecret;

  const moderationViewState = state.ui.appHome.admin.moderation.viewState;
  const { status, fetchStatusState, updateStatusState, moderationAction } = moderationViewState;

  return {
    status,
    currentAppId,
    currentAppSecret,
    moderationAction,
    updateModerationStatus: updateStatusState,
    fetchModerationHistoryStatus: fetchStatusState
  };
};

const mapDispatchToProps = (dispatch/* , props*/) => {
  return {
    fetchUserModerationStatus: params => dispatch(fetchStatus(params)),
    updateUserModerationStatus: params => dispatch(updateStatus(params))
  };
};

// exports
const UserModerationModalContainer = connect(mapStateToProps, mapDispatchToProps)(UserModerationModal);
export default withRouter(UserModerationModalContainer);