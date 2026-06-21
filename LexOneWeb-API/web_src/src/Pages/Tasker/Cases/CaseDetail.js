import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Drawer, Modal, Select } from 'antd';
import MetaDecorator from '../../../components/MetaDecorator';
import { isMockToken, MOCK_CASES, MOCK_CLIENTS } from '../../../utils/mockAuth';

const { Option } = Select;
const ACTIVITY_DESC_LIMIT = 300;

const truncate = (text, limit) => {
    if (!text || text.length <= limit) return text;
    return `${text.slice(0, limit).trim()}…`;
};

const DOCUMENT_TYPES = [
    'Contrato de Compraventa',
    'Poder Notarial General',
    'Poder Notarial Especial',
    'Contrato de Arrendamiento',
    'Escritura Pública',
    'Demanda Civil',
    'Contestación de Demanda',
    'Acuerdo de Divorcio',
    'Testamento',
    'Contrato de Prestación de Servicios',
    'Acta Constitutiva de Sociedad',
    'Convenio de Transacción',
    'Amparo Indirecto',
    'Recurso de Apelación',
    'Dictamen Jurídico',
    'Carta Poder',
    'Certificado de Antecedentes No Penales',
    'Contrato de Trabajo',
    'Acta de Nacimiento',
    'Licencia de Funcionamiento',
];

class CaseDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cas: null,
            client: null,
            documents: [],
            upload_modal: false,
            upload_type: null,
            upload_file_name: '',
            activity_drawer: false,
            selected_activity: null,
        };
        this.file_input_ref = React.createRef();
    }

    componentDidMount() {
        const { case_id } = this.props.match.params;
        if (isMockToken(localStorage.getItem('access_token'))) {
            const cas = MOCK_CASES.find(c => c.case_id === case_id);
            if (cas) {
                const client = MOCK_CLIENTS.find(c => c.client_id === cas.client_id);
                let documents;
                try {
                    const saved = localStorage.getItem(`mock_docs_${case_id}`);
                    documents = saved ? JSON.parse(saved) : [...cas.documents];
                } catch {
                    documents = [...cas.documents];
                }
                this.setState({ cas, client, documents });
            }
        }
    }

    open_upload = () => {
        this.setState({ upload_modal: true, upload_type: null, upload_file_name: '' });
    }

    close_upload = () => {
        this.setState({ upload_modal: false });
    }

    on_file_change = (e) => {
        const file = e.target.files[0];
        if (file) {
            this.setState({ upload_file_name: file.name });
        }
    }

    confirm_upload = () => {
        const { cas, documents, upload_type, upload_file_name } = this.state;
        if (!upload_type || !upload_file_name) return;

        const same_type = documents.filter(d => d.type === upload_type);
        const next_version = same_type.length > 0
            ? Math.max(...same_type.map(d => d.version)) + 1
            : 1;

        const new_doc = {
            doc_id: `doc-${cas.case_id}-${Date.now()}`,
            name: upload_type,
            type: upload_type,
            version: next_version,
            date: new Date().toISOString().split('T')[0],
            file_name: upload_file_name,
        };

        const new_docs = [...documents, new_doc];
        localStorage.setItem(`mock_docs_${cas.case_id}`, JSON.stringify(new_docs));
        this.setState({ documents: new_docs, upload_modal: false });
    }

    open_activity = (activity) => {
        this.setState({ activity_drawer: true, selected_activity: activity });
    }

    close_activity = () => {
        this.setState({ activity_drawer: false });
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
        const { cas, client, documents, upload_modal, upload_type, upload_file_name, activity_drawer, selected_activity } = this.state;
        if (!cas) return null;
        const activities = cas.activities || [];

        return (
            <React.Fragment>
                <MetaDecorator title={`| Caso ${cas.reference_id}`} description="Detalle del caso" />
                <div className="container pt-5 pb-5">
                    <div className="d-flex align-items-center mb-4" style={{ gap: 12, flexWrap: 'wrap' }}>
                        <Link to="/tasker/cases" className="defaultColor font-sm">← Casos</Link>
                        <h4 className="title fM mb-0">Caso {cas.reference_id}</h4>
                        <span className={`lexone-status-badge ${this.statusClass(cas.status)}`}>
                            {this.statusLabel(cas.status)}
                        </span>
                    </div>

                    <div className="row">
                        {/* Left: case info + client */}
                        <div className="col-md-4 mb-4">
                            <div className="my-card p-4 mb-4">
                                <h6 className="fM mb-3">Información del caso</h6>
                                <table className="w-100 font-sm">
                                    <tbody>
                                        <tr>
                                            <td className="pr-3 pb-2 lexone-text-muted" style={{ whiteSpace: 'nowrap' }}>ID:</td>
                                            <td className="pb-2 fM">{cas.reference_id}</td>
                                        </tr>
                                        <tr>
                                            <td className="pr-3 pb-2 lexone-text-muted" style={{ whiteSpace: 'nowrap' }}>Apertura:</td>
                                            <td className="pb-2">{cas.created_date}</td>
                                        </tr>
                                        <tr>
                                            <td className="pr-3 pb-2 lexone-text-muted" style={{ whiteSpace: 'nowrap' }}>Estado:</td>
                                            <td className="pb-2">
                                                <span className={`lexone-status-badge ${this.statusClass(cas.status)}`}>
                                                    {this.statusLabel(cas.status)}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <hr style={{ borderColor: '#eee', margin: '12px 0' }} />
                                <p className="font-sm mb-0" style={{ color: '#444', lineHeight: 1.7 }}>
                                    {cas.description}
                                </p>
                            </div>

                            {client && (
                                <div className="my-card p-4">
                                    <h6 className="fM mb-3">Cliente</h6>
                                    <table className="w-100 font-sm">
                                        <tbody>
                                            <tr>
                                                <td className="pr-3 pb-2 lexone-text-muted" style={{ whiteSpace: 'nowrap' }}>Nombre:</td>
                                                <td className="pb-2">
                                                    <Link to={`/tasker/clients/${client.client_id}`} className="defaultColor">
                                                        {client.name}
                                                    </Link>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="pr-3 pb-2 lexone-text-muted" style={{ whiteSpace: 'nowrap' }}>Correo:</td>
                                                <td className="pb-2">{client.email}</td>
                                            </tr>
                                            <tr>
                                                <td className="pr-3 pb-2 lexone-text-muted" style={{ whiteSpace: 'nowrap' }}>Tel:</td>
                                                <td className="pb-2">{client.phone}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Right: documents */}
                        <div className="col-md-8 mb-4">
                            <div className="my-card p-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="fM mb-0">Documentos</h6>
                                    <Button onClick={this.open_upload} className="PrimaryBtn">
                                        + Subir documento
                                    </Button>
                                </div>

                                {documents.length === 0 ? (
                                    <p className="lexone-empty-state">Sin documentos adjuntos.</p>
                                ) : (
                                    <div className="lexone-doc-list">
                                        {documents.map(doc => (
                                            <div key={doc.doc_id} className="lexone-doc-item">
                                                <div className="lexone-doc-icon">📄</div>
                                                <div className="lexone-doc-details">
                                                    <strong>{doc.type}</strong>
                                                    <span className="lexone-doc-filename">{doc.file_name}</span>
                                                    <span className="lexone-doc-date">{doc.date}</span>
                                                </div>
                                                <span className="lexone-doc-version">v{doc.version}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="my-card p-4 mt-4">
                                <h6 className="fM mb-3">Historial de actividades</h6>

                                {activities.length === 0 ? (
                                    <p className="lexone-empty-state">Sin actividades registradas.</p>
                                ) : (
                                    <div className="lexone-case-table-wrap">
                                        <table className="lexone-case-table">
                                            <thead>
                                                <tr>
                                                    <th>Fecha</th>
                                                    <th>Categoría</th>
                                                    <th>Tipo</th>
                                                    <th>Descripción</th>
                                                    <th>Notas</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {activities.map(activity => (
                                                    <tr
                                                        key={activity.activity_id}
                                                        className="lexone-activity-row"
                                                        onClick={() => this.open_activity(activity)}
                                                    >
                                                        <td style={{ whiteSpace: 'nowrap' }}>{activity.date}</td>
                                                        <td>{activity.category}</td>
                                                        <td>{activity.type}</td>
                                                        <td className="lexone-case-desc">
                                                            {truncate(activity.description, ACTIVITY_DESC_LIMIT)}
                                                        </td>
                                                        <td className="lexone-case-desc">
                                                            {truncate(activity.notes, ACTIVITY_DESC_LIMIT)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <Drawer
                    title={selected_activity ? selected_activity.category : 'Actividad'}
                    placement="right"
                    onClose={this.close_activity}
                    visible={activity_drawer}
                    width={420}
                >
                    {selected_activity && (
                        <div className="font-sm">
                            <table className="w-100 mb-4">
                                <tbody>
                                    <tr>
                                        <td className="pr-3 pb-2 lexone-text-muted" style={{ whiteSpace: 'nowrap' }}>Fecha:</td>
                                        <td className="pb-2">{selected_activity.date}</td>
                                    </tr>
                                    <tr>
                                        <td className="pr-3 pb-2 lexone-text-muted" style={{ whiteSpace: 'nowrap' }}>Categoría:</td>
                                        <td className="pb-2">{selected_activity.category}</td>
                                    </tr>
                                    <tr>
                                        <td className="pr-3 pb-2 lexone-text-muted" style={{ whiteSpace: 'nowrap' }}>Tipo:</td>
                                        <td className="pb-2">{selected_activity.type}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <h6 className="fM mb-2">Descripción</h6>
                            <p style={{ lineHeight: 1.7, color: '#444' }}>{selected_activity.description}</p>

                            <h6 className="fM mb-2 mt-4">Notas</h6>
                            <p style={{ lineHeight: 1.7, color: '#444' }}>{selected_activity.notes || 'Sin notas.'}</p>
                        </div>
                    )}
                </Drawer>

                <Modal
                    title="Subir documento"
                    visible={upload_modal}
                    onCancel={this.close_upload}
                    footer={null}
                    centered
                >
                    <div className="mb-3">
                        <label className="d-block mb-1 font-sm fM">Tipo de documento</label>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Selecciona el tipo de documento"
                            value={upload_type}
                            onChange={val => this.setState({ upload_type: val })}
                            showSearch
                            getPopupContainer={trigger => trigger.parentNode}
                        >
                            {DOCUMENT_TYPES.map(t => (
                                <Option key={t} value={t}>{t}</Option>
                            ))}
                        </Select>
                    </div>

                    <div className="mb-4">
                        <label className="d-block mb-1 font-sm fM">Archivo</label>
                        <div className="lexone-file-input-wrap">
                            <Button
                                onClick={() => this.file_input_ref.current.click()}
                                className="SecondaryBtn"
                            >
                                Seleccionar archivo
                            </Button>
                            <span className="lexone-file-name ml-2 font-sm">
                                {upload_file_name || 'Ningún archivo seleccionado'}
                            </span>
                            <input
                                ref={this.file_input_ref}
                                type="file"
                                style={{ display: 'none' }}
                                onChange={this.on_file_change}
                            />
                        </div>
                    </div>

                    <div className="d-flex justify-content-end" style={{ gap: 8 }}>
                        <Button onClick={this.close_upload}>Cancelar</Button>
                        <Button
                            onClick={this.confirm_upload}
                            className="PrimaryBtn"
                            disabled={!upload_type || !upload_file_name}
                        >
                            Subir
                        </Button>
                    </div>
                </Modal>
            </React.Fragment>
        );
    }
}

export default CaseDetail;
