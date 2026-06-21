import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MetaDecorator from '../../../components/MetaDecorator';
import { isMockToken, MOCK_CASES } from '../../../utils/mockAuth';

class CaseList extends Component {
    constructor(props) {
        super(props);
        this.state = { cases: [] };
    }

    componentDidMount() {
        if (isMockToken(localStorage.getItem('access_token'))) {
            this.setState({ cases: MOCK_CASES });
        }
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
        const { cases } = this.state;
        return (
            <React.Fragment>
                <MetaDecorator title="| Casos" description="Lista de casos" />
                <div className="container pt-5 pb-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="title fM mb-0">Mis Casos</h4>
                        <Link to="/tasker" className="defaultColor font-sm">← Dashboard</Link>
                    </div>

                    {cases.length === 0 ? (
                        <p className="lexone-empty-state">No hay casos registrados.</p>
                    ) : (
                        <div className="my-card p-0 overflow-hidden">
                            <div className="lexone-case-table-wrap">
                                <table className="lexone-case-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Cliente</th>
                                            <th>Descripción</th>
                                            <th>Estado</th>
                                            <th>Documentos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cases.map(cas => (
                                            <tr key={cas.case_id}>
                                                <td>
                                                    <Link
                                                        to={`/tasker/cases/${cas.case_id}`}
                                                        className="fM"
                                                        style={{ color: '#0A214D' }}
                                                    >
                                                        {cas.reference_id}
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Link to={`/tasker/clients/${cas.client_id}`} className="defaultColor">
                                                        {cas.client_name}
                                                    </Link>
                                                </td>
                                                <td className="lexone-case-desc">
                                                    {cas.description.substring(0, 90)}…
                                                </td>
                                                <td>
                                                    <span className={`lexone-status-badge ${this.statusClass(cas.status)}`}>
                                                        {this.statusLabel(cas.status)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <Link
                                                        to={`/tasker/cases/${cas.case_id}`}
                                                        className="defaultColor"
                                                    >
                                                        {cas.documents.length} doc(s)
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </React.Fragment>
        );
    }
}

export default CaseList;
