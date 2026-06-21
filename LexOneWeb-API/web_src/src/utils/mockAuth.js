export const MOCK_USER = {
    email: 'demo.user@lexone.local',
    password: 'LexOneDemo123!',
};

export const MOCK_LAWYER = {
    email: 'demo.lawyer@lexone.local',
    password: 'LexOneDemo123!',
};

export const MOCK_USER_TOKEN = 'mock-local-user-token';
export const MOCK_LAWYER_TOKEN = 'mock-local-lawyer-token';

// "Lawyers contacted" history shown on the user dashboard.
// Field names mirror the booking item shape used in UserMyBooking.js.
export const MOCK_USER_BOOKINGS = [
    {
        item_id: 'mock-booking-201',
        item_image: '',
        item_name: 'Mariana Solis',
        specialty: 'Corporate & Business Law',
        formatted_date: '02.Jun.2026',
        reference_id: 'lx10231',
        price: '1,200.00',
        status: 'completed',
    },
    {
        item_id: 'mock-booking-202',
        item_image: '',
        item_name: 'Diego Fernandez',
        specialty: 'Real Estate Law',
        formatted_date: '09.Jun.2026',
        reference_id: 'lx10245',
        price: '850.00',
        status: 'started',
    },
    {
        item_id: 'mock-booking-203',
        item_image: '',
        item_name: 'Carla Jimenez',
        specialty: 'Family Law',
        formatted_date: '12.Jun.2026',
        reference_id: 'lx10260',
        price: '600.00',
        status: 'accepted',
    },
];

// Inbox preview shown on the user dashboard.
// Field names mirror the chat list item shape used in Chat.js.
export const MOCK_USER_CONVERSATIONS = [
    {
        chat_id: 'mock-chat-101',
        name: 'Mariana Solis',
        user_image: '',
        message: { message: 'Listo, te envio el contrato revisado para el jueves.' },
        formatted_date: 'Yesterday',
        unread_count: '2',
        reference_id: 'lx10231',
    },
    {
        chat_id: 'mock-chat-102',
        name: 'Diego Fernandez',
        user_image: '',
        message: { message: 'Podemos agendar la firma para esta semana?' },
        formatted_date: '2 days ago',
        unread_count: '0',
        reference_id: 'lx10245',
    },
    {
        chat_id: 'mock-chat-103',
        name: 'Carla Jimenez',
        user_image: '',
        message: { message: 'Gracias por la informacion, lo reviso y te confirmo.' },
        formatted_date: '5 days ago',
        unread_count: '0',
        reference_id: 'lx10260',
    },
];

const MOCK_USER_SESSION = {
    status_code: 200,
    user_id: 'mock-user-001',
    access_token: MOCK_USER_TOKEN,
    name: 'Demo User',
    email: MOCK_USER.email,
    mobile: '5551000001',
    user_image: '',
    type: 'user',
};

const MOCK_LAWYER_SESSION = {
    status_code: 200,
    user_id: 'mock-lawyer-001',
    access_token: MOCK_LAWYER_TOKEN,
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
};

export const isMockAuthEnabled = () => {
    if (process.env.NODE_ENV !== 'development') {
        return false;
    }

    if (process.env.REACT_APP_MOCK_AUTH === 'false') {
        return false;
    }

    return true;
};

export const isMockToken = (token) => {
    return token === MOCK_USER_TOKEN || token === MOCK_LAWYER_TOKEN;
};

export const tryMockUserLogin = (email, password) => {
    if (!isMockAuthEnabled()) {
        return null;
    }

    if (
        email.trim().toLowerCase() === MOCK_USER.email &&
        password === MOCK_USER.password
    ) {
        return { ...MOCK_USER_SESSION };
    }

    return null;
};

export const tryMockLawyerLogin = (email, password) => {
    if (!isMockAuthEnabled()) {
        return null;
    }

    if (
        email.trim().toLowerCase() === MOCK_LAWYER.email &&
        password === MOCK_LAWYER.password
    ) {
        return { ...MOCK_LAWYER_SESSION };
    }

    return null;
};

export const persistMockSession = (session) => {
    localStorage.setItem('user', JSON.stringify(session));
    localStorage.setItem('access_token', session.access_token);
    axiosSetAuthHeader(session.access_token);
};

export const getMockSessionFromToken = (token) => {
    if (token === MOCK_USER_TOKEN) {
        return { ...MOCK_USER_SESSION };
    }

    if (token === MOCK_LAWYER_TOKEN) {
        return { ...MOCK_LAWYER_SESSION };
    }

    return null;
};

