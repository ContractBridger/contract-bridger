"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
require("dotenv/config");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (_, res) => {
    res.status(200).json({ message: "success" });
});
app.use(routes_1.default);
app.listen(process.env.PORT || 8080, () => {
    console.log(`Server running in port ${process.env.PORT || 8080}`);
});
