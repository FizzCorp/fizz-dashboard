// imports
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import SimpleDropDown from './SimpleDropDown.jsx';

// globals
const Months = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

// helper methods - hash generation
function generateMonthHash() {
  const currYear = moment().year();
  const currMonth = moment().month();

  let hash = {};
  let monthIdx = 0;
  if (currMonth === 0) {
    hash['-2'] = { text: `November ${currYear - 1}` };
    hash['-1'] = { text: `December ${currYear - 1}` };
  }
  while (monthIdx <= currMonth) {
    hash[`${monthIdx}`] = { text: `${Months[monthIdx]} ${currYear}` };
    monthIdx++;
  }
  return hash;
}

// helper methods - props mapper
function mapPropsToComponentProps(props) {
  let componentProps = {
    ...props,

    handleOnChange: (value/* , text, choice*/) => {
      props.handleOnChange(value);
    }
  };
  const { selectedMonth } = componentProps;
  delete componentProps['selectedMonth'];

  let selectedKey = selectedMonth;
  if (selectedKey == null || selectedKey.length === 0) {
    selectedKey = `${moment().month()}`;
  }

  componentProps.selectedKey = selectedKey;
  return componentProps;
}

// exports
const SimpleMonthPicker = (props) => {
  const componentProps = mapPropsToComponentProps(props);
  return (
    <SimpleDropDown
      {...componentProps}
    />
  );
};
export default SimpleMonthPicker;

// component meta
SimpleMonthPicker.propTypes = {
  hash: PropTypes.object,
  disabled: PropTypes.bool,
  removeable: PropTypes.bool,
  handleOnChange: PropTypes.func,
  selectedMonth: PropTypes.string,

  name: PropTypes.string.isRequired
};

SimpleMonthPicker.defaultProps = {
  sortKeys: true,
  disabled: false,
  removeable: false,
  selectedMonth: null,

  hash: generateMonthHash(),
  handleOnChange: (/* selectedMonth*/) => { }
};