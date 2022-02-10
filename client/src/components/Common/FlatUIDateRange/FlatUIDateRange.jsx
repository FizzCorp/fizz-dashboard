// imports
import '../FlatPicker/FlatPicker.css';

import React from 'react';
import moment from 'moment';
import flatpickr from 'flatpickr';
import PropTypes from 'prop-types';

// exports
export default class FlatUIDateRange extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { id, end, start, minDate, maxDate } = this.props;
    const config = {
      mode: 'range',
      minDate: minDate,
      maxDate: maxDate,
      dateFormat: 'M j, Y',
      defaultDate: start && end && [start, end] || undefined,

      onClose: (selectedDates/* , dateStr, instance*/) => {
        // update date
        let [selectedStart, selectedEnd] = [null, null];
        if (selectedDates && selectedDates.length === 2) {
          selectedEnd = this.getEndOfDay(selectedDates[1]);
          selectedStart = this.getStartOfDay(selectedDates[0]);
        }
        this.props.handleOnChange(selectedStart, selectedEnd);

        // refresh fields
        $(`#${id} input[name=${id}]`).blur();
        $(`#${id} input[name=${id}-text]`).blur();
      }
    };

    this.fp = flatpickr(`#${id} input[name=${id}-text]`, config);
  }

  componentWillReceiveProps(nextProps) {
    this.fp.setDate([nextProps.start, nextProps.end]);
  }

  render() {
    const { id, end, start, disabled } = this.props;
    const disabledClass = disabled ? 'disabled' : '';
    const dateRangeValue = (start && end) ? `${start}:${end}` : '';

    return (
      <div className={`ui fluid icon ${disabledClass} input flat-ui-date-range`} id={id}>
        <i className='calendar icon'></i>
        <input type='hidden' name={id} value={dateRangeValue} />
        <input type='text' name={`${id}-text`} placeholder='Start to End Date' />
      </div>
    );
  }

  getEndOfDay(date) {
    return moment(date).endOf('day').valueOf();
  }

  getStartOfDay(date) {
    return moment(date).startOf('day').valueOf();
  }
}

// component meta
FlatUIDateRange.propTypes = {
  id: PropTypes.string.isRequired,

  end: PropTypes.number,
  start: PropTypes.number,
  minDate: PropTypes.number,
  maxDate: PropTypes.number,

  disabled: PropTypes.bool,
  handleOnChange: PropTypes.func
};

FlatUIDateRange.defaultProps = {
  minDate: null,
  disabled: false,
  handleOnChange: (/* startTS, endTS*/) => { },
  maxDate: moment().endOf('day').subtract(1, 'day').valueOf()
};