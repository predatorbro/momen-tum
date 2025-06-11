import { Account, Client, ID } from "appwrite";
import getDate from "../components/getDate";
import DocsService from "./handleDocs";
import pushupImage from "/pushup.jpg";
class auth {
  client = new Client();
  account;
  constructor() {
    this.client.setProject("679c44cb000fc93fd3e6");

    this.account = new Account(this.client);
  }
  async createUser({ username, password, email }) {
    try {
      // Create the user
      const user = await this.account.create(
        ID.unique(),
        email,
        password,
        username
      );

      if (user) {
        // Log the user in
        const loggedInUser = await this.login({ email, password });

        if (loggedInUser) {
          // Create default exercise document for the new user
          const defaultExercise = {
            exerciseName: "Pushups",
            exerciseSets: [" 1 X 10 reps", " 1 X 10 reps", " 1 X 10 reps"],
            exerciseStatus: [false, false, false],
          };
          const response = await fetch(pushupImage);
          const blob = await response.blob();
          const file = new File([blob], "pushup.jpg", { type: blob.type });

          await DocsService.createDoc(
            JSON.stringify(defaultExercise),
            file,
            getDate().day,
            loggedInUser.$id
          );
        }

        return loggedInUser;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async login({ email, password }) {
    try {
      const user = await this.account.createEmailPasswordSession(
        email,
        password
      );
      if (user) return this.getCurrentUser();
    } catch (error) {
      console.log(error);
    }
  }
  async getCurrentUser() {
    try {
      const user = await this.account.get();
      return user;
    } catch (error) {
      console.log(error);
    }
  }
  async logout() {
    try {
      const user = await this.account.deleteSessions();
      return user;
    } catch (error) {
      console.log(error);
    }
  }
}

const authService = new auth();
export default authService;
