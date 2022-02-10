// imports
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import __ from 'lodash';
import numeraljs from 'numeraljs';

// globals
const BottomMargin = { marginBottom: '2%' };
const ChatCostMeta = {
  costingUnit: 'MAU',
  serviceName: 'Fizz Chat Service (Monthly)'
};
const AnalyticsCostMeta = {
  costingUnit: 'MAU',
  serviceName: 'Fizz Analytics Service (Monthly)'
};
const TranslationCostMeta = {
  costingUnit: 'Words / Month',
  serviceName: 'Fizz Translation Service (Monthly)'
};

// react class
class Costing extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const totalJson = this.props.totalMetrics || {};
    const { monthlyActiveUsers, monthlyTranslatedWords } = totalJson;

    const { billingTiers } = this.props;
    const { chat, analytics, translation } = billingTiers;

    const hideAnalytics = __.isEmpty(analytics);
    const hideTranslation = __.isEmpty(translation);
    let tableColumns = 4;
    if (hideAnalytics || hideTranslation) {
      tableColumns = (hideAnalytics && hideTranslation) ? 12 : 6;
    }
    return (
      <div className='row'>
        <div className={`small-12 medium-${tableColumns} columns`} style={BottomMargin}>
          {this.renderServiceCost({ ...ChatCostMeta, costBrackets: chat }, monthlyActiveUsers)}
        </div>
        {!hideAnalytics && <div className={`small-12 medium-${tableColumns} columns`} style={BottomMargin}>
          {this.renderServiceCost({ ...AnalyticsCostMeta, costBrackets: analytics }, monthlyActiveUsers)}
        </div>}
        {!hideTranslation && <div className={`small-12 medium-${tableColumns} columns`} style={BottomMargin}>
          {this.renderServiceCost({ ...TranslationCostMeta, costBrackets: translation }, monthlyTranslatedWords)}
        </div>}
      </div>
    );
  }

  // render helpers
  renderServiceCost(serviceCostMeta, currentLimit) {
    let rowClass = '';
    let costCells = [];
    let highlightedRow = false;
    const { serviceName, costingUnit, costBrackets } = serviceCostMeta;

    __.forIn(costBrackets, (amount, bracket) => {
      const amountNumeral = numeraljs(amount);
      const bracketNumeral = numeraljs(bracket);

      if (!highlightedRow && currentLimit <= bracketNumeral.value()) {
        highlightedRow = true;
        rowClass = ' highlighted-row';
      }

      const simple = bracketNumeral.format('0a');
      const decimal = bracketNumeral.format('0.0a');
      const decidingChar = decimal.charAt(decimal.length - 2);
      const bracketFormat = (decidingChar === '0' || decidingChar === '.') ? simple : decimal;
      costCells.push(
        <tr key={bracket} className={`collapsing${rowClass}`}>
          <td className='collapsing'>{bracketFormat}</td>
          <td className='collapsing'>{`$${amountNumeral.format('0,0')}`}</td>
        </tr>
      );
      rowClass = '';
    });

    return (
      <table className='ui unstackable celled table'>
        <thead>
          <tr>
            <th colSpan='2' className='center aligned'>{serviceName}</th>
          </tr>
          <tr>
            <th className='four wide center aligned'>{`${costingUnit} (up to)`}</th>
            <th className='four wide center aligned'>{'Charges'}</th>
          </tr>
        </thead>
        <tbody>
          {costCells}
        </tbody>
      </table>
    );
  }
}

// react-redux mapping methods
const mapStateToProps = (state/* , props*/) => {
  const totalMetrics = state.ui.billing.viewState.usage.total;
  return { totalMetrics };
};

const mapDispatchToProps = (/* dispatch, props*/) => {
  return {};
};

// exports
const CostingContainer = connect(mapStateToProps, mapDispatchToProps)(Costing);
export default CostingContainer;

// component meta
Costing.propTypes = {
  billingTiers: PropTypes.object.isRequired
};