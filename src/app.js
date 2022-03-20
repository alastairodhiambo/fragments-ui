import { Auth, getUser } from "./auth";
import {
  getFragmentData,
  getFragmentMetadata,
  getUserFragments,
  getUserFragmentsExpanded,
  postUserFragment,
} from "./api";

const dragDrop = require("drag-drop");

async function init() {
  // Get our UI elements
  const userSection = document.querySelector("#user");
  const loginBtn = document.querySelector("#login");
  const logoutBtn = document.querySelector("#logout");
  const fragmentSection = document.querySelector("#fragment-section");
  const getUserFragmentsBtn = document.querySelector("#get-user-fragments");
  const getUserFragmentsExpandedBtn = document.querySelector(
    "#get-user-fragments-expanded"
  );
  const getFragmentDataBtn = document.querySelector("#get-fragment-data");
  const getFragmentMetadataBtn = document.querySelector(
    "#get-fragment-metadata"
  );
  const addFragmentBtn = document.querySelector("#add-fragment");

  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation

    Auth.federatedSignIn();
  };
  logoutBtn.onclick = () => {
    // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
    Auth.signOut();
  };

  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();
  if (!user) {
    // Disable the Logout button
    logoutBtn.disabled = true;
    return;
  }

  getUserFragmentsExpanded(user);
  // Log the user info for debugging purposes
  console.log({ user });

  // Update the UI to welcome the user
  userSection.hidden = false;

  // Show the user's username
  userSection.querySelector(".username").innerText = user.username;

  // Disable the Login button
  loginBtn.disabled = true;
  fragmentSection.hidden = false;

  // ========= Drag and Drop

  let fileData;

  dragDrop("#dropTarget", (files) => {
    // `files` is an Array!
    files.forEach((file) => {
      // convert the file to a Buffer that we can use!
      const reader = new FileReader();
      reader.addEventListener("load", (e) => {
        // e.target.result is an ArrayBuffer
        const arr = new Uint8Array(e.target.result);
        const buffer = new Buffer(arr);

        fileData = { buffer, file };
      });
      reader.addEventListener("error", (err) => {
        console.error("FileReader error" + err);
      });
      reader.readAsArrayBuffer(file);

      document.getElementById("dropTarget").textContent = file.name;

      let contentType = file.type;
      if (contentType === "" && file.name.includes(".md")) {
        contentType = "text/markdown";
      }

      document.getElementById("fragment-type").value = contentType;
    });
  });

  // =======================

  // Get User's fragments
  getUserFragmentsBtn.onclick = () => {
    getUserFragments(user);
  };

  // Get User's fragments expanded
  getUserFragmentsExpandedBtn.onclick = () => {
    getUserFragmentsExpanded(user);
  };

  // Get fragment data by ID
  getFragmentDataBtn.onclick = () => {
    const id = document.getElementById("fragment-id").value;
    getFragmentData(user, id);
  };

  // Get fragment metadata by ID
  getFragmentMetadataBtn.onclick = () => {
    const id = document.getElementById("fragment-id").value;
    getFragmentMetadata(user, id);
  };

  // Post the User's fragment
  addFragmentBtn.onclick = () => {
    console.log("Adding User Fragment");
    console.log("fileData", fileData);
    postUserFragment(user, fileData);
  };
}

// Wait for the DOM to be ready, then start the app
addEventListener("DOMContentLoaded", init);
