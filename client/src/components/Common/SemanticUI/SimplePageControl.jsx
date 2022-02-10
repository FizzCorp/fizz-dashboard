// imports
import React from 'react';
import PropTypes from 'prop-types';

// exports
export default class SimplePageControl extends React.Component {
  constructor(props) {
    super(props);
  }

  // react lifecycle
  render() {
    const { currentPage, totalPages } = this.props;
    if (totalPages < 2) {
      return <div></div>;
    }

    let pageList = [{ number: currentPage }];
    const prev = currentPage - 1;
    if (prev >= 0) {
      pageList.unshift({ number: prev });
    }

    const next = currentPage + 1;
    if (next < totalPages) {
      pageList.push({ number: next });
    }

    const first = 0;
    const last = (totalPages - 1);
    const renderPrevious = (prev >= 0);
    const renderNext = (next < totalPages);
    const renderFirst = (first !== currentPage);
    const renderLast = (last < totalPages && last !== currentPage);

    return (
      <div className='ui right floated pagination menu' style={{ width: 'auto' }}>
        {
          renderFirst && this.renderNavButton(first, 'double angle left')
        }
        {
          renderPrevious && this.renderNavButton(prev, 'left chevron')
        }
        {
          pageList.map(page => this.renderPageNumberButton(page.number))
        }
        {
          renderNext && this.renderNavButton(next, 'right chevron')
        }
        {
          renderLast && this.renderNavButton(last, 'double right angle')
        }
      </div>
    );
  }

  // render helpers
  renderNavButton(pageNumber, icon) {
    const { disabled } = this.props;
    const disabledClass = disabled ? ' disabled' : '';

    return (
      <a className={`icon item${disabledClass}`} onClick={this.paginatedQuery(pageNumber)}>
        <i className={`${icon} icon`}></i>
      </a>
    );
  }

  renderPageNumberButton(pageNumber) {
    const { disabled, currentPage } = this.props;
    const disabledClass = disabled ? ' disabled' : '';
    const disableClick = disabledClass || (currentPage === pageNumber && ' disabled') || '';

    return (
      <a
        key={pageNumber}
        className={`item${disableClick}`}
        onClick={!disableClick ? this.paginatedQuery(pageNumber) : undefined}
      >
        {pageNumber + 1}<br />
      </a>
    );
  }

  // helper methods - page actions
  paginatedQuery(selectedPage) {
    return (event) => {
      event.preventDefault();
      event.stopPropagation();

      this.props.handlePageSelect(selectedPage);
    };
  }
}

// component meta
SimplePageControl.propTypes = {
  disabled: PropTypes.bool,
  handlePageSelect: PropTypes.func,

  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired
};

SimplePageControl.defaultProps = {
  disabled: false,
  handlePageSelect: (/* selectedPage*/) => { }
};