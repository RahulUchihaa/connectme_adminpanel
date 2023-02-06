import axios from "axios";

const URL = "http://3.7.26.208/api/";

// const URL = "http://192.168.2.119:8000/api/";

const fetchCredentials = async () => {
  try {
    const credentials = await localStorage.getItem("token");
    if (credentials) {
      return {
        headers: {
          Authorization: `Bearer ${credentials}`,
        },
      };
    } else {
      console.log("No credentials stored");
    }
  } catch (error) {
    console.log("Keychain couldn't be accessed!", error);
  }
  return false;
};

// For login user
export const handelLogin = async (request) => {
  try {
    const response = await axios.post(URL + "auth/login", request);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const fetchRoles = async () => {
  try {
    const config = await fetchCredentials();
    const response = await axios.get(URL + "admin/roles", config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleAddRole = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.post(URL + "admin/roles", request, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleDeleteRole = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.delete(URL + `admin/roles/${request}`, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const fetchParentLookup = async () => {
  try {
    const config = await fetchCredentials();
    const response = await axios.get(URL + `admin/lookups`, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleAddparentLookup = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.post(URL + "admin/lookups", request, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleDeleteLookup = async (request) => {
  try {
    const config = await fetchCredentials();

    const response = await axios.delete(
      URL + `admin/lookups/${request}`,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const fetchChildLookup = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.get(
      URL + `admin/fetchlookup?lookup_type=${request}`,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const fetchUsers = async () => {
  try {
    const config = await fetchCredentials();
    const response = await axios.get(URL + "admin/fetchuser", config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleUserstatus = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.post(
      URL + "admin/updateuserstatus",
      request,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleAdduser = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.post(URL + "admin/saveuser", request, config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const fetchOrganisations = async () => {
  try {
    const config = await fetchCredentials();
    const response = await axios.get(URL + "admin/all_org", config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleOrganisationstatus = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.post(
      URL + "admin/org_status",
      request,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleAddOrganisation = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.post(
      URL + "admin/saveorganisation",
      request,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const fetchPosts = async () => {
  try {
    const config = await fetchCredentials();
    const response = await axios.get(URL + "admin/all_posts", config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleDeletePosts = async (request) => {
  try {
    const config = await fetchCredentials();

    const response = await axios.delete(
      URL + `admin/posts/${request.id}`,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const fetchOffers = async () => {
  try {
    const config = await fetchCredentials();
    const response = await axios.get(URL + "admin/all_offers", config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleDeleteOffers = async (request) => {
  try {
    const config = await fetchCredentials();

    const response = await axios.delete(
      URL + `admin/offers/${request}`,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const fetchVlogs = async () => {
  try {
    const config = await fetchCredentials();
    const response = await axios.get(URL + "admin/all_vlogs", config);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleDeleteVlog = async (request) => {
  try {
    const config = await fetchCredentials();

    const response = await axios.delete(
      URL + `admin/vlogs/${request.id}`,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handleVlogStatus = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.post(
      URL + "admin/update_status",
      request,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const handlePostStatus = async (request) => {
  try {
    const config = await fetchCredentials();
    const response = await axios.post(
      URL + "admin/post_status",
      request,
      config
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export const fetchDashboardata = async () => {
  try {
    const config = await fetchCredentials();
    const response = await axios.get(URL + "admin/dashboard_data", config);
    return response;
  } catch (error) {
    return error.response;
  }
};
