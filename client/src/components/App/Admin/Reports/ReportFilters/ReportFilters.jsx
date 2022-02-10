// imports
import React from 'react';
import { connect } from 'react-redux';

import moment from 'moment';
import { FIZZ_CHAT } from '../../../../../constants';
import { reportActions } from '../../../../../actionCreators';

import SimpleDropDown from '../../../../Common/SemanticUI/SimpleDropDown.jsx';
import FlatUIDateRange from '../../../../Common/FlatUIDateRange/FlatUIDateRange.jsx';

// globals
const { fetchUsers } = reportActions;

// react class
class ReportFilters extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  componentDidMount() {
    const { end, start, locale, channelId, fetchReportedUsers } = this.props;
    fetchReportedUsers({ end, start, locale, channelId });
  }

  render() {
    const { end, start, locale, channelId, fetchReportedUsers } = this.props;
    return (
      <div className='row small-collapse medium-uncollapse'>
        <div className='small-12 medium-4 columns' style={{ paddingLeft: '0px' }}>
          <SimpleDropDown
            name='locale'
            selectedKey={locale}
            placeholder='Locale (All)'
            hash={FIZZ_CHAT.LOCALE_HASH}
            handleOnChange={(value/* , text, choice*/) => {
              const localeP = (value.length > 0) ? value : undefined;
              fetchReportedUsers({ end, start, channelId, locale: localeP });
            }}
          />
        </div>
        <div className='show-for-small-only small-12 columns' style={{ paddingBottom: '5px' }} />
        <div className='ui input small-12 medium-4 columns'>
          <input
            type='text'
            name='channelId'
            defaultValue={channelId}
            placeholder='Filter Reports by Channel ID'
            onKeyUp={(event) => {
              event.preventDefault();
              event.stopPropagation();

              if (event.keyCode !== 13) {
                return;
              }

              const { value } = event.target;
              const channelIdP = (value.length > 0) ? value : undefined;
              if (channelIdP !== channelId) {
                fetchReportedUsers({ end, start, locale, channelId: channelIdP });
              }
            }}
          />
        </div>
        <div className='show-for-small-only small-12 columns' style={{ paddingBottom: '5px' }} />
        <div className='small-12 medium-4 columns' style={{ paddingRight: '0px' }}>
          <FlatUIDateRange
            id='timeRange'
            end={end}
            start={start}
            maxDate={moment().endOf('day').valueOf()}
            handleOnChange={(startP, endP) => {
              fetchReportedUsers({ locale, channelId, end: endP, start: startP });
            }}
          />
        </div>
      </div>
    );
  }
}

// react-redux mapping methods
const mapStateToProps = (state/* , props*/) => {
  const reportsViewState = state.ui.appHome.admin.reports.viewState;
  const { end, start, locale, channelId } = reportsViewState;

  return { end, start, locale, channelId };
};

const mapDispatchToProps = (dispatch/* , props*/) => {
  return {
    fetchReportedUsers: params => dispatch(fetchUsers(params))
  };
};

// exports
const ReportFiltersContainer = connect(mapStateToProps, mapDispatchToProps)(ReportFilters);
export default ReportFiltersContainer;