const axiosSetAuthHeader = (token) => {
    // eslint-disable-next-line global-require
    const axios = require('axios');
    axios.defaults.headers.common.Authorization = token;
};

export const MOCK_LAWYER_PROFILE_DETAIL = {
    status_code: 200,
    user_id: 'mock-lawyer-001',
    name: 'Demo Lawyer',
    email: 'demo.lawyer@lexone.local',
    mobile: '5551000002',
    user_image: '',
    rating: 4.8,
    reviews: 32,
    completed_jobs: 58,
    location: 'Ciudad de Mexico',
    about: 'Perfil de abogado de demostración para desarrollo local.',
    profile_verified: 'true',
    payment_verified: 'true',
    specialty: 'Corporate & Business Law',
    portfolio: [],
    credentials: [
        'Licenciatura en Derecho, Universidad Nacional Autónoma de México (UNAM)',
        'Cédula profesional 1234567',
        'Maestría en Derecho Corporativo, ITAM',
        'Miembro de la Barra Mexicana de Abogados',
        'Certificación en Mediación y Resolución de Conflictos',
    ],
};

// Lawyer availability used to power the "Schedule Appointment" flow on the
// client-facing tasker profile page (TakerView.js) until a real
// availability/Google Calendar backend exists.
export const MOCK_LAWYER_AVAILABILITY = [
    { date: '2026-06-22', day_label: 'Lunes', slots: ['09:00', '10:30', '14:00', '16:30'] },
    { date: '2026-06-23', day_label: 'Martes', slots: ['09:30', '11:00', '15:00'] },
    { date: '2026-06-24', day_label: 'Miércoles', slots: ['10:00', '13:00', '17:00'] },
    { date: '2026-06-26', day_label: 'Viernes', slots: ['09:00', '12:00'] },
];

export const MOCK_LAWYER_DASHBOARD = {
    status_code: 200,
    total_tasks: 12,
    upcoming_tasks: 3,
    completed_tasks: 8,
    total_earnings: '14500.00',
    pending_earnings: '3600.00',
    earn: {
        week: [
            { duration: 'Mon', earns: 0 },
            { duration: 'Tue', earns: 1200 },
            { duration: 'Wed', earns: 800 },
            { duration: 'Thu', earns: 2100 },
            { duration: 'Fri', earns: 1500 },
            { duration: 'Sat', earns: 900 },
            { duration: 'Sun', earns: 0 },
        ],
        month: [
            { duration: 'Week 1', earns: 4200 },
            { duration: 'Week 2', earns: 3800 },
            { duration: 'Week 3', earns: 4600 },
            { duration: 'Week 4', earns: 1900 },
        ],
    },
    upcoming: [],
};

export const MOCK_LAWYER_BOOKINGS_ONGOING = [
    {
        item_id: 'mock-tbooking-301',
        reference_id: 'lx10231',
        item_name: 'Carlos Mendez',
        item_image: '',
        date: '2026-06-09T10:00:00.000Z',
        status: 'started',
        price: '1200.00',
    },
    {
        item_id: 'mock-tbooking-302',
        reference_id: 'lx10245',
        item_name: 'Ana Torres',
        item_image: '',
        date: '2026-06-12T14:00:00.000Z',
        status: 'accepted',
        price: '850.00',
    },
    {
        item_id: 'mock-tbooking-303',
        reference_id: 'lx10260',
        item_name: 'Miguel Herrera',
        item_image: '',
        date: '2026-06-15T09:00:00.000Z',
        status: 'accepted',
        price: '600.00',
    },
];

export const MOCK_LAWYER_BOOKINGS_COMPLETED = [
    {
        item_id: 'mock-tbooking-401',
        reference_id: 'lx10180',
        item_name: 'Roberto Silva',
        item_image: '',
        date: '2026-05-20T09:00:00.000Z',
        status: 'completed',
        price: '2400.00',
    },
    {
        item_id: 'mock-tbooking-402',
        reference_id: 'lx10195',
        item_name: 'Sofia Reyes',
        item_image: '',
        date: '2026-05-28T11:00:00.000Z',
        status: 'completed',
        price: '600.00',
    },
];

