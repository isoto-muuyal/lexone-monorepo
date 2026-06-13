export const MOCK_USER = {
    email: 'demo.user@lexone.local',
    password: 'LexOneDemo123!',
};

export const MOCK_LAWYER = {
    email: 'demo.lawyer@lexone.local',
    password: 'LexOneDemo123!',
};

export const MOCK_USER_TOKEN = 'mock-local-user-token';
export const MOCK_LAWYER_TOKEN = 'mock-local-lawyer-token';

const MOCK_USER_SESSION = {
    status_code: 200,
    user_id: 'mock-user-001',
    access_token: MOCK_USER_TOKEN,
    name: 'Demo User',
    email: MOCK_USER.email,
    mobile: '5551000001',
    user_image: '',
    type: 'user',
};

const MOCK_LAWYER_SESSION = {
    status_code: 200,
    user_id: 'mock-lawyer-001',
    access_token: MOCK_LAWYER_TOKEN,
    name: 'Demo Lawyer',
    email: MOCK_LAWYER.email,
    mobile: '5551000002',
    user_image: '',
    rating: 4.8,
    type: 'tasker',
    location: 'Ciudad de Mexico',
    about: 'Perfil de abogado de demostracion para desarrollo local.',
    profile_verified: 'true',
    payment_verified: 'true',
    lat: '19.4326',
    lon: '-99.1332',
};

export const isMockAuthEnabled = () => {
    if (process.env.NODE_ENV !== 'development') {
        return false;
    }

    if (process.env.REACT_APP_MOCK_AUTH === 'false') {
        return false;
    }

    const host = window.location.hostname;
    return host === 'localhost' || host === '127.0.0.1';
};

export const isMockToken = (token) => {
    return token === MOCK_USER_TOKEN || token === MOCK_LAWYER_TOKEN;
};

export const tryMockUserLogin = (email, password) => {
    if (!isMockAuthEnabled()) {
        return null;
    }

    if (
        email.trim().toLowerCase() === MOCK_USER.email &&
        password === MOCK_USER.password
    ) {
        return { ...MOCK_USER_SESSION };
    }

    return null;
};

export const tryMockLawyerLogin = (email, password) => {
    if (!isMockAuthEnabled()) {
        return null;
    }

    if (
        email.trim().toLowerCase() === MOCK_LAWYER.email &&
        password === MOCK_LAWYER.password
    ) {
        return { ...MOCK_LAWYER_SESSION };
    }

    return null;
};

export const persistMockSession = (session) => {
    localStorage.setItem('user', JSON.stringify(session));
    localStorage.setItem('access_token', session.access_token);
    axiosSetAuthHeader(session.access_token);
};

export const getMockSessionFromToken = (token) => {
    if (token === MOCK_USER_TOKEN) {
        return { ...MOCK_USER_SESSION };
    }

    if (token === MOCK_LAWYER_TOKEN) {
        return { ...MOCK_LAWYER_SESSION };
    }

    return null;
};

const axiosSetAuthHeader = (token) => {
    // eslint-disable-next-line global-require
    const axios = require('axios');
    axios.defaults.headers.common.Authorization = token;
};

export const getStoredMockSession = () => {
    const token = localStorage.getItem('access_token');
    if (!isMockToken(token)) {
        return null;
    }

    try {
        return JSON.parse(localStorage.getItem('user') || 'null');
    } catch (error) {
        return getMockSessionFromToken(token);
    }
};
