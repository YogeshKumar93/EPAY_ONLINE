import axios from "axios";
import { get } from "../network/ApiController";
import { BASE_URL } from "../network/ApiEndPoints";

const locaDataBase = {
    // "v1/platformusername/": {
    //   "test@gmail.com": 1,
    // },
};

export const eventListener = (onLoadComplete) => {
  let myInterval = setInterval(checkId, 1000);
  function checkId() {
    if (isNotPending()) {
      if (onLoadComplete) onLoadComplete();
      clearInterval(myInterval);
      myInterval = 0;
    }
  }
};
export const isNotPending = () => {
  let flag = true;
  Object.keys(locaDataBase).some((k) => {
    // // console.log(`${k} =>`);
    Object.keys(locaDataBase[k]).some((k2) => {
      // // console.log(`    => ${k2} => ${locaDataBase[k][k2]}`);
      if (locaDataBase[k][k2] === "pending") {
        flag = false;
        return !flag;
      }
    });
    return !flag;
  });
  return flag;
};

export const getId = (
  apiEnd,
  search,
  key,
  onDone,
  onError,
  query,
  onListDone
) => {
  // console.log("localdb", locaDataBase);
  // console.log("getId call");
  if (!locaDataBase[apiEnd]) {
    locaDataBase[apiEnd] = {};
  }
  let id = locaDataBase[apiEnd][search];
  if (!id) {
    // console.log("api call");
    locaDataBase[apiEnd][search] = "pending";
    get(
      apiEnd,
      query ? query : `${key}=${search}`,
      null,
      (res) => {
        console.log("res=>", res);
        if (onListDone) {
          onListDone(res?.data?.data);
          locaDataBase[apiEnd][search + "_list"] = res?.data?.data;
        }
        const id = res?.data.data[0]?.id;
        if (id) {
          locaDataBase[apiEnd][search] = id;
          if (onDone) onDone(id);
        } else if (!id) {
          locaDataBase[apiEnd][search] = "ERROR_NOT_FOUND";
          if (onError) onError("NOT FOUND");
        }
      },
      (err) => {
        locaDataBase[apiEnd][search] = `ERROR_${err?.response?.message}`;
        if (onError) onError(err);
      }
    );
  } else if (id === "pending") {
    // console.log("pending");
    // console.log(`${apiEnd}, search= ${search} : Pending`);
    // already requested
    let myInterval = setInterval(checkId, 1000);
    function checkId() {
      let id = locaDataBase[apiEnd][search];

      // console.log(`CheckId => ${apiEnd}, search= ${search} : ${id}`);

      if (id !== "pending") {
        if (onDone) onDone(id);
        let list = locaDataBase[apiEnd][search + "_list"];
        if (list) {
          if (onListDone) onListDone(list);
        }
        clearInterval(myInterval);
        myInterval = 0;
      } else if (id.startsWith("ERROR_")) {
        if (onError) onError(id.replace("ERROR_", ""));
      }
    }
  } else if (typeof id === "string" && id.startsWith("ERROR_")) {
    // console.log("Error");

    if (onError) onError(id.replace("ERROR_", ""));
  } else if (onDone) {
    onDone(id);
    let list = locaDataBase[apiEnd][search + "_list"];
    // console.log("onDone call,", list);
    if (list) {
      if (onListDone) onListDone(list);
    }
  }
  // return id;
};

export const customFetch = axios.create({
  baseURL: BASE_URL,
});

customFetch.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});
