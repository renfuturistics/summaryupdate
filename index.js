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
    platform: "com.zambia.ecoesmara",
    projectId: "67198dbd00277f568222",
    storageId: "671992c80019376d25f1",
    databaseId: "671990030023bc46a07a",
    userCollectionId: "6719901a0029b981b666",
    videoCollectionId: "6719902e002d4501a460",
    coursesCollectionId: "67335b4f000fd5559638",
    lessonsCollectionId: "67335bbe00123573e330",
    userCoursesCollectionId: "673353f6001566d5f853",
    postsCollectionId: "6735f193002676cd0e7f",
    notificationCollectionId: "6749a841002bba848436",
    commentsCollectionId: "673d0849000dddc44721",
    followsCollectionId: "674ed0910011543c47b8",
    conversationsCollectionId: "675ff98a0034a054c900",
    messagesCollectionId: "675ffbe600292a61dc98",
    certificateFunctionId: "676fc380002e66f4afbe",
    grownthCollectionId: "677ba1ad002846adc8e1",
    subscriptionCollectionId: "6773c7bd000ca5f2a632",
    apiKey: "standard_3535ea30bed6d040d260e48d02bab123e399e6e23d584cdaf42260cebd3c45a1682b56009c03fd199d7b6fd7c9e8bb05d9e22fa75016d58fc68d284acbea3d6d1299df0376245f696d0d97119b4fe030c3bd4749feac07d9b23c98ad7c83c8b4c52d61c2a7ad29bb57b19b491d1f6d8f4a1100b85bbe909e2c3bdd93f85870c3",
};
function default_1(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var client, databases, event_1, payload, userId, courseId, completedLessons, isCompleted, growthSummaryResponse, growthSummary, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = new node_appwrite_1.Client();
                    databases = new node_appwrite_1.Databases(client);
                    client
                        .setEndpoint(exports.appwriteConfig.endpoint)
                        .setProject(exports.appwriteConfig.projectId)
                        .setKey(exports.appwriteConfig.apiKey);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, , 10]);
                    event_1 = req.variables["APPWRITE_FUNCTION_EVENT"] || "";
                    payload = JSON.parse(req.variables["APPWRITE_FUNCTION_EVENT_DATA"] || "{}");
                    if (!event_1.includes("collections.YOUR_USER_COURSES_COLLECTION_ID.documents")) return [3 /*break*/, 7];
                    userId = payload.user;
                    courseId = payload.course;
                    completedLessons = payload.completedLessons || 0;
                    isCompleted = payload.isCompleted || false;
                    return [4 /*yield*/, databases.listDocuments(exports.appwriteConfig.databaseId, exports.appwriteConfig.grownthCollectionId, [node_appwrite_1.Query.equal("userId", userId)])];
                case 2:
                    growthSummaryResponse = _a.sent();
                    growthSummary = growthSummaryResponse.documents[0];
                    if (!growthSummary) return [3 /*break*/, 4];
                    // Update existing growth summary
                    return [4 /*yield*/, databases.updateDocument(exports.appwriteConfig.databaseId, exports.appwriteConfig.grownthCollectionId, growthSummary.$id, {
                            totalLessonsCompleted: growthSummary.totalLessonsCompleted + completedLessons,
                            totalCoursesCompleted: growthSummary.totalCoursesCompleted + (isCompleted ? 1 : 0),
                            lastActivityDate: new Date().toISOString(),
                            daysActive: growthSummary.daysActive + 1,
                        })];
                case 3:
                    // Update existing growth summary
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4: 
                // Create a new growth summary record
                return [4 /*yield*/, databases.createDocument(exports.appwriteConfig.databaseId, exports.appwriteConfig.grownthCollectionId, node_appwrite_1.ID.unique(), {
                        userId: userId,
                        totalLessonsCompleted: completedLessons,
                        totalCoursesCompleted: isCompleted ? 1 : 0,
                        totalTimeSpent: 0, // Set to zero or calculate from other data
                        lastActivityDate: new Date().toISOString(),
                        daysActive: 1,
                    })];
                case 5:
                    // Create a new growth summary record
                    _a.sent();
                    _a.label = 6;
                case 6:
                    res.json({ success: true });
                    return [3 /*break*/, 8];
                case 7:
                    res.json({
                        success: false,
                        message: "Event not relevant to this function",
                    });
                    _a.label = 8;
                case 8: return [3 /*break*/, 10];
                case 9:
                    error_1 = _a.sent();
                    console.error("Error in growth summary function:", error_1);
                    res.json({ success: false, error: error_1.message });
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}