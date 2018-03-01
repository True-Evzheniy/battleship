import React from 'react';
import PropTypes from 'prop-types';
import './Popup.css';


export const Popup = props => {
    const {onClick: handleClick} = props;

    return (
        <div className={'popup'}>
            <h1 className={'popup-title'}>Victory!</h1>
            <button className={'popup-button'} onClick={handleClick}>Start new game</button>
        </div>
    );
};

Popup.propTypes = {
    onClick: PropTypes.func.isRequired
};
