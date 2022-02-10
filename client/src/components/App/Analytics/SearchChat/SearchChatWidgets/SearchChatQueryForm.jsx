// imports
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Field, reduxForm, initialize } from 'redux-form';

import YesNoAlert from '../../../../Common/Overlays/YesNoAlert.jsx';
import ReduxDropDown from '../../../../Common/SemanticUI/ReduxDropDown.jsx';
import StatefulButton from '../../../../Common/SemanticUI/StatefulButton.jsx';

import { queryActions, notificationActions } from '../../../../../actionCreators';
import { STATES, VALIDATIONS, CONSTRAINTS, REDUX_FORMS } from '../../../../../constants';

// globals
const formName = REDUX_FORMS.searchChatQuery;
const { QueryTypes, NotificationTypes } = CONSTRAINTS;

const deleteQuery = queryActions.removeQueryMessages;
const fetchQueryList = queryActions.listQueryMessages;
const fetchNotificationList = notificationActions.list;

// helper methods
function mapQueryToFormFields(queryObj) {
  if (!queryObj) {
    return {};
  }

  const formFields = {
    query: queryObj.id,
    title: queryObj.title,
    notification: queryObj.notification
  };
  return formFields;
}

// react class
class SearchChatQueryForm extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  componentDidMount() {
    const currentAppId = this.props.currentAppId;
    const fetchQueryParams = {
      appId: currentAppId,
      queryType: QueryTypes.messages
    };
    const fetchNotificationParams = {
      appId: currentAppId,
      notificationType: NotificationTypes.slackwebhook
    };

    this.props.onRef(this);
    this.props.fetchQueryList(fetchQueryParams);
    this.props.fetchNotificationList(fetchNotificationParams);

    this.init();
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
    this.deleteQueryModal.remove();
  }

  render() {
    return (
      <div className='row collapse'>
        <div className='small-12 xlarge-6 columns'>
          <form className='ui form' ref='querySelectForm' onSubmit={this.submitQueryDelete}>
            <div className='two fields'>
              <div className='field'>
                <label>{'Select Query'}</label>
                {this.renderQueriesWRTUIState()}
              </div>
            </div>
            <StatefulButton
              id='deleteSubmitBtn'
              style={{ display: 'none' }}
            />
          </form>
          <form className='ui form' ref='queryInfoForm' onSubmit={this.submitQueryInfo}>
            <div className='two fields'>
              <div className='field'>
                <label>{'Title'}</label>
                <Field
                  name='title'
                  component='input'
                  type='text'
                  placeholder='Enter title for query'
                />
              </div>
              <div className='field'>
                <label>{'Triggers'}</label>
                {this.renderNotificationsWRTAppState()}
              </div>
            </div>
            <StatefulButton
              defaultText='Save'
              currentState={this.props.queryCreateUpdateSubmitStatus}
            />
            <StatefulButton
              color='red'
              defaultText='Delete'
              onClick={this.delete}
            />
          </form>
          <YesNoAlert
            id='delete-query'
            onRef={ref => (this.deleteQueryModal = ref)}
          />
        </div>
      </div>
    );
  }

  // render helpers
  renderQuery(queryObj) {
    this.clearErrors();

    const initialFormData = mapQueryToFormFields(queryObj);
    this.props.initialize(initialFormData);
  }

  renderQueriesWRTUIState() {
    let QUERIES = {};
    let disableQueries = true;

    if (this.props.queryFetchStatus === STATES.UPDATED) {
      const queries = this.props.queries;
      Object.keys(queries).forEach((queryId) => {
        disableQueries = false;
        const query = queries[queryId];
        QUERIES[queryId] = { text: query.title };
      });
    }

    return (
      <Field
        name='query'
        hash={QUERIES}
        placeholder='Queries'
        component={ReduxDropDown}
        disabled={disableQueries}
        placeholderSelected={false}
        onChange={(event, newValue/* , previousValue*/) => {
          const queryId = newValue;
          this.props.onQuerySelect(queryId);
        }}
      />
    );
  }

  renderNotificationsWRTAppState() {
    let NOTIFICATIONS = {};
    let disableNotifications = true;

    if (this.props.fetchNotificationStatus === STATES.UPDATED) {
      const notifications = this.props.notifications;
      Object.keys(notifications).forEach((notificationId) => {
        disableNotifications = false;
        const notification = notifications[notificationId];
        NOTIFICATIONS[notificationId] = { text: notification.title };
      });
    }

    return (
      <Field
        name='notification'
        hash={NOTIFICATIONS}
        component={ReduxDropDown}
        placeholderSelected={false}
        placeholder='Select to attach'
        disabled={disableNotifications}
      />
    );
  }

  // form handlers
  init() {// semantic validation
    const searchChatQueryValidator = VALIDATIONS.searchChat.query;
    $(this.refs.queryInfoForm)
      .form({
        inline: true,
        fields: {
          title: searchChatQueryValidator.queryTitle
        }
      })// stop refresh on enter press
      .submit(() => false);

    $(this.refs.querySelectForm).form({
      inline: true,
      fields: {
        query: searchChatQueryValidator.query
      }
    });
  }

  clearErrors() {
    $(this.refs.queryInfoForm).find('.ui.error.message ul').remove();
    $(this.refs.queryInfoForm).find('.error').removeClass('error').find('.prompt').remove();

    $(this.refs.querySelectForm).find('.ui.error.message ul').remove();
    $(this.refs.querySelectForm).find('.error').removeClass('error').find('.prompt').remove();
  }

  // query handlers
  delete = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.clearErrors();
    $('#deleteSubmitBtn').click();
  }

  submitQueryInfo = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.clearErrors();
    const isValid = $(this.refs.queryInfoForm).form('is valid');
    if (!isValid) {
      return;
    }

    const { handleSubmit } = this.props;
    handleSubmit(event);
  }

  submitQueryDelete = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const isValid = $(this.refs.querySelectForm).form('is valid');
    if (!isValid) {
      return;
    }

    const alertJson = {
      icon: 'trash',
      title: 'Delete Query',
      message: 'Please confirm',

      onApprove: () => {
        const params = {
          appId: this.props.currentAppId,
          queryId: $('input[name=query]').val()
        };
        this.props.deleteQuery(params);
      }
    };
    this.deleteQueryModal.show(alertJson);
  }
}

