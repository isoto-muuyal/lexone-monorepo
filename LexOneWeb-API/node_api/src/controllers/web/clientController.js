const Client = require("../../models/clientModel");

function sendError(res, statusCode, message) {
    return res.status(statusCode >= 500 ? 500 : 200).json({ status_code: statusCode, message });
}

function serializeClient(client) {
    const item = client.toObject ? client.toObject() : client;
    return {
        client_id: String(item._id),
        name: item.name,
        email: item.email,
        phone: item.phone,
        address: item.address,
        case_ids: item.case_ids || [],
    };
}

exports.listClients = async function (req, res) {
    try {
        const clients = await Client.find({ tasker_id: req.params.tasker_id });
        return res.status(200).json({ status_code: 200, clients: clients.map(serializeClient) });
    } catch (error) {
        return sendError(res, 500, "Unable to load clients");
    }
};

exports.getClient = async function (req, res) {
    try {
        const client = await Client.findOne({ _id: req.params.client_id, tasker_id: req.params.tasker_id });
        if (!client) return sendError(res, 404, "Client not found");
        return res.status(200).json({ status_code: 200, client: serializeClient(client) });
    } catch (error) {
        return sendError(res, 500, "Unable to load client");
    }
};

exports.updateClientNotes = async function (req, res) {
    try {
        const result = await Client.updateOne(
            { _id: req.params.client_id, tasker_id: req.body.tasker_id },
            { $set: { notes: req.body.notes || "" } }
        );
        if (result.n === 0) return sendError(res, 404, "Client not found");
        return res.status(200).json({ status_code: 200 });
    } catch (error) {
        return sendError(res, 500, "Unable to save client notes");
    }
};
