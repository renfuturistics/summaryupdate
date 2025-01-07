import { Client, Databases, ID, Query } from "node-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "67198dbd00277f568222",
  databaseId: "671990030023bc46a07a",
  userCoursesCollectionId: "673353f6001566d5f853",
  grownthCollectionId: "677ba1ad002846adc8e1",
  apiKey:
    "standard_3535ea30bed6d040d260e48d02bab123e399e6e23d584cdaf42260cebd3c45a1682b56009c03fd199d7b6fd7c9e8bb05d9e22fa75016d58fc68d284acbea3d6d1299df0376245f696d0d97119b4fe030c3bd4749feac07d9b23c98ad7c83c8b4c52d61c2a7ad29bb57b19b491d1f6d8f4a1100b85bbe909e2c3bdd93f85870c3",
};

export default async function ({ req, res, log, error }: any) {
  const client = new Client();
  const databases = new Databases(client);

  client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setKey(appwriteConfig.apiKey);

  try {
    const payload = req.body || {};
    const event = req.headers["x-appwrite-event"] || "";

    if (
      event.includes(
        `collections.${appwriteConfig.userCoursesCollectionId}.documents`
      )
    ) {
      const userId = payload.user;
      const completedLessons = payload.completedLessons || 0;
      const isCompleted = payload.isCompleted || false;
      const lastUpdatedAttribute = payload.lastUpdatedAttribute || "";

      // Proceed only if the updated attribute is "completedLessons"
      if (lastUpdatedAttribute === "completedLessons") {
        // Fetch the user's growth summary
        const growthSummaryResponse = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.grownthCollectionId,
          [Query.equal("userId", userId)]
        );

        let growthSummary = growthSummaryResponse.documents[0];
        const today = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

        if (growthSummary) {
          const lastActivityDate = growthSummary.lastActivityDate
            ? growthSummary.lastActivityDate.split("T")[0]
            : null;

          // Check if the user is active on a new day
          const isNewDay = lastActivityDate !== today;

          // Update growth summary
          await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.grownthCollectionId,
            growthSummary.$id,
            {
              totalLessonsCompleted: growthSummary.totalLessonsCompleted + 1, // Increment by 1
              totalCoursesCompleted: growthSummary.totalCoursesCompleted + (isCompleted ? 1 : 0),
              lastActivityDate: new Date().toISOString(),
              daysActive: growthSummary.daysActive + (isNewDay ? 1 : 0),
            }
          );
        } else {
          // Create new growth summary if none exists
          await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.grownthCollectionId,
            ID.unique(),
            {
              userId,
              totalLessonsCompleted: 1, // First lesson completed
              totalCoursesCompleted: isCompleted ? 1 : 0,
              totalTimeSpent: 0,
              lastActivityDate: new Date().toISOString(),
              daysActive: 1, // First activity starts at 1 day
            }
          );
        }
      }

      return res.json({ success: true });
    } else {
      return res.json({
        success: false,
        message: "Event not relevant to this function",
      });
    }
  } catch (err: any) {
    log(err);
    error("Error in growth summary function:", err);
    return res.json({ success: false, error: err.message });
  }
}

