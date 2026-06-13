const MOCK_USER = {
    email: 'demo.user@lexone.local',
    password: 'LexOneDemo123!',
};

const MOCK_LAWYER = {
    email: 'demo.lawyer@lexone.local',
    password: 'LexOneDemo123!',
};

const isMockAuthEnabled = () => {
    if (process.env.MOCK_AUTH === 'false') {
        return false;
    }

    return process.env.NODE_ENV !== 'production' || process.env.MOCK_AUTH === 'true';
};

const getMockUserSession = (userAuth) => ({
    status_code: 200,
    user_id: 'mock-user-001',
    access_token: userAuth.createJwt({
        userId: 'mock-user-001',
        role: 'user',
        name: 'Demo User',
        deviceToken: 'mock-device-token',
        status: 1,
    }),
    name: 'Demo User',
    email: MOCK_USER.email,
    mobile: '5551000001',
    user_image: '',
    type: 'user',
});

const getMockLawyerSession = (userAuth) => ({
    status_code: 200,
    user_id: 'mock-lawyer-001',
    access_token: userAuth.createJwt({
        userId: 'mock-lawyer-001',
        role: 'tasker',
        name: 'Demo Lawyer',
        deviceToken: 'mock-device-token',
        status: 1,
    }),
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
});

const tryMockUserSignIn = (req, userAuth) => {
    if (!isMockAuthEnabled()) {
        return null;
    }

    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';

    if (email === MOCK_USER.email && password === MOCK_USER.password) {
        return getMockUserSession(userAuth);
    }

    return null;
};

const tryMockLawyerSignIn = (req, userAuth) => {
    if (!isMockAuthEnabled()) {
        return null;
    }

    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';

    if (email === MOCK_LAWYER.email && password === MOCK_LAWYER.password) {
        return getMockLawyerSession(userAuth);
    }

    return null;
};

module.exports = {
    isMockAuthEnabled,
    tryMockUserSignIn,
    tryMockLawyerSignIn,
};
