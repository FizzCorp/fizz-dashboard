// imports
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { Field, reduxForm, initialize, change } from 'redux-form';

import SentimentScore from './SentimentScore.jsx';
import ReduxDropDown from '../../../Common/SemanticUI/ReduxDropDown.jsx';
import SimpleCheckBox from '../../../Common/SemanticUI/SimpleCheckBox.jsx';
import StatefulButton from '../../../Common/SemanticUI/StatefulButton.jsx';
import ReduxDateRange from '../../../Common/FlatUIDateRange/ReduxDateRange.jsx';

import __ from 'lodash';
import { VALIDATIONS, SEARCH_CHAT, CONSTRAINTS } from '../../../../constants';

// globals
const advanceFields = ['sort', 'matchPhrase', 'age', 'nick', 'channelId', 'build', 'countryCode', 'custom01', 'custom02', 'custom03'];
const fields = advanceFields.slice(1).concat(['searchText', 'spender', 'userId', 'platform']);

const { SORT_ORDER, COMPARISON_OPERATORS } = CONSTRAINTS.SEARCH_CHAT;
const { AGE_HASH, SPENDER_HASH, PLATFORM_HASH, COUNTRY_HASH, SORT_ORDER_HASH, SENTIMENT_SCORE_MAPPINGS } = SEARCH_CHAT;

// helper methods
function mapQueryToFormFields(queryObj) {
  if (!queryObj) {
    return {};
  }

  const paramsJson = queryObj.params_json || {};
  let formFields = JSON.parse(JSON.stringify(paramsJson));

  let sortOrder = formFields['sort'];
  if (sortOrder) {
    sortOrder = sortOrder['timestamp'];
    formFields['sort'] = sortOrder;
  }

  const dateRange = formFields['timestamp'];
  if (dateRange) {
    const endTime = dateRange[COMPARISON_OPERATORS.LTE];
    const startTime = dateRange[COMPARISON_OPERATORS.GTE];

    if (startTime && endTime) {
      formFields['timestamp'] = `${startTime}:${endTime}`;
    }
    else {
      delete formFields['timestamp'];
    }
  }

  const sentimentScore = formFields['sentimentScore'];
  if (sentimentScore) {
    formFields['sentimentScore'] = JSON.stringify(sentimentScore);
  }

  return formFields;
}

function mapSearchPathToFormFields(search) {
  let params = queryString.parse(search);
  params = _.pickBy(params, (val, key) => {
    switch (key) {
      case 'nick': return val;
      case 'userId': return val;
      case 'channelId': return val;
      case 'searchText': return val;
      case 'matchPhrase': return val;
      case 'sort': return (val === SORT_ORDER.ASC || val === SORT_ORDER.DESC);
      default: return false;
    }
  });
  return params;
}

// react class
class SearchCriteriaForm extends React.Component {
  constructor(props) {
    super(props);

    const advanceSearch = Boolean(localStorage.advanceSearch);
    this.state = { advanceFieldsHidden: !advanceSearch };
  }

