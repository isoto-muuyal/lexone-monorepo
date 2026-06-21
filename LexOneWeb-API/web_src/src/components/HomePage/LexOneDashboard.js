import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import i18next from 'i18next';
import { getStoredMockSession, MOCK_USER_BOOKINGS, MOCK_USER_CONVERSATIONS } from '../../utils/mockAuth';

const getInitials = (name) => {
    if (!name) {
        return '?';
    }
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('');
};

const STATUS_LABELS = {
    completed: 'Completed',
    started: 'In-Progress',
    accepted: 'Accepted',
    requested: 'Pre Booking',
    paid: 'Paid',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
};

const STATUS_CLASSES = {
    completed: 'lexone-status-success',
    paid: 'lexone-status-success',
    started: 'lexone-status-active',
    accepted: 'lexone-status-active',
    requested: 'lexone-status-pending',
    cancelled: 'lexone-status-danger',
    refunded: 'lexone-status-danger',
};

const LexOneDashboard = () => {
    const history = useHistory();
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
    const mockSession = getStoredMockSession();

    const bookings = mockSession ? MOCK_USER_BOOKINGS : [];
    const conversations = mockSession ? MOCK_USER_CONVERSATIONS : [];

    const openConversation = (chatId) => {
        history.push('/chat', { chat_id: chatId });
    };

    return (
        <div className="lexone-home lexone-dashboard">
            <section className="container lexone-dashboard-content">
                <div className="lexone-dashboard-grid">
                    <article className="lexone-card lexone-card-light lexone-profile-card">
                        <div className="lexone-avatar">
                            {userInfo.user_image
                                ? <img src={userInfo.user_image} alt={userInfo.name} />
                                : <span>{getInitials(userInfo.name)}</span>}
                        </div>
                        <div className="lexone-profile-info">
                            <h2>{i18next.t('LexOne Dashboard Greeting')}, {userInfo.name}</h2>
                            <ul className="lexone-profile-details">
                                {userInfo.email && <li>{userInfo.email}</li>}
                                {userInfo.mobile && <li>{userInfo.mobile}</li>}
                            </ul>
                            <div className="lexone-profile-links">
                                <Link to="/user/my-booking" className="lexone-btn lexone-btn-ghost lexone-btn-sm">{i18next.t('My Bookings')}</Link>
                                <Link to="/chat" className="lexone-btn lexone-btn-ghost lexone-btn-sm">{i18next.t('Chats')}</Link>
                            </div>
                        </div>
                    </article>

                    <article className="lexone-card lexone-card-light lexone-dashboard-section">
                        <h2>{i18next.t('LexOne Dashboard History Title')}</h2>
                        {bookings.length === 0 ? (
                            <p className="lexone-empty-state">{i18next.t('LexOne Dashboard History Empty')}</p>
                        ) : (
                            <ul className="lexone-history-list">
                                {bookings.map((booking) => (
                                    <li key={booking.item_id} className="lexone-history-item">
                                        <div className="lexone-avatar lexone-avatar-sm">
                                            <span>{getInitials(booking.item_name)}</span>
                                        </div>
                                        <div className="lexone-history-details">
                                            <strong>{booking.item_name}</strong>
                                            <span className="lexone-history-specialty">{booking.specialty}</span>
                                            <span className="lexone-history-date">{booking.formatted_date}</span>
                                        </div>
                                        <span className={`lexone-status-badge ${STATUS_CLASSES[booking.status] || ''}`}>
                                            {i18next.t(STATUS_LABELS[booking.status] || booking.status)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </article>

                    <article className="lexone-card lexone-card-light lexone-dashboard-section">
                        <div className="lexone-section-header">
                            <h2>{i18next.t('LexOne Dashboard Inbox Title')}</h2>
                            <Link to="/chat" className="lexone-link">{i18next.t('LexOne Dashboard View All')}</Link>
                        </div>
                        {conversations.length === 0 ? (
                            <p className="lexone-empty-state">{i18next.t('LexOne Dashboard Inbox Empty')}</p>
                        ) : (
                            <ul className="lexone-inbox-list">
                                {conversations.map((conversation) => (
                                    <li
                                        key={conversation.chat_id}
                                        className="lexone-inbox-item cursorPointer"
                                        onClick={() => openConversation(conversation.chat_id)}
                                    >
                                        <div className="lexone-avatar lexone-avatar-sm">
                                            <span>{getInitials(conversation.name)}</span>
                                        </div>
                                        <div className="lexone-inbox-details">
                                            <strong>{conversation.name}</strong>
                                            <span className="lexone-inbox-message">{conversation.message.message}</span>
                                        </div>
                                        <div className="lexone-inbox-meta">
                                            <span className="lexone-inbox-date">{conversation.formatted_date}</span>
                                            {conversation.unread_count !== '0' && (
                                                <span className="lexone-inbox-unread">{conversation.unread_count}</span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </article>
                </div>
            </section>
        </div>
    );
};

export default LexOneDashboard;
