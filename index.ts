import { Client, Databases, ID, Query } from "node-appwrite";

export const appwriteConfig = {
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
    // Directly use req.body if the event is not found in req.variables
    const payload = req.body || {}; // Assuming the data is sent directly in the body of the request

    log("Payload:", payload); // Log the payload to check if it contains the expected data

    // Check if the event includes your collection and event type
    const event = req.headers["x-appwrite-event"] || ""; // Alternatively, check headers for event info
    log("Event:", event);

    if (event.includes(`collections.${appwriteConfig.userCoursesCollectionId}.documents`)) {
      const userId = payload.user;
      const courseId = payload.course;
      const completedLessons = payload.completedLessons || 0;
      const isCompleted = payload.isCompleted || false;

      // Fetch the user's growth summary
      const growthSummaryResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.grownthCollectionId,
        [Query.equal("userId", userId)]
      );

      let growthSummary = growthSummaryResponse.documents[0];

      if (growthSummary) {
        // Update existing growth summary
        await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.grownthCollectionId,
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
          appwriteConfig.databaseId,
          appwriteConfig.grownthCollectionId,
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

      return res.json({ success: true });
    } else {
      return res.json({
        success: false,
        message: "Event not relevant to this function",
      });
    }
  } catch (error: any) {
    log(error);
    console.error("Error in growth summary function:", error);
    return res.json({ success: false, error: error.message });
  }
}
