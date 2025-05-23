"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUploadedFile = void 0;
const fs_1 = __importDefault(require("fs"));
const removeUploadedFile = (filePath) => {
    try {
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
    }
    catch (error) {
        console.error(`Error removing file ${filePath}:`, error);
    }
};
exports.removeUploadedFile = removeUploadedFile;
