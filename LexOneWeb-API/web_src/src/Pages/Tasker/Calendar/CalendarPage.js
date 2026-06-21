import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'antd';
import MetaDecorator from '../../../components/MetaDecorator';
import { isMockToken, MOCK_APPOINTMENTS } from '../../../utils/mockAuth';
import axios from 'axios';

class CalendarPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appointments: [],
            selected: null,
            modal_open: false,
        };
    }

    componentDidMount() {
        this.load_appointments();
    }

    load_appointments = () => {
        const token = localStorage.getItem('access_token');

        // MOCK: Remove this block and uncomment API call below when ready for production
        if (isMockToken(token)) {
            this.setState({ appointments: MOCK_APPOINTMENTS });
            return;
        }

        // TODO: Real API call
        // const user_info = JSON.parse(localStorage.getItem('user'));
        // axios.get(
        //     `${process.env.REACT_APP_BASE_URL}/web/api/v1/tasker/appointments/${user_info.user_id}`
        // ).then(res => {
        //     if (res.data.status_code === 200) {
        //         this.setState({ appointments: res.data.appointments });
        //     }
        // });
    }

    open_detail = (appt) => {
        this.setState({ selected: appt, modal_open: true });
    }

    close_detail = () => {
        this.setState({ modal_open: false, selected: null });
    }

    // Group appointments by date, sorted ascending
    get_grouped() {
        const { appointments } = this.state;
        const groups = {};
        [...appointments]
            .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
            .forEach(appt => {
                if (!groups[appt.date]) groups[appt.date] = [];
                groups[appt.date].push(appt);
            });
        return groups;
    }

    format_date(dateStr) {
        const [y, m, d] = dateStr.split('-');
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
    }

    render() {
        const { selected, modal_open } = this.state;
        const grouped = this.get_grouped();
        const dates = Object.keys(grouped);

        return (
            <React.Fragment>
                <MetaDecorator title="| Calendario" description="Mi calendario de citas" />
                <div className="container pt-5 pb-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="title fM mb-0">Mi Calendario</h4>
                        <Link to="/tasker" className="defaultColor font-sm">← Dashboard</Link>
                    </div>

                    {dates.length === 0 ? (
                        <p className="lexone-empty-state">No hay citas programadas.</p>
                    ) : (
                        dates.map(date => (
                            <div key={date} className="mb-4">
                                <h6 className="lexone-calendar-date-header">{this.format_date(date)}</h6>
                                <div className="d-flex flex-column" style={{ gap: 10 }}>
                                    {grouped[date].map(appt => (
                                        <button
                                            key={appt.appointment_id}
                                            className="lexone-appt-card"
                                            onClick={() => this.open_detail(appt)}
                                        >
                                            <div className="lexone-appt-time">{appt.time}</div>
                                            <div className="lexone-appt-body">
                                                <strong>{appt.title}</strong>
                                                <span className="lexone-appt-client">{appt.client_name}</span>
                                                {appt.reference_id && (
                                                    <span className="lexone-appt-caseid">{appt.reference_id}</span>
                                                )}
                                            </div>
                                            <span className={`lexone-appt-type-badge ${appt.type === 'online' ? 'online' : 'in-person'}`}>
                                                {appt.type === 'online' ? '🎥 En línea' : '📍 Presencial'}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Appointment detail modal */}
                <Modal
                    title={selected ? selected.title : ''}
                    visible={modal_open}
                    onCancel={this.close_detail}
                    footer={null}
                    centered
                >
                    {selected && (
                        <div>
                            <table className="w-100 font-sm mb-3">
                                <tbody>
                                    <tr>
                                        <td className="pr-3 pb-2 lexone-text-muted" style={{ whiteSpace: 'nowrap', width: 110 }}>Fecha:</td>
                                        <td className="pb-2 fM">{this.format_date(selected.date)} — {selected.time}</td>
                                    </tr>
                                    <tr>
                                        <td className="pr-3 pb-2 lexone-text-muted">Modalidad:</td>
                                        <td className="pb-2">
                                            {selected.type === 'online' ? '🎥 En línea' : '📍 Presencial'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="pr-3 pb-2 lexone-text-muted">Cliente:</td>
                                        <td className="pb-2">
                                            {selected.client_id ? (
                                                <Link
                                                    to={`/tasker/clients/${selected.client_id}`}
                                                    onClick={this.close_detail}
                                                    className="defaultColor"
                                                >
                                                    {selected.client_name}
                                                </Link>
                                            ) : (
                                                <span>{selected.client_name} <em className="lexone-text-muted">(nuevo cliente)</em></span>
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="pr-3 pb-2 lexone-text-muted">Caso:</td>
                                        <td className="pb-2">
                                            {selected.case_id ? (
                                                <Link
                                                    to={`/tasker/cases/${selected.case_id}`}
                                                    onClick={this.close_detail}
                                                    className="defaultColor"
                                                >
                                                    {selected.reference_id}
                                                </Link>
                                            ) : (
                                                <em className="lexone-text-muted">Nuevo cliente — sin caso asignado</em>
                                            )}
                                        </td>
                                    </tr>
                                    {selected.type === 'online' && selected.link && (
                                        <tr>
                                            <td className="pr-3 pb-2 lexone-text-muted">Enlace:</td>
                                            <td className="pb-2">
                                                <a
                                                    href={selected.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="defaultColor"
                                                >
                                                    Unirse a la reunión →
                                                </a>
                                            </td>
                                        </tr>
                                    )}
                                    {selected.type === 'in-person' && selected.location && (
                                        <tr>
                                            <td className="pr-3 pb-2 lexone-text-muted">Lugar:</td>
                                            <td className="pb-2">{selected.location}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            {selected.notes && (
                                <div className="lexone-appt-notes">
                                    <strong className="font-sm fM d-block mb-1">Notas</strong>
                                    <p className="mb-0 font-sm">{selected.notes}</p>
                                </div>
                            )}
                        </div>
                    )}
                </Modal>
            </React.Fragment>
        );
    }
}

export default CalendarPage;
