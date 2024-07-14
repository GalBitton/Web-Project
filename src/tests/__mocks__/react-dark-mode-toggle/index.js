// src/tests/__mocks__/react-dark-mode-toggle/index.js
import React from 'react';

const DarkModeToggle = ({ checked, onChange }) => {
    return (
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            data-testid="dark-mode-toggle"
        />
    );
};

export default DarkModeToggle;
