import React, { Component } from 'react';
import i18next from 'i18next';
import Swal from 'sweetalert2';
import MetaDecorator from '../../components/MetaDecorator';
import { simulateAiLawyerMatch } from '../../utils/aiLawyerMatch';

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});

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

class FindLawyers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: '',
            loading: false,
            messages: [],
            matches: [],
        }
        this.nextMessageId = 1;
        this.thinkingTimeout = null;
    }

    componentDidMount = () => {
        this.pushMessage('ai', i18next.t('LexOne Find Lawyers Intro Message'));
    }

    componentWillUnmount = () => {
        if (this.thinkingTimeout) {
            clearTimeout(this.thinkingTimeout);
        }
    }

    pushMessage = (role, text) => {
        const message = { id: this.nextMessageId++, role, text };
        this.setState((prevState) => ({ messages: [...prevState.messages, message] }));
    }

    handleSend = () => {
        const query = this.state.input.trim();
        if (query === '' || this.state.loading) {
            return;
        }

        this.pushMessage('user', query);
        this.setState({ input: '', loading: true });

        this.thinkingTimeout = setTimeout(() => {
            const { summary, matches } = simulateAiLawyerMatch(query);
            this.pushMessage('ai', summary);
            this.setState({ loading: false, matches });
        }, 900);
    }

    handleContact = (lawyer) => {
        Toast.fire({
            icon: 'info',
            title: `${i18next.t('LexOne Find Lawyers Demo Notice')} (${lawyer.name})`
        });
    }

    render() {
        const { input, loading, messages, matches } = this.state;
        return (
            <React.Fragment>
                <MetaDecorator title='| Find Lawyers' description="LexOne AI assistant — describe what you need and get matched with the right lawyer." />
                <div className="lexone-home lexone-search-page">
                    <section className="container lexone-search-content">
                        <header className="lexone-search-header">
                            <h1>{i18next.t('LexOne Find Lawyers Title')}</h1>
                            <p>{i18next.t('LexOne Find Lawyers Subtitle')}</p>
                        </header>

                        <div className="lexone-card lexone-card-light lexone-chat-card">
                            <div className="lexone-chat-transcript">
                                {messages.map((m) => (
                                    <div key={m.id} className={`lexone-chat-bubble lexone-chat-${m.role}`}>
                                        {m.text}
                                    </div>
                                ))}
                                {loading && (
                                    <div className="lexone-chat-bubble lexone-chat-ai lexone-chat-thinking">
                                        {i18next.t('LexOne Find Lawyers Thinking')}
                                    </div>
                                )}
                            </div>
                            <div className="lexone-chat-input-row">
                                <input
                                    type="text"
                                    value={input}
                                    placeholder={i18next.t('LexOne Find Lawyers Placeholder')}
                                    onChange={(e) => this.setState({ input: e.target.value })}
                                    onKeyUp={(e) => { if (e.keyCode === 13) { this.handleSend(); } }}
                                    disabled={loading}
                                    maxLength="500"
                                />
                                <button
                                    type="button"
                                    className="lexone-btn lexone-btn-gold"
                                    onClick={this.handleSend}
                                    disabled={loading || input.trim() === ''}
                                >
                                    {i18next.t('LexOne Find Lawyers Send')}
                                </button>
                            </div>
                        </div>

                        {matches.length > 0 && (
                            <div className="lexone-search-results">
                                <h2>{i18next.t('LexOne Find Lawyers Results Title')}</h2>
                                <div className="lexone-lawyer-grid">
                                    {matches.map(({ lawyer, reason }) => (
                                        <article key={lawyer.id} className="lexone-card lexone-card-light lexone-lawyer-card">
                                            <div className="lexone-avatar lexone-avatar-md">
                                                <span>{getInitials(lawyer.name)}</span>
                                            </div>
                                            <div className="lexone-lawyer-info">
                                                <h3>{lawyer.name}</h3>
                                                <span className="lexone-lawyer-specialty">{lawyer.specialty}</span>
                                                <div className="lexone-lawyer-meta">
                                                    <span>★ {lawyer.rating}</span>
                                                    <span>{lawyer.location}</span>
                                                    <span>{lawyer.price_range}</span>
                                                </div>
                                                <p className="lexone-lawyer-reason">{reason}</p>
                                            </div>
                                            <button
                                                type="button"
                                                className="lexone-btn lexone-btn-gold lexone-btn-sm"
                                                onClick={() => this.handleContact(lawyer)}
                                            >
                                                {i18next.t('LexOne Find Lawyers Contact')}
                                            </button>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </React.Fragment>
        );
    }
}

export default FindLawyers;