// component meta
SearchChatQueryForm.propTypes = {
  onRef: PropTypes.func,
  onQuerySelect: PropTypes.func
};

SearchChatQueryForm.defaultProps = {
  onRef: (/* ref*/) => { },
  onQuerySelect: (/* queryId*/) => { }
};

// react-redux mapping methods
const mapStateToProps = (state, props) => {
  const currentAppId = props.match.params.appId;
  const chatSearch = state.ui.appHome.analytics.chatSearch;
  const searchChatQueryFormViewState = chatSearch.queryForm.viewState;

  return {
    currentAppId,
    onRef: props.onRef,
    onQuerySelect: props.onQuerySelect,
    queries: state.domain.queries.messages.byIds,
    notifications: state.domain.notifications.byIds,
    queryFetchStatus: searchChatQueryFormViewState.queryFetchState,
    fetchNotificationStatus: state.application.notifications.fetchNotificationState,
    queryCreateUpdateSubmitStatus: searchChatQueryFormViewState.queryCreateUpdateSubmitState
  };
};

const mapDispatchToProps = (dispatch/* , props*/) => {
  return {
    deleteQuery: params => dispatch(deleteQuery(params)),
    fetchQueryList: params => dispatch(fetchQueryList(params)),
    fetchNotificationList: params => dispatch(fetchNotificationList(params)),
    initialize: initialFormData => dispatch(initialize(formName, initialFormData))
  };
};

// exports
let SearchChatQueryFormContainer = reduxForm({
  form: formName,
  destroyOnUnmount: false
})(SearchChatQueryForm);

SearchChatQueryFormContainer = connect(mapStateToProps, mapDispatchToProps)(SearchChatQueryFormContainer);
export default withRouter(SearchChatQueryFormContainer);