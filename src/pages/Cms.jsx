import React, { useContext, useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { apiCall } from "../api/apiClient";
import ApiEndpoints from "../api/ApiEndpoints";
import { apiErrorToast } from "../utils/ToastUtil";
import AuthContext from "../contexts/AuthContext";

const Cms = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const { location } = useContext(AuthContext);

  useEffect(() => {
    const createOrderAndLaunchSDK = async () => {
      try {
        // 1️⃣ Payload (No mobile, no amount)
        const payload = {
          latitude: location?.lat || "",
          longitude: location?.long || "",
          pf: "WEB",
        };

        // 2️⃣ Call API
        const { error, response } = await apiCall(
          "post",
          ApiEndpoints.CREATE_ORDER_CMS_NEW,
          payload
        );

        // 3️⃣ Handle success & error
        if (response) {
          const requestData = response?.data?.requestData;
          const skey = requestData?.superMerchantSkey?.substring(0, 32);

          // 4️⃣ Encrypt the requestData
          let parsedBase64Key = CryptoJS.enc.Base64.parse(skey);
          const encrypted = CryptoJS.AES.encrypt(
            JSON.stringify(requestData),
            parsedBase64Key,
            {
              mode: CryptoJS.mode.ECB,
              padding: CryptoJS.pad.Pkcs7,
            }
          );

          const encryptedString = btoa(encrypted);

          // 5️⃣ Construct SDK URL
          if (encryptedString) {
            setUrl(
              `https://fpuat.tapits.in/UberCMSBC/#/login?data=${encodeURIComponent(
                encryptedString
              )}&skey=${skey}`
            );
          }
        } else {
          apiErrorToast(response?.message || "Failed to create order");
        }
      } catch (err) {
        console.error("Error:", err);
        apiErrorToast("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    createOrderAndLaunchSDK();
  }, [location]);

  return (
    <div style={{ padding: "20px" }}>
      {loading ? (
        <p>Launching SDK...</p>
      ) : url ? (
        <iframe
          src={url}
          title="SDK Frame"
          style={{
            width: "100%",
            height: "600px",
            border: "none",
            marginTop: "20px",
          }}
        ></iframe>
      ) : (
        <p>Failed to load SDK</p>
      )}
    </div>
  );
};

export default Cms;
