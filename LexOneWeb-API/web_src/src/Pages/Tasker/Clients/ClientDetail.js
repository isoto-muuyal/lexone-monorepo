import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import MetaDecorator from '../../../components/MetaDecorator';
import { isMockToken, MOCK_CLIENTS, MOCK_CASES } from '../../../utils/mockAuth';

class ClientDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            client: null,
            cases: [],
            notes: '',
            notes_saved: false,
        };
    }

    componentDidMount() {
        const { client_id } = this.props.match.params;
        if (isMockToken(localStorage.getItem('access_token'))) {
            const client = MOCK_CLIENTS.find(c => c.client_id === client_id);
            if (client) {
                const cases = MOCK_CASES.filter(cas => client.case_ids.includes(cas.case_id));
                const saved_notes = localStorage.getItem(`mock_notes_${client_id}`) || '';
                this.setState({ client, cases, notes: saved_notes });
            }
        }
    }

    save_notes = () => {
        const { client, notes } = this.state;
        if (client) {
            localStorage.setItem(`mock_notes_${client.client_id}`, notes);
            this.setState({ notes_saved: true }, () => {
                setTimeout(() => this.setState({ notes_saved: false }), 2000);
            });
        }
    }

    open_chat = () => {
        const { client } = this.state;
        if (client) {
            this.props.history.push('/chat', { chat_id: client.chat_id });
        }
    }

    getInitials(name) {
        return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    }

    statusLabel(status) {
        const map = { started: 'En curso', accepted: 'Aceptado', completed: 'Completado', pending: 'Pendiente' };
        return map[status] || status;
    }

    statusClass(status) {
        const map = {
            started: 'lexone-status-active',
            accepted: 'lexone-status-active',
            completed: 'lexone-status-success',
            pending: 'lexone-status-pending',
        };
        return map[status] || 'lexone-status-pending';
    }

    render() {
        const { client, cases, notes, notes_saved } = this.state;
        if (!client) return null;

        return (
            <React.Fragment>
                <MetaDecorator title={`| ${client.name}`} description="Detalle de cliente" />
                <div className="container pt-5 pb-5">
                    <div className="d-flex align-items-center mb-4" style={{ gap: 12 }}>
                        <Link to="/tasker/clients" className="defaultColor font-sm">← Clientes</Link>
                        <h4 className="title fM mb-0">{client.name}</h4>
                    </div>

                    <div className="row">
                        <div className="col-md-8">
                            {/* Info card */}
                            <div className="my-card p-4 mb-4">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="lexone-avatar mr-3">{this.getInitials(client.name)}</div>
                                    <div>
                                        <h5 className="fM mb-2">{client.name}</h5>
                                        <Button size="small" onClick={this.open_chat} className="PrimaryBtn">
                                            Abrir chat
                                        </Button>
                                    </div>
                                </div>
                                <table className="w-100 font-sm">
                                    <tbody>
                                        <tr>
                                            <td className="pr-3 pb-2 lexone-text-muted" style={{ whiteSpace: 'nowrap' }}>Correo:</td>
                                            <td className="pb-2">{client.email}</td>
                                        </tr>
                                        <tr>
                                            <td className="pr-3 pb-2 lexone-text-muted" style={{ whiteSpace: 'nowrap' }}>Teléfono:</td>
                                            <td className="pb-2">{client.phone}</td>
                                        </tr>
                                        <tr>
                                            <td className="pr-3 pb-2 lexone-text-muted" style={{ whiteSpace: 'nowrap' }}>Dirección:</td>
                                            <td className="pb-2">{client.address}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Cases */}
                            <div className="my-card p-4">
                                <h6 className="fM mb-3">Casos del cliente</h6>
                                {cases.length === 0 ? (
                                    <p className="lexone-empty-state">Sin casos registrados.</p>
                                ) : (
                                    <ul className="lexone-history-list">
                                        {cases.map(cas => (
                                            <li key={cas.case_id} className="lexone-history-item">
                                                <div className="lexone-history-details">
                                                    <strong>
                                                        <Link to={`/tasker/cases/${cas.case_id}`} className="defaultColor">
                                                            {cas.reference_id}
                                                        </Link>
                                                    </strong>
                                                    <span className="lexone-history-specialty">
                                                        {cas.description.substring(0, 80)}…
                                                    </span>
                                                    <span className="lexone-history-date">{cas.created_date}</span>
                                                </div>
                                                <span className={`lexone-status-badge ${this.statusClass(cas.status)}`}>
                                                    {this.statusLabel(cas.status)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="col-md-4 mt-4 mt-md-0">
                            <div className="my-card p-4">
                                <h6 className="fM mb-2">Notas privadas</h6>
                                <p className="font-sm lexone-text-muted mb-2">
                                    Solo tú puedes ver estas notas.
                                </p>
                                <textarea
                                    className="form-control mb-3"
                                    rows={10}
                                    placeholder="Agrega notas privadas sobre este cliente..."
                                    value={notes}
                                    onChange={e => this.setState({ notes: e.target.value })}
                                    style={{ resize: 'vertical', fontSize: '0.9rem' }}
                                />
                                <Button onClick={this.save_notes} className="PrimaryBtn" block>
                                    {notes_saved ? '✓ Guardado' : 'Guardar notas'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default ClientDetail;
