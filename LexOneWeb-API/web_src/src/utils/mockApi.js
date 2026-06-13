import axios from 'axios';
import {
    isMockAuthEnabled,
    isMockToken,
    tryMockUserLogin,
    tryMockLawyerLogin,
    getStoredMockSession,
} from './mockAuth';

const emptySuccess = (extra = {}) => ({
    status_code: 200,
    ...extra,
});

const parseRequestData = (config) => {
    if (!config.data) {
        return {};
    }

    if (typeof config.data === 'string') {
        const params = new URLSearchParams(config.data);
        const parsed = {};
        params.forEach((value, key) => {
            parsed[key] = value;
        });
        return parsed;
    }

    if (config.data instanceof URLSearchParams) {
        const parsed = {};
        config.data.forEach((value, key) => {
            parsed[key] = value;
        });
        return parsed;
    }

    return config.data;
};

const buildMockResponse = (config) => {
    const url = config.url || '';
    const session = getStoredMockSession();
    const isTasker = session && session.type === 'tasker';

    if (url.includes('/user/signin')) {
        const body = parseRequestData(config);
        const session = tryMockUserLogin(body.email, body.password);
        if (session) {
            return session;
        }
        return { status_code: 400, message: 'Email / Password is not valid' };
    }

    if (url.includes('/tasker/signin')) {
        const body = parseRequestData(config);
        const session = tryMockLawyerLogin(body.email, body.password);
        if (session) {
            return session;
        }
        return { status_code: 400, message: 'Email / Password is not valid' };
    }

    if (url.includes('/appdefaults')) {
        return emptySuccess({
            site_name: 'LexOne',
            site_logo: '',
            site_favicon: '',
            copyright_text: 'LexOne Demo Mode',
            googleadsense: 'false',
            currency_symbol: '$',
            youtube_title: 'LexOne Demo',
            youtube_description: 'Modo de demostracion local.',
            youtube_link: '',
            fb_link: '#',
            instagram_link: '#',
            twitter_link: '#',
        });
    }

    if (url.includes('/user/home')) {
        return emptySuccess({
            banner_items: [],
            category_items: [],
            recent_items: [],
            client_ip_address: '127.0.0.1',
        });
    }

    if (url.includes('/get_home_feature_items')) {
        return emptySuccess({ feature_items: [] });
    }

    if (url.includes('/tasker/dashboard')) {
        return emptySuccess({
            total_tasks: 12,
            upcoming_tasks: 3,
            completed_tasks: 9,
            total_earnings: 24500,
            pending_earnings: 3200,
            earn: {
                week: [
                    { duration: 'Mon', earns: 1200 },
                    { duration: 'Tue', earns: 1800 },
                    { duration: 'Wed', earns: 900 },
                    { duration: 'Thu', earns: 2100 },
                    { duration: 'Fri', earns: 1600 },
                ],
                month: [
                    { duration: 'Week 1', earns: 5200 },
                    { duration: 'Week 2', earns: 6100 },
                    { duration: 'Week 3', earns: 4800 },
                    { duration: 'Week 4', earns: 8400 },
                ],
            },
            upcoming: [],
        });
    }

    if (url.includes('/tasker/profile') || url.includes('/user/profile')) {
        return emptySuccess({
            name: session && session.name,
            email: session && session.email,
            mobile: session && session.mobile,
            user_image: session && session.user_image,
            payment_verified: 'true',
            profile_verified: 'true',
            rating: session && session.rating,
            location: session && session.location,
            about: session && session.about,
            lat: session && session.lat,
            lon: session && session.lon,
        });
    }

    if (url.includes('/categories_service_tree') || url.includes('/categories')) {
        return emptySuccess({ categories: [], items: [] });
    }

    if (url.includes('/subcategories') || url.includes('/sub_category_by_id')) {
        return emptySuccess({ sub_categories: [], items: [] });
    }

    if (url.includes('/category_by_id') || url.includes('/service_by_id') || url.includes('/services')) {
        return emptySuccess({ services: [], items: [], service_items: [] });
    }

    if (url.includes('/mybookings') || url.includes('/bookingdetails') || url.includes('/bookingstatus') || url.includes('/bookservice')) {
        return emptySuccess({ items: [], bookings: [], booking_items: [] });
    }

    if (url.includes('/myservices') || url.includes('/tasker/services') || url.includes('/addservices')) {
        return emptySuccess({ services: [], service_items: [], items: [] });
    }

    if (url.includes('/browseneeds') || url.includes('/myneeds') || url.includes('/addneed') || url.includes('/userjobs') || url.includes('/user-jobs')) {
        return emptySuccess({ needs: [], need_items: [], items: [], jobs: [] });
    }

    if (url.includes('/chats') || url.includes('/messages') || url.includes('/chatinfo') || url.includes('/createchat')) {
        return emptySuccess({ chats: [], messages: [], chat_items: [] });
    }

    if (url.includes('/notifications') || url.includes('/adminnotifications')) {
        return emptySuccess({ notifications: [], items: [] });
    }

    if (url.includes('/reviews')) {
        return emptySuccess({ reviews: [], items: [] });
    }

    if (url.includes('/media') || url.includes('/portfolio') || url.includes('/verification')) {
        return emptySuccess({ media: [], items: [], portfolio: [] });
    }

    if (url.includes('/stripe')) {
        return emptySuccess({
            stripe_url: '#',
            payment_verified: 'true',
            status: 'complete',
        });
    }

    if (url.includes('/signout')) {
        return emptySuccess({ message: 'Signed out' });
    }

    if (url.includes('/emailexist') || url.includes('/mobileexists')) {
        return emptySuccess({ exists: '0' });
    }

    if (url.includes('/hiretaskers') || url.includes('/tasker-view') || url.includes('/taskerview')) {
        return emptySuccess({ taskers: [], items: [] });
    }

    return emptySuccess({
        message: 'Mock response',
        type: isTasker ? 'tasker' : 'user',
    });
};

const shouldMockRequest = (config) => {
    if (!isMockAuthEnabled()) {
        return false;
    }

    const url = config.url || '';

    if (url.includes('/user/signin') || url.includes('/tasker/signin')) {
        return true;
    }

    return isMockToken(localStorage.getItem('access_token'));
};

export const setupMockApi = () => {
    if (!isMockAuthEnabled()) {
        return;
    }

    axios.interceptors.request.use((config) => {
        if (!shouldMockRequest(config)) {
            return config;
        }

        config.adapter = () => Promise.resolve({
            data: buildMockResponse(config),
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
            request: {},
        });

        return config;
    });
};
