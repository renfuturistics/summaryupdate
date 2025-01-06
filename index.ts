import { Client, Databases, ID, Query } from "node-appwrite";

export default async function (req: any, res: any) {
  const client = new Client();
  const databases = new Databases(client);

  client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("67198dbd00277f568222")

  try {
    const event = req.variables["APPWRITE_FUNCTION_EVENT"] || "";
    const payload = JSON.parse(req.variables["APPWRITE_FUNCTION_EVENT_DATA"] || "{}");

    // Ensure the event is for your target collection
    if (event.includes("collections.673353f6001566d5f853.documents")) {
      const userId = payload.user;
      const courseId = payload.course;
      const completedLessons = payload.completedLessons || 0;
      const isCompleted = payload.isCompleted || false;

      // Fetch the user's growth summary
      const growthSummaryResponse = await databases.listDocuments(
       "671990030023bc46a07a" as string,
        "677ba1ad002846adc8e1",
        [Query.equal("userId", userId)]
      );

      let growthSummary = growthSummaryResponse.documents[0];

      if (growthSummary) {
        // Update existing growth summary
        await databases.updateDocument(
         "671990030023bc46a07a" as string,
          "677ba1ad002846adc8e1",
          growthSummary.$id,
          {
            totalLessonsCompleted: growthSummary.totalLessonsCompleted + completedLessons,
            totalCoursesCompleted: growthSummary.totalCoursesCompleted + (isCompleted ? 1 : 0),
            lastActivityDate: new Date().toISOString(),
            daysActive: growthSummary.daysActive + 1,
          }
        );
      } else {
        // Create a new growth summary record
        await databases.createDocument(
         "671990030023bc46a07a" ,
          "677ba1ad002846adc8e1",
          ID.unique(),
          {
            userId,
            totalLessonsCompleted: completedLessons,
            totalCoursesCompleted: isCompleted ? 1 : 0,
            totalTimeSpent: 0, // Set to zero or calculate from other data
            lastActivityDate: new Date().toISOString(),
            daysActive: 1,
          }
        );
      }

      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Event not relevant to this function" });
    }
  } catch (error:any) {
    console.error("Error in growth summary function:", error);
    res.json({ success: false, error: error.message });
  }
}
