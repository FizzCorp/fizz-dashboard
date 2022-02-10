// imports
import React from 'react';
import PropTypes from 'prop-types';

import { CONSTRAINTS, SEARCH_CHAT } from '../../../../constants';
import SimpleDropDown from '../../../Common/SemanticUI/SimpleDropDown.jsx';

// globals
const { LTE, GTE, BTW } = CONSTRAINTS.SEARCH_CHAT.COMPARISON_OPERATORS;
const { SENTIMENT_SCORE_HASH, SENTIMENT_SCORE_MAPPINGS, COMPARISON_OPERATORS_HASH } = SEARCH_CHAT;

// helper methods - props mapping
function mapPropsForBasicControl(props) {
  const reduxInput = props.input;
  const inputValue = reduxInput.value;

  let componentProps = {
    hash: SENTIMENT_SCORE_HASH,
    placeholder: 'Any (0 - 100)',
    name: 'sentimentScoreMappings',
    advancedView: props.advancedView,

    handleOnChange: (value/* , text, choice*/) => {
      const reduxValue = value ? JSON.stringify(SENTIMENT_SCORE_HASH[value].mapping) : '';
      reduxInput.onChange(reduxValue);
    }
  };

  const selectedKey = SENTIMENT_SCORE_MAPPINGS[inputValue];
  const sentimentJson = (inputValue.length > 0 && selectedKey != null) ? JSON.parse(inputValue) : {};

  componentProps.selectedKey = selectedKey;
  componentProps.sentimentJson = sentimentJson;

  return componentProps;
}

function mapPropsForAdvancedControl(props) {
  const reduxInput = props.input;
  const inputValue = reduxInput.value;

  const sentimentJson = (inputValue.length > 0) ? JSON.parse(inputValue) : {};
  const comparisonOperators = Object.keys(sentimentJson);

  let componentProps = {
    placeholder: 'Score',
    placeholderSelected: false,
    hash: COMPARISON_OPERATORS_HASH,
    advancedView: props.advancedView,
    name: 'sentimentComparisonOperator',

    handleInputChange: (event) => {
      event.preventDefault();
      event.stopPropagation();

      const val = parseInt(event.target.value);
      if (val >= 0 && val <= 100) {
        if (comparisonOperators.length === 2) {
          const otherField = (event.target.name === 'sentimentRange1') ? 'sentimentRange2' : 'sentimentRange1';
          const otherValue = parseInt($(`input[name=${otherField}]`).val());

          sentimentJson[GTE] = Math.min(val, otherValue);
          sentimentJson[LTE] = Math.max(val, otherValue);
        }
        else {
          sentimentJson[comparisonOperators[0]] = val;
        }
        reduxInput.onChange(JSON.stringify(sentimentJson));
      }
    },
    handleOnChange: (value/* , text, choice*/) => {
      if (value) {
        let reduxJson = {};
        if (value === BTW) {
          reduxJson[GTE] = Math.min(sentimentJson[GTE] || 0, sentimentJson[LTE] || 100);
          reduxJson[LTE] = Math.max(sentimentJson[GTE] || 0, sentimentJson[LTE] || 100);
        }
        else {
          reduxJson[value] = sentimentJson[value] || 0;
        }
        reduxInput.onChange(JSON.stringify(reduxJson));
      }
      else {
        reduxInput.onChange('');
      }
    }
  };

  const selectedKey = (comparisonOperators.length === 2) ? BTW : comparisonOperators[0];
  componentProps.selectedKey = selectedKey;
  componentProps.sentimentJson = sentimentJson;

  return componentProps;
}

function mapReduxFieldPropsToComponentProps(props) {
  const componentProps = props.advancedView ? mapPropsForAdvancedControl(props) : mapPropsForBasicControl(props);
  return componentProps;
}

// react class
class SentimentScore extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  render() {
    const advancedView = this.props.advancedView;
    return (
      <div>
        <input type='hidden' name='sentimentScore' value={JSON.stringify(this.props.sentimentJson)} />
        <div>
          {advancedView ? this.getAdvancedControl() : this.getBasicControl()}
        </div>
      </div>
    );
  }

  // control helpers
  getBasicControl() {
    return (
      <div className='field'>
        <SimpleDropDown
          {...this.props}
        />
      </div>
    );
  }

  getAdvancedControl() {
    let range1Val;
    let range2Val;
    const sentimentJson = this.props.sentimentJson;
    const comparisonOperators = Object.keys(sentimentJson);

    if (comparisonOperators.length === 2) {
      range1Val = sentimentJson[GTE];
      range2Val = sentimentJson[LTE];
    }
    else if (comparisonOperators.length === 1) {
      range1Val = sentimentJson[comparisonOperators[0]];
    }

    return (
      <div>
        <div className='field'>
          <SimpleDropDown
            {...this.props}
          />
        </div>
        <div className='field' hidden={range1Val == null}>
          <input
            type='number'
            name='sentimentRange1'
            value={range1Val || 0}
            onChange={this.props.handleInputChange}
          />
        </div>
        <div className='field' hidden={range2Val == null}>
          <input
            type='number'
            name='sentimentRange2'
            value={range2Val || 100}
            onChange={this.props.handleInputChange}
          />
        </div>
      </div>
    );
  }
}

// exports
const ReduxSentimentScore = (props) => {
  const componentProps = mapReduxFieldPropsToComponentProps(props);
  return (
    <SentimentScore
      {...componentProps}
    />
  );
};
export default ReduxSentimentScore;

// component meta
ReduxSentimentScore.propTypes = {
  advancedView: PropTypes.bool
};

ReduxSentimentScore.defaultProps = {
  advancedView: false
};