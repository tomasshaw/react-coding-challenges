import config from "../config";
const { api } = config;

export const authenticateQuery = async () => {
  if (!localStorage.getItem("token")) {
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(api.clientId + ":" + api.clientSecret).toString("base64"),
      },
      body: "grant_type=client_credentials",
    });
    res.json().then((data) => {
      localStorage.setItem("token", data.access_token);
    });
  }
};

const refreshToken = async () => {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(api.clientId + ":" + api.clientSecret).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });
  res.json().then((data) => {
    localStorage.setItem("token", data.access_token);
  });
};

const spotifyGetQueryWrapper = async (query) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      await authenticateQuery();
    }
    const response = await fetch(`https://api.spotify.com/v1/browse/${query}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then((res) => {
      if (res.status === 401) {
        throw new Error("Unauthorized");
      }
      return res.json();
    });
    return response;
  } catch (err) {
    if (err.message === "Unauthorized") {
      refreshToken();
    }
    console.log(err);
  }
};

export const getNewReleases = async () =>
  await spotifyGetQueryWrapper("new-releases").then(
    (data) => data?.albums?.items
  );

export const getFeaturedPlaylists = () =>
  spotifyGetQueryWrapper("featured-playlists").then(
    (data) => data?.playlists?.items
  );

export const getCategories = () =>
  spotifyGetQueryWrapper("categories").then((data) => data?.categories?.items);
