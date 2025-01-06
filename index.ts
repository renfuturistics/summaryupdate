import { Client, Databases, ID, Query } from "node-appwrite";



export default async function (req: any, res: any) {
  const client = new Client();
  const databases = new Databases(client);

  client
    .setEndpoint(process.env.APPWRITE_ENDPOINT as string)
    .setProject(process.env.APPWRITE_PROJECT_ID as string)
    .setKey(process.env.APPWRITE_API_KEY as string);

  try {
    const { userId, lessonsCompleted, timeSpent } = JSON.parse(req.payload);

    // Fetch existing Growth Summary
    const response = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID as string,
      process.env.APPWRITE_COLLECTION_ID as string,
      [Query.equal("userId", userId)]
    );

    if (response.documents.length > 0) {
      const growthSummary = response.documents[0];

      // Update existing record
      await databases.updateDocument(
        process.env.APPWRITE_DATABASE_ID as string,
        process.env.APPWRITE_COLLECTION_ID as string,
        growthSummary.$id,
        {
          totalLessonsCompleted: growthSummary.totalLessonsCompleted + lessonsCompleted,
          totalTimeSpent: growthSummary.totalTimeSpent + timeSpent,
          lastActivityDate: new Date().toISOString(),
          daysActive: new Set([
            ...(growthSummary.daysActive || []),
            new Date().toDateString(),
          ]).size,
        }
      );
    } else {
      // Create new record
      await databases.createDocument(
        process.env.APPWRITE_DATABASE_ID as string,
        process.env.APPWRITE_COLLECTION_ID as string,
        ID.unique(),
        {
          userId,
          totalLessonsCompleted: lessonsCompleted,
          totalCoursesCompleted: 0,
          totalTimeSpent: timeSpent,
          lastActivityDate: new Date().toISOString(),
          daysActive: 1,
        }
      );
    }

    res.json({ success: true });
  } catch (error:any) {
    console.error("Error updating growth summary:", error);
    res.json({ success: false, error: error.message });
  }
}
