"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_js_1 = __importDefault(require("./app.js"));
const PORT = process.env.PORT || 8080;
const server = http_1.default.createServer(app_js_1.default);
server.listen(PORT, () => console.log(`its's alive on http://localhost:${PORT}`));
//# sourceMappingURL=server.js.map