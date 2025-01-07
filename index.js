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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appwriteConfig = void 0;
exports.default = default_1;
var node_appwrite_1 = require("node-appwrite");
exports.appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    projectId: "67198dbd00277f568222",
    databaseId: "671990030023bc46a07a",
    userCoursesCollectionId: "673353f6001566d5f853",
    grownthCollectionId: "677ba1ad002846adc8e1",
    apiKey: "standard_3535ea30bed6d040d260e48d02bab123e399e6e23d584cdaf42260cebd3c45a1682b56009c03fd199d7b6fd7c9e8bb05d9e22fa75016d58fc68d284acbea3d6d1299df0376245f696d0d97119b4fe030c3bd4749feac07d9b23c98ad7c83c8b4c52d61c2a7ad29bb57b19b491d1f6d8f4a1100b85bbe909e2c3bdd93f85870c3",
};
function default_1(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, databases, payload, event_1, userId, completedLessons, isCompleted, lastUpdatedAttribute, growthSummaryResponse, growthSummary, today, lastActivityDate, isNewDay, err_1;
        var req = _b.req, res = _b.res, log = _b.log, error = _b.error;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    client = new node_appwrite_1.Client();
                    databases = new node_appwrite_1.Databases(client);
                    client
                        .setEndpoint(exports.appwriteConfig.endpoint)
                        .setProject(exports.appwriteConfig.projectId)
                        .setKey(exports.appwriteConfig.apiKey);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 9, , 10]);
                    payload = req.body || {};
                    event_1 = req.headers["x-appwrite-event"] || "";
                    if (!event_1.includes("collections.".concat(exports.appwriteConfig.userCoursesCollectionId, ".documents"))) return [3 /*break*/, 7];
                    userId = payload.user;
                    completedLessons = payload.completedLessons || 0;
                    isCompleted = payload.isCompleted || false;
                    lastUpdatedAttribute = payload.lastUpdatedAttribute || "";
                    if (!(lastUpdatedAttribute === "completedLessons")) return [3 /*break*/, 6];
                    return [4 /*yield*/, databases.listDocuments(exports.appwriteConfig.databaseId, exports.appwriteConfig.grownthCollectionId, [node_appwrite_1.Query.equal("userId", userId)])];
                case 2:
                    growthSummaryResponse = _c.sent();
                    growthSummary = growthSummaryResponse.documents[0];
                    today = new Date().toISOString().split("T")[0];
                    if (!growthSummary) return [3 /*break*/, 4];
                    lastActivityDate = growthSummary.lastActivityDate
                        ? growthSummary.lastActivityDate.split("T")[0]
                        : null;
                    isNewDay = lastActivityDate !== today;
                    // Update growth summary
                    return [4 /*yield*/, databases.updateDocument(exports.appwriteConfig.databaseId, exports.appwriteConfig.grownthCollectionId, growthSummary.$id, {
                            totalLessonsCompleted: growthSummary.totalLessonsCompleted + 1, // Increment by 1
                            totalCoursesCompleted: growthSummary.totalCoursesCompleted + (isCompleted ? 1 : 0),
                            lastActivityDate: new Date().toISOString(),
                            daysActive: growthSummary.daysActive + (isNewDay ? 1 : 0),
                        })];
                case 3:
                    // Update growth summary
                    _c.sent();
                    return [3 /*break*/, 6];
                case 4: 
                // Create new growth summary if none exists
                return [4 /*yield*/, databases.createDocument(exports.appwriteConfig.databaseId, exports.appwriteConfig.grownthCollectionId, node_appwrite_1.ID.unique(), {
                        userId: userId,
                        totalLessonsCompleted: 1, // First lesson completed
                        totalCoursesCompleted: isCompleted ? 1 : 0,
                        totalTimeSpent: 0,
                        lastActivityDate: new Date().toISOString(),
                        daysActive: 1, // First activity starts at 1 day
                    })];
                case 5:
                    // Create new growth summary if none exists
                    _c.sent();
                    _c.label = 6;
                case 6: return [2 /*return*/, res.json({ success: true })];
                case 7: return [2 /*return*/, res.json({
                        success: false,
                        message: "Event not relevant to this function",
                    })];
                case 8: return [3 /*break*/, 10];
                case 9:
                    err_1 = _c.sent();
                    log(err_1);
                    error("Error in growth summary function:", err_1);
                    return [2 /*return*/, res.json({ success: false, error: err_1.message })];
                case 10: return [2 /*return*/];
            }
        });
    });
}
