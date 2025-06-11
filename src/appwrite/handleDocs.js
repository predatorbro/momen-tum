import { Client, Databases, ID, Query, Storage } from "appwrite";
import authService from "./authentication";
import getDate from "../components/getDate";
import { CodeSquare } from "lucide-react";
import { jsx } from "react/jsx-runtime";
import { nanoid } from "nanoid";

class docsService {
  client = new Client();
  databases;
  storage;
  constructor() {
    this.client
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject("679c44cb000fc93fd3e6");

    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
  }

  async createDoc(data, image, currentPage, userid) {
    // console.log(userid);

    let imageUrl = "";
    if (image) {
      const file = await this.storage.createFile(
        "679c7c640017c39ff314",
        ID.unique(),
        image
      );

      if (file) {
        imageUrl = file.$id;
      }
    }
    try {
      const docs = await this.databases.createDocument(
        "679c44f8001a00f1533a",
        "679c451f003a66b608d5",
        ID.unique(),
        {
          userid: userid,
          exercise: data,
          imageUrl: imageUrl,
          day: currentPage,
        }
      );
      return docs;
    } catch (error) {
      console.log(error);
    }
  }
  async editDoc({ data, exerciseID }) {
    try {
      const docs = await this.databases.updateDocument(
        "679c44f8001a00f1533a",
        "679c451f003a66b608d5",
        exerciseID,
        {
          exercise: JSON.stringify(data),
        }
      );
      return docs;
    } catch (error) {
      console.log(error);
    }
  }
  async getDocs(userid) {
    try {
      const docs = await this.databases.listDocuments(
        "679c44f8001a00f1533a",
        "679c451f003a66b608d5",
        [Query.equal("userid", userid)]
      );
      return docs;
    } catch (error) {
      console.log(error);
    }
  }

  async getHistory(userid) {
    try {
      const docs = await this.databases.listDocuments(
        "679c44f8001a00f1533a",
        "679ed3e1002918b6b1dc",
        [Query.equal("userid", userid)]
      );
      return docs;
    } catch (error) {
      console.log(error);
    }
  }

  async setHistory({ exercise, imageUrl, exerciseID }) {
    const today = getDate().date;
    const user = await authService.getCurrentUser();

    if (!user) {
      console.error("User not found!");
      return;
    }

    const userId = user.$id;

    // Fetch today's document
    const docs = await this.databases.listDocuments(
      "679c44f8001a00f1533a",
      "679ed3e1002918b6b1dc",
      [Query.equal("userid", userId), Query.equal("date", today)]
    );

    exercise.imageUrl = imageUrl;
    exercise.exerciseID = exerciseID;

    if (docs.total > 0) {
      // If today's document exists, update it
      const doc = docs.documents[0];
      let completedExercises = JSON.parse(doc.completedExercises);

      // Check if the exercise already exists based on exerciseID
      const exists = completedExercises.some(
        (e) => e.exerciseID === exercise.exerciseID
      );

      if (!exists) {
        completedExercises.push(exercise);
      }

      // Remove duplicates based on exerciseID
      const uniqueExercises = completedExercises.filter(
        (value, index, self) =>
          index === self.findIndex((e) => e.exerciseID === value.exerciseID)
      );

      await this.databases.updateDocument(
        "679c44f8001a00f1533a",
        "679ed3e1002918b6b1dc",
        doc.$id,
        { completedExercises: JSON.stringify(uniqueExercises) }
      );

      console.log("Exercise added to existing history (if not duplicate)!");
    } else {
      // If no document for today, create a new one
      await this.databases.createDocument(
        "679c44f8001a00f1533a",
        "679ed3e1002918b6b1dc",
        ID.unique(),
        {
          userid: userId,
          date: today,
          completedExercises: JSON.stringify([exercise]),
        }
      );

      console.log("New history document created!");
    }
  }

  getImagePreview(imageUrl) {
    if (imageUrl) {
      const url = this.storage.getFilePreview("679c7c640017c39ff314", imageUrl);
      return url;
    }
  }
  async deleteDoc(docid) {
    const resp = await this.databases.deleteDocument(
      "679c44f8001a00f1533a",
      "679c451f003a66b608d5",
      docid
    );
    return resp;
  }
}
const DocsService = new docsService();

export default DocsService;
