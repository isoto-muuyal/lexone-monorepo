import React from 'react';
import { isMockAuthEnabled, MOCK_USER, MOCK_LAWYER } from '../utils/mockAuth';

const MockLoginHint = ({ role = 'user' }) => {
    if (!isMockAuthEnabled()) {
        return null;
    }

    const account = role === 'tasker' ? MOCK_LAWYER : MOCK_USER;

    return (
        <div className="mock-login-hint">
            <strong>Local demo login</strong>
            <div>{account.email}</div>
            <div>{account.password}</div>
        </div>
    );
};

export default MockLoginHint;
