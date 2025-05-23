"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBuildingById = void 0;
const sql_1 = __importDefault(require("../../config/sql"));
const GetBuildingById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                message: 'Building ID is required',
            });
            return;
        }
        const query = `
            SELECT id, name
            FROM buildings 
            WHERE id = $1;
        `;
        const { rows } = yield sql_1.default.query(query, [id]);
        if (rows.length === 0) {
            res.status(404).json({
                message: 'Building not found',
            });
            return;
        }
        res.status(200).json({
            data: rows[0]
        });
    }
    catch (error) {
        console.error('Error retrieving building:', error);
        res.status(500).json({
            message: 'Internal server error while retrieving building'
        });
    }
});
exports.GetBuildingById = GetBuildingById;
