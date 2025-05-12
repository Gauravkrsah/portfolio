"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealthStatus = void 0;
// Health check controller
const getHealthStatus = (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API is running' });
};
exports.getHealthStatus = getHealthStatus;