export const MOCK_CLIENTS = [
    {
        client_id: 'mock-client-001',
        name: 'Carlos Mendez',
        email: 'c.mendez@correo.mx',
        phone: '+52 55 1234 5678',
        address: 'Av. Insurgentes Sur 1602, Del Valle, CDMX',
        chat_id: 'mock-chat-c001',
        case_ids: ['mock-case-001', 'mock-case-002'],
    },
    {
        client_id: 'mock-client-002',
        name: 'Ana Torres',
        email: 'ana.torres@correo.mx',
        phone: '+52 55 8765 4321',
        address: 'Calle Durango 42, Roma Norte, CDMX',
        chat_id: 'mock-chat-c002',
        case_ids: ['mock-case-003'],
    },
    {
        client_id: 'mock-client-003',
        name: 'Miguel Herrera',
        email: 'm.herrera@correo.mx',
        phone: '+52 55 5555 1234',
        address: 'Blvd. Manuel Avila Camacho 88, Naucalpan, Estado de México',
        chat_id: 'mock-chat-c003',
        case_ids: ['mock-case-004'],
    },
];

export const MOCK_CASES = [
    {
        case_id: 'mock-case-001',
        reference_id: 'lx10231',
        client_id: 'mock-client-001',
        client_name: 'Carlos Mendez',
        description: 'Revisión y elaboración de contrato de compraventa de inmueble ubicado en Polanco. El cliente desea adquirir un departamento y requiere asesoría en la documentación y cláusulas de garantía.',
        status: 'started',
        created_date: '2026-05-10',
        documents: [
            { doc_id: 'doc-001-v1', name: 'Contrato de Compraventa', type: 'Contrato de Compraventa', version: 1, date: '2026-05-10', file_name: 'contrato_compraventa_v1.pdf' },
            { doc_id: 'doc-001-v2', name: 'Contrato de Compraventa', type: 'Contrato de Compraventa', version: 2, date: '2026-05-18', file_name: 'contrato_compraventa_v2.pdf' },
        ],
        activities: [
            {
                activity_id: 'act-001-1',
                category: 'Cita con cliente',
                type: 'Reunión',
                date: '2026-05-10',
                description: 'Reunión inicial con el cliente para revisar los términos de la compraventa del departamento en Polanco.',
                notes: 'Cliente entregó copia de identificación y comprobante de domicilio.',
            },
            {
                activity_id: 'act-001-2',
                category: 'Revisión documental',
                type: 'Trabajo interno',
                date: '2026-05-16',
                description: 'Revisión de cláusulas de garantía y condiciones de pago del contrato de compraventa, incluyendo verificación de antecedentes registrales del inmueble.',
                notes: 'Se identificó una discrepancia en la superficie registrada; pendiente de confirmar con el notario.',
            },
        ],
    },
    {
        case_id: 'mock-case-002',
        reference_id: 'lx10260',
        client_id: 'mock-client-001',
        client_name: 'Carlos Mendez',
        description: 'Tramitación de poder notarial general para representación en trámites bancarios y administrativos ante instituciones gubernamentales.',
        status: 'accepted',
        created_date: '2026-06-01',
        documents: [
            { doc_id: 'doc-002-v1', name: 'Poder Notarial General', type: 'Poder Notarial General', version: 1, date: '2026-06-01', file_name: 'poder_notarial_v1.pdf' },
        ],
        activities: [
            {
                activity_id: 'act-002-1',
                category: 'Cita con cliente',
                type: 'Llamada telefónica',
                date: '2026-06-01',
                description: 'Llamada para definir el alcance del poder notarial general requerido para trámites bancarios y administrativos.',
                notes: 'Cliente solicitó que el poder incluya facultades para representación ante el SAT.',
            },
        ],
    },
    {
        case_id: 'mock-case-003',
        reference_id: 'lx10245',
        client_id: 'mock-client-002',
        client_name: 'Ana Torres',
        description: 'Proceso de divorcio por mutuo acuerdo. Se requiere elaborar convenio de divorcio incluyendo régimen de bienes y custodia de menores.',
        status: 'started',
        created_date: '2026-05-20',
        documents: [
            { doc_id: 'doc-003-v1', name: 'Acuerdo de Divorcio', type: 'Acuerdo de Divorcio', version: 1, date: '2026-05-22', file_name: 'acuerdo_divorcio_v1.pdf' },
        ],
        activities: [
            {
                activity_id: 'act-003-1',
                category: 'Cita con cliente',
                type: 'Reunión',
                date: '2026-05-20',
                description: 'Primera reunión con la cliente para recabar información sobre el régimen de bienes y la situación de custodia de los menores.',
                notes: 'Se acordó que ambas partes están de acuerdo en custodia compartida.',
            },
            {
                activity_id: 'act-003-2',
                category: 'Visita al juzgado',
                type: 'Trámite judicial',
                date: '2026-05-28',
                description: 'Presentación de la solicitud de divorcio por mutuo acuerdo ante el Juzgado Familiar correspondiente, incluyendo entrega del convenio preliminar y documentación de identidad de ambas partes.',
                notes: 'El juzgado asignó número de expediente y fecha de audiencia preliminar.',
            },
            {
                activity_id: 'act-003-3',
                category: 'Llamada con cliente',
                type: 'Seguimiento',
                date: '2026-06-05',
                description: 'Llamada de seguimiento para informar el avance del trámite y la fecha asignada para la audiencia preliminar ante el juzgado familiar. Se revisaron también los puntos pendientes del convenio de divorcio relacionados con la pensión alimenticia y el régimen de visitas, de forma que la cliente pudiera preparar la documentación adicional solicitada por el juzgado antes de la siguiente cita.',
                notes: 'Cliente quedó pendiente de enviar comprobante de ingresos actualizado.',
            },
        ],
    },
    {
        case_id: 'mock-case-004',
        reference_id: 'lx10180',
        client_id: 'mock-client-003',
        client_name: 'Miguel Herrera',
        description: 'Constitución de sociedad de responsabilidad limitada para empresa de tecnología. Se incluye redacción de acta constitutiva y estatutos sociales.',
        status: 'completed',
        created_date: '2026-04-05',
        documents: [
            { doc_id: 'doc-004-v1', name: 'Acta Constitutiva', type: 'Acta Constitutiva de Sociedad', version: 1, date: '2026-04-05', file_name: 'acta_constitutiva_v1.pdf' },
            { doc_id: 'doc-004-v2', name: 'Acta Constitutiva', type: 'Acta Constitutiva de Sociedad', version: 2, date: '2026-04-15', file_name: 'acta_constitutiva_v2.pdf' },
        ],
        activities: [
            {
                activity_id: 'act-004-1',
                category: 'Cita con cliente',
                type: 'Reunión',
                date: '2026-04-05',
                description: 'Reunión con los socios fundadores para definir el objeto social, capital social y distribución de partes sociales de la nueva sociedad.',
                notes: 'Socios acordaron capital social de $500,000 MXN dividido en partes iguales.',
            },
            {
                activity_id: 'act-004-2',
                category: 'Visita notarial',
                type: 'Trámite notarial',
                date: '2026-04-14',
                description: 'Firma del acta constitutiva ante notario público y protocolización del instrumento.',
                notes: 'Quedó pendiente la inscripción en el Registro Público de Comercio.',
            },
        ],
    },
];