  // react lifecycle
  componentDidMount() {
    this.props.onRef(this);
    this.init();

    let formFields = this.getValues();
    const sentimentScore = formFields['sentimentScore'];
    if (sentimentScore) {
      formFields['sentimentScore'] = JSON.stringify(sentimentScore);
    }
    this.renderAdvanceSearchQuery(formFields);
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  render() {
    const formName = this.props.form;
    const { dateRange, hiddenFields } = this.props;
    const advanceFieldsHidden = this.state.advanceFieldsHidden;

    return (
      <form className={`ui form ${formName}-form`} ref='searchCriteriaForm' onSubmit={this.submit}>
        <div className='row'>
          <div className='small-12 columns'>
            <div className='float-right'>
              <SimpleCheckBox
                type='slider'
                name='advanceSearch'
                label='Advance Search'
                checked={!advanceFieldsHidden}
                handleOnChange={this.advanceSearchToggle}
              />
            </div>
          </div>
        </div>
        <div className='row' style={{ margin: '15px 0px' }}>
          <div className='small-4 columns'>
            <h3 className='ui dividing header'>{'Words'}</h3>
            <div className='field'>
              <Field
                name='searchText'
                component='input'
                type='text'
                placeholder='All of these words'
              />
            </div>
            <div className='field' hidden={advanceFieldsHidden}>
              <Field
                name='matchPhrase'
                component='input'
                type='text'
                placeholder='This exact phrase'
              />
            </div>
          </div>
          <div className='small-4 columns'>
            <h3 className='ui dividing header'>{'Date Range *'}</h3>
            <div className='field'>
              <Field
                name='timestamp'
                defaultValue={dateRange}
                component={ReduxDateRange}
              />
            </div>
          </div>
          <div className='small-4 columns' hidden={advanceFieldsHidden || hiddenFields['sort']}>
            <h3 className='ui dividing header'>{'Sort By'}</h3>
            <div className='field'>
              <Field
                name='sort'
                hash={SORT_ORDER_HASH}
                component={ReduxDropDown}
                placeholder={SORT_ORDER.RELEVANCE}
              />
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='small-4 columns'>
            <h3 className='ui dividing header'>{'User Info'}</h3>
            <div className='field'>
              <Field
                name='userId'
                component='input'
                type='text'
                placeholder='User ID'
              />
            </div>
            <div className='field' hidden={advanceFieldsHidden}>
              <Field
                name='nick'
                component='input'
                type='text'
                placeholder='Nick'
              />
            </div>
            <div className='field' hidden={advanceFieldsHidden}>
              <Field
                name='age'
                hash={AGE_HASH}
                placeholder='Age (Any)'
                component={ReduxDropDown}
              />
            </div>
            <div className='field'>
              <Field
                name='spender'
                hash={SPENDER_HASH}
                component={ReduxDropDown}
                placeholder='Spender (All inc. Non-Spender)'
              />
            </div>
          </div>
          <div className='small-4 columns'>
            <h3 className='ui dividing header'>{'Sentiment'}</h3>
            <div>
              <Field
                name='sentimentScore'
                component={SentimentScore}
                advancedView={!advanceFieldsHidden}
              />
            </div>
          </div>
          <div className='small-4 columns' hidden={advanceFieldsHidden}>
            <h3 className='ui dividing header'>{'Channel'}</h3>
            <div className='field'>
              <Field
                name='channelId'
                component='input'
                type='text'
                placeholder='Channel ID'
              />
            </div>
          </div>
        </div>
        <div className='row' style={{ margin: '5px 0px' }}>
          <div className='small-12 columns' style={{ padding: 0 }}>
            <div className='row'>
              <div className='small-12 columns' style={{ margin: '15px 0px' }}>
                <h3 className='ui dividing header'>{'Segments'}</h3>
              </div>
            </div>
            <div className='small-4 columns'>
              <div className='field'>
                <Field
                  name='platform'
                  hash={PLATFORM_HASH}
                  component={ReduxDropDown}
                  placeholder='Platform (All)'
                />
              </div>
              <div className='field' hidden={advanceFieldsHidden}>
                <Field
                  name='custom01'
                  component='input'
                  type='text'
                  placeholder='Custom Segment 1'
                />
              </div>
            </div>
            <div className='small-4 columns' hidden={advanceFieldsHidden}>
              <div className='field'>
                <Field
                  name='countryCode'
                  hash={COUNTRY_HASH}
                  component={ReduxDropDown}
                  placeholder='Country (All)'
                />
              </div>
              <div className='field'>
                <Field
                  name='custom02'
                  component='input'
                  type='text'
                  placeholder='Custom Segment 2'
                />
              </div>
            </div>
            <div className='small-4 columns' hidden={advanceFieldsHidden}>
              <div className='field'>
                <Field
                  name='build'
                  component='input'
                  type='text'
                  placeholder='Build'
                />
              </div>
              <div className='field'>
                <Field
                  name='custom03'
                  component='input'
                  type='text'
                  placeholder='Custom Segment 3'
                />
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='small-12 columns'>
            <StatefulButton
              id='searchSubmit'
              defaultText='Search'
              currentState={this.props.searchSubmitStatus}
            />
          </div>
        </div>
      </form>
    );
  }

  // query handlers
  renderQuery(queryObj) {
    this.clearErrors();
    const initialFormData = mapQueryToFormFields(queryObj);

    this.renderAdvanceSearchQuery(initialFormData);
    this.props.initialize(initialFormData);
  }

  renderSearchQuery(search) {
    this.clearErrors();
    const initialFormData = mapSearchPathToFormFields(search);

    this.renderAdvanceSearchQuery(initialFormData);
    this.props.initialize(initialFormData)
      .then(status => $('#searchSubmit').click());
  }

  renderAdvanceSearchQuery(paramsDict) {
    const advanceSearch = Boolean(localStorage.advanceSearch);
    if (advanceSearch) {
      return;
    }

    const intersection = Object.keys(paramsDict).filter(value => -1 !== advanceFields.indexOf(value));
    let advanceFieldPresent = (intersection.length > 0);

    const sentimentScore = paramsDict['sentimentScore'];
    if (sentimentScore && !advanceFieldPresent) {
      const basicSentimentKey = SENTIMENT_SCORE_MAPPINGS[sentimentScore];
      advanceFieldPresent = (basicSentimentKey == null);
    }

    this.setState({ advanceFieldsHidden: !advanceFieldPresent });
  }

  // form handlers
  init() {
    // semantic validation
    const searchChatCriteriaValidator = VALIDATIONS.searchChat.criteria;
    $(this.refs.searchCriteriaForm)
      .form({
        inline: true,
        fields: {
          timestamp: searchChatCriteriaValidator.dateRange
        }
      })// stop refresh on enter press
      .submit(() => false);
  }

  isValid() {
    return $(this.refs.searchCriteriaForm).form('is valid');
  }

  validate() {
    $(this.refs.searchCriteriaForm).form('validate form');
  }

  getValues() {
    let params = {};

    // simple fields
    fields.forEach((field) => {
      const val = $(`input[name=${field}]`).val();
      if (val && val.length > 0) {
        params[field] = val;
      }
    });

    // custom fields --> sort
    const sortOrder = $('input[name=sort]').val();
    if (sortOrder && sortOrder.length > 0) {
      params['sort'] = { 'timestamp': sortOrder };
    }

    // custom fields --> sentiment
    const sentimentScore = JSON.parse($('input[name=sentimentScore]').val());
    if (Object.keys(sentimentScore).length > 0) {
      params['sentimentScore'] = sentimentScore;
    }

    // custom fields --> timestamp
    let timestampValues = $('input[name=timestamp]').val();
    timestampValues = (timestampValues.length > 0) ? timestampValues.split(':') : [null, null];

    const endTime = timestampValues[1];
    const startTime = timestampValues[0];

    if (startTime && endTime) {
      params['timestamp'] = {
        [COMPARISON_OPERATORS.LTE]: endTime,
        [COMPARISON_OPERATORS.GTE]: startTime
      };
    }

    return params;
  }

  clearErrors() {
    $(this.refs.searchCriteriaForm).find('.ui.error.message ul').remove();
    $(this.refs.searchCriteriaForm).find('.error').removeClass('error').find('.prompt').remove();
  }

  // event handlers
  submit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!this.isValid()) {
      return;
    }

