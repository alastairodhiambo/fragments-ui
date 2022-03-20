// fragments microservice API
const apiUrl = process.env.API_URL;

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user, expand = false) {
  let expandedRoute = "";

  if (expand) {
    console.log("Requesting user fragments expanded data...");
    expandedRoute = `?expand=1`;
  } else {
    console.log("Requesting user fragments data...");
  }

  try {
    const res = await fetch(`${apiUrl}/v1/fragments${expandedRoute}`, {
      headers: {
        // Include the user's ID Token in the request so we're authorized
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Got user fragments data", { data });
  } catch (err) {
    console.error("Unable to call GET /v1/fragment", { err });
  }
}

// Get `${apiUrl}/v1/fragments/:id`
export async function getFragmentData(user, id) {
  console.log("Requesting fragment data by ID...");

  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      headers: {
        // Include the user's ID Token in the request so we're authorized
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    const data = await res.text();
    console.log(data);
  } catch (err) {
    console.error("Unable to call GET /v1/fragments/:id", { err });
  }
}

// Get `${apiUrl}/v1/fragments/:id/info`
export async function getFragmentMetadata(user, id) {
  console.log("Requesting fragment metadata by ID...");
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}/info`, {
      headers: {
        // Include the user's ID Token in the request so we're authorized
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Got fragment metadata by ID", { data });
  } catch (err) {
    console.error("Unable to call GET /v1/fragments/:id/info", { err });
  }
}

// POST fragment
export async function postUserFragment(user, fileData) {
  const contentType = document.getElementById("fragment-type").value;

  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      method: "POST",
      headers: {
        // Include the user's ID Token in the request so we're authorized
        Authorization: `Bearer ${user.idToken}`,
        "Content-Type": contentType,
      },
      body: fileData.buffer,
    });

    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error("Unable to call POST /v1/fragment");
  }
}
