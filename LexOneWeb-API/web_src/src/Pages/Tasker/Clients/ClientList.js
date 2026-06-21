import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MetaDecorator from '../../../components/MetaDecorator';
import { isMockToken, MOCK_CLIENTS, MOCK_CASES } from '../../../utils/mockAuth';

class ClientList extends Component {
    constructor(props) {
        super(props);
        this.state = { clients: [] };
    }

    componentDidMount() {
        if (isMockToken(localStorage.getItem('access_token'))) {
            this.setState({ clients: MOCK_CLIENTS });
        }
    }

    getInitials(name) {
        return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    }

    getCaseCount(client) {
        return MOCK_CASES.filter(c => client.case_ids.includes(c.case_id)).length;
    }

    render() {
        const { clients } = this.state;
        return (
            <React.Fragment>
                <MetaDecorator title="| Clientes" description="Lista de clientes" />
                <div className="container pt-5 pb-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="title fM mb-0">Mis Clientes</h4>
                        <Link to="/tasker" className="defaultColor font-sm">← Dashboard</Link>
                    </div>
                    {clients.length === 0 ? (
                        <p className="lexone-empty-state">No hay clientes registrados.</p>
                    ) : (
                        <div className="row">
                            {clients.map(client => (
                                <div className="col-xl-4 col-md-6 mb-4" key={client.client_id}>
                                    <div className="my-card p-4 h-100 d-flex flex-column">
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="lexone-avatar lexone-avatar-md mr-3">
                                                {this.getInitials(client.name)}
                                            </div>
                                            <div style={{ minWidth: 0 }}>
                                                <strong className="d-block text-truncate">{client.name}</strong>
                                                <span className="font-sm lexone-text-muted">{client.email}</span>
                                            </div>
                                        </div>
                                        <p className="mb-1 font-sm">{client.phone}</p>
                                        <p className="mb-2 font-sm lexone-text-muted">{client.address}</p>
                                        <p className="mb-3 font-sm">
                                            <strong>{this.getCaseCount(client)}</strong> caso(s)
                                        </p>
                                        <div className="mt-auto">
                                            <Link to={`/tasker/clients/${client.client_id}`}>
                                                <button className="PrimaryBtn lg" style={{ width: '100%' }}>
                                                    Ver detalle
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </React.Fragment>
        );
    }
}

export default ClientList;
