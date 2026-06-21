const Case = require("../../models/caseModel");

function sendError(res, statusCode, message) {
    return res.status(statusCode >= 500 ? 500 : 200).json({ status_code: statusCode, message });
}

function formatDate(date) {
    return date.toISOString().split("T")[0];
}

function serializeCase(cas) {
    const item = cas.toObject ? cas.toObject() : cas;
    return {
        case_id: String(item._id),
        reference_id: item.reference_id,
        client_id: item.client_id,
        client_name: item.client_name,
        description: item.description,
        status: item.status,
        created_date: formatDate(new Date(item.created_date)),
        documents: (item.documents || []).map(serializeDocument),
    };
}

function serializeDocument(doc) {
    return {
        doc_id: String(doc._id),
        type: doc.type,
        version: doc.version,
        file_name: doc.file_name,
        file_url: doc.file_url,
        date: formatDate(new Date(doc.date)),
    };
}

exports.listCases = async function (req, res) {
    try {
        const cases = await Case.find({ tasker_id: req.params.tasker_id }).sort({ created_date: -1 });
        return res.status(200).json({ status_code: 200, cases: cases.map(serializeCase) });
    } catch (error) {
        return sendError(res, 500, "Unable to load cases");
    }
};

exports.getCase = async function (req, res) {
    try {
        const cas = await Case.findOne({ _id: req.params.case_id, tasker_id: req.params.tasker_id });
        if (!cas) return sendError(res, 404, "Case not found");
        return res.status(200).json({ status_code: 200, case: serializeCase(cas) });
    } catch (error) {
        return sendError(res, 500, "Unable to load case");
    }
};

exports.listDocuments = async function (req, res) {
    try {
        const cas = await Case.findOne({ _id: req.params.case_id, tasker_id: req.query.tasker_id });
        if (!cas) return sendError(res, 404, "Case not found");
        return res.status(200).json({ status_code: 200, documents: cas.documents.map(serializeDocument) });
    } catch (error) {
        return sendError(res, 500, "Unable to load documents");
    }
};

exports.uploadDocument = async function (req, res) {
    try {
        if (!req.file) return sendError(res, 400, "No file uploaded");
        if (!req.body.doc_type) return sendError(res, 400, "doc_type is required");

        const cas = await Case.findOne({ _id: req.params.case_id, tasker_id: req.body.tasker_id });
        if (!cas) return sendError(res, 404, "Case not found");

        const sameType = cas.documents.filter((d) => d.type === req.body.doc_type);
        const nextVersion = sameType.length > 0
            ? Math.max(...sameType.map((d) => d.version)) + 1
            : 1;

        const fileUrl = `${process.env.BASE_URL}${process.env.DOCS_MEDIA_URL}${req.file.filename}`;

        const newDocument = {
            type: req.body.doc_type,
            version: nextVersion,
            file_name: req.file.originalname,
            file_url: fileUrl,
            date: new Date(),
        };

        cas.documents.push(newDocument);
        await cas.save();

        const savedDocument = cas.documents[cas.documents.length - 1];
        return res.status(200).json({ status_code: 200, document: serializeDocument(savedDocument) });
    } catch (error) {
        return sendError(res, 500, "Unable to upload document");
    }
};