    let searchCriteria = this.getValues();
    if (this.state.advanceFieldsHidden) {
      searchCriteria = __.omit(searchCriteria, advanceFields);
    }

    const params = {
      queryData: searchCriteria,
      appId: this.props.currentAppId
    };
    this.props.executeQueryHandler(params);
  }

  advanceSearchToggle = (checked) => {
    const storage = checked ? '1' : '';
    localStorage.setItem('advanceSearch', storage);
    this.setState({ advanceFieldsHidden: !checked });
  }
}

// component meta
SearchCriteriaForm.propTypes = {
  onRef: PropTypes.func,
  dateRange: PropTypes.string,
  hiddenFields: PropTypes.object,
  form: PropTypes.string.isRequired,
  currentAppId: PropTypes.string.isRequired,
  executeQueryHandler: PropTypes.func.isRequired,
  searchSubmitStatus: PropTypes.string.isRequired
};

SearchCriteriaForm.defaultProps = {
  hiddenFields: {},
  onRef: (/* ref*/) => { },
  dateRange: `${moment().endOf('day').subtract(7, 'day').valueOf()}:${moment().endOf('day').subtract(1, 'day').valueOf()}`
};

// react-redux mapping methods
const mapStateToProps = (/* state, props*/) => {
  return {};
};

const mapDispatchToProps = (dispatch, props) => {
  const formName = props.form;
  return {
    initialize: initialFormData => dispatch(initialize(formName, initialFormData)),
    change: (fieldName, fieldValue) => dispatch(change(formName, fieldName, fieldValue))
  };
};

// exports
let SearchCriteriaFormContainer = reduxForm({
  destroyOnUnmount: false
})(SearchCriteriaForm);

SearchCriteriaFormContainer = connect(mapStateToProps, mapDispatchToProps)(SearchCriteriaFormContainer);
export default SearchCriteriaFormContainer;