export const MOCK_APPOINTMENTS = [
    {
        appointment_id: 'mock-appt-001',
        title: 'Revisión de contrato',
        client_id: 'mock-client-001',
        client_name: 'Carlos Mendez',
        case_id: 'mock-case-001',
        reference_id: 'lx10231',
        date: '2026-06-23',
        time: '10:00',
        type: 'online',
        link: 'https://meet.google.com/abc-defg-hij',
        location: null,
        notes: 'Revisar cláusulas 3 y 7 del contrato de compraventa.',
    },
    {
        appointment_id: 'mock-appt-002',
        title: 'Consulta divorcio',
        client_id: 'mock-client-002',
        client_name: 'Ana Torres',
        case_id: 'mock-case-003',
        reference_id: 'lx10245',
        date: '2026-06-25',
        time: '14:30',
        type: 'in-person',
        link: null,
        location: 'Av. Presidente Masaryk 61, Polanco, CDMX',
        notes: 'Traer acta de matrimonio y documentos de bienes.',
    },
    {
        appointment_id: 'mock-appt-003',
        title: 'Primera consulta',
        client_id: null,
        client_name: 'Roberto Castillo',
        case_id: null,
        reference_id: null,
        date: '2026-06-27',
        time: '11:00',
        type: 'online',
        link: 'https://zoom.us/j/123456789',
        location: null,
        notes: 'Nuevo cliente. Consulta sobre contrato de trabajo.',
    },
    {
        appointment_id: 'mock-appt-004',
        title: 'Firma de escritura',
        client_id: 'mock-client-001',
        client_name: 'Carlos Mendez',
        case_id: 'mock-case-002',
        reference_id: 'lx10260',
        date: '2026-07-02',
        time: '09:00',
        type: 'in-person',
        link: null,
        location: 'Notaría 42, Calle Sócrates 128, Polanco, CDMX',
        notes: 'Llevar identificación oficial y comprobante de domicilio.',
    },
];

export const getStoredMockSession = () => {
    const token = localStorage.getItem('access_token');
    if (!isMockToken(token)) {
        return null;
    }

    try {
        return JSON.parse(localStorage.getItem('user') || 'null');
    } catch (error) {
        return getMockSessionFromToken(token);
    }
};
