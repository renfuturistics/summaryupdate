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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const node_appwrite_1 = require("node-appwrite");
function default_1(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new node_appwrite_1.Client();
        const databases = new node_appwrite_1.Databases(client);
        client
            .setEndpoint("https://cloud.appwrite.io/v1")
            .setProject("67198dbd00277f568222");
        try {
            const event = req.variables["APPWRITE_FUNCTION_EVENT"] || "";
            const payload = JSON.parse(req.variables["APPWRITE_FUNCTION_EVENT_DATA"] || "{}");
            if (event.includes("collections.673353f6001566d5f853.documents")) {
                const userId = payload.user;
                const courseId = payload.course;
                const completedLessons = payload.completedLessons || 0;
                const isCompleted = payload.isCompleted || false;
                const growthSummaryResponse = yield databases.listDocuments("671990030023bc46a07a", "677ba1ad002846adc8e1", [node_appwrite_1.Query.equal("userId", userId)]);
                let growthSummary = growthSummaryResponse.documents[0];
                if (growthSummary) {
                    yield databases.updateDocument("671990030023bc46a07a", "677ba1ad002846adc8e1", growthSummary.$id, {
                        totalLessonsCompleted: growthSummary.totalLessonsCompleted + completedLessons,
                        totalCoursesCompleted: growthSummary.totalCoursesCompleted + (isCompleted ? 1 : 0),
                        lastActivityDate: new Date().toISOString(),
                        daysActive: growthSummary.daysActive + 1,
                    });
                }
                else {
                    yield databases.createDocument("671990030023bc46a07a", "677ba1ad002846adc8e1", node_appwrite_1.ID.unique(), {
                        userId,
                        totalLessonsCompleted: completedLessons,
                        totalCoursesCompleted: isCompleted ? 1 : 0,
                        totalTimeSpent: 0,
                        lastActivityDate: new Date().toISOString(),
                        daysActive: 1,
                    });
                }
                res.json({ success: true });
            }
            else {
                res.json({ success: false, message: "Event not relevant to this function" });
            }
        }
        catch (error) {
            console.error("Error in growth summary function:", error);
            res.json({ success: false, error: error.message });
        }
    });
}
//# sourceMappingURL=index.js.map