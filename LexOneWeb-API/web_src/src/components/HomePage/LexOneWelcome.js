import React from 'react';
import { Link } from 'react-router-dom';
import i18next from 'i18next';

const LexOneWelcome = () => {
    return (
        <div className="lexone-home">
            <section className="lexone-hero">
                <div className="lexone-hero-overlay" />
                <div className="lexone-hero-content">
                    <span className="lexone-badge">{i18next.t('LexOne Welcome Badge')}</span>
                    <h1 className="lexone-hero-title">LexOne</h1>
                    <p className="lexone-hero-subtitle">{i18next.t('LexOne Welcome Subtitle')}</p>
                    <div className="lexone-hero-actions">
                        <Link to="/user/user-signup" className="lexone-btn lexone-btn-gold">
                            {i18next.t('LexOne Find Lawyer CTA')} →
                        </Link>
                        <Link to="/user/user-login" className="lexone-btn lexone-btn-outline">
                            {i18next.t('LexOne Sign In CTA')}
                        </Link>
                    </div>
                    <a href="#lexone-features" className="lexone-scroll-hint">
                        {i18next.t('LexOne Scroll Hint')} ↓
                    </a>
                </div>
            </section>

            <section id="lexone-features" className="lexone-features">
                <div className="container">
                    <div className="lexone-grid">
                        <article className="lexone-card lexone-card-light lexone-card-large">
                            <div className="lexone-card-body">
                                <h2>{i18next.t('LexOne Trust Title')}</h2>
                                <p>{i18next.t('LexOne Trust Description')}</p>
                                <div className="lexone-stats">
                                    <div>
                                        <strong>98%</strong>
                                        <span>{i18next.t('LexOne Stat Verified')}</span>
                                    </div>
                                    <div>
                                        <strong>12M+</strong>
                                        <span>{i18next.t('LexOne Stat Documents')}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="lexone-card-icon lexone-icon-scales" aria-hidden="true" />
                        </article>

                        <article className="lexone-card lexone-card-dark">
                            <div className="lexone-card-icon lexone-icon-chart" aria-hidden="true" />
                            <h2>{i18next.t('LexOne Search Title')}</h2>
                            <p>{i18next.t('LexOne Search Description')}</p>
                            <div className="lexone-progress">
                                <span>{i18next.t('LexOne Match Rate')}</span>
                                <div className="lexone-progress-bar">
                                    <div className="lexone-progress-fill" style={{ width: '92%' }} />
                                </div>
                            </div>
                        </article>

                        <article className="lexone-card lexone-card-light lexone-card-small">
                            <div className="lexone-card-icon lexone-icon-shield" aria-hidden="true" />
                            <h2>{i18next.t('LexOne Verified Title')}</h2>
                            <p>{i18next.t('LexOne Verified Description')}</p>
                            <div className="lexone-asset-preview">{i18next.t('LexOne Verified Preview')}</div>
                        </article>

                        <article className="lexone-card lexone-card-light lexone-card-timeline">
                            <h2>{i18next.t('LexOne Process Title')}</h2>
                            <ol className="lexone-timeline">
                                <li className="active">
                                    <span>1</span>
                                    <div>
                                        <strong>{i18next.t('LexOne Process Step 1 Title')}</strong>
                                        <p>{i18next.t('LexOne Process Step 1 Description')}</p>
                                    </div>
                                </li>
                                <li>
                                    <span>2</span>
                                    <div>
                                        <strong>{i18next.t('LexOne Process Step 2 Title')}</strong>
                                        <p>{i18next.t('LexOne Process Step 2 Description')}</p>
                                    </div>
                                </li>
                                <li>
                                    <span>3</span>
                                    <div>
                                        <strong>{i18next.t('LexOne Process Step 3 Title')}</strong>
                                        <p>{i18next.t('LexOne Process Step 3 Description')}</p>
                                    </div>
                                </li>
                            </ol>
                        </article>
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="lexone-commitment">
                <div className="lexone-commitment-overlay" />
                <div className="container lexone-commitment-content">
                    <h2>{i18next.t('LexOne Commitment Title')}</h2>
                    <blockquote>{i18next.t('LexOne Commitment Quote')}</blockquote>
                    <div className="lexone-commitment-brand">
                        <div className="lexone-commitment-icon" aria-hidden="true">⚖</div>
                        <span>{i18next.t('LexOne Commitment Label')}</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LexOneWelcome;
