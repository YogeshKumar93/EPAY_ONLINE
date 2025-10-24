// Function to check if geolocation is supported
function checkLocationPermission() {
  return "geolocation" in navigator;
}

// Function to attempt IP-based geolocation (last fallback)
function getLocationByIP(onSuccess, onFailed) {
  fetch("https://ipinfo.io/json?token=02887545e3da1b") // replace with env token
    .then((response) => response.json())
    .then((data) => {
      if (data.loc) {
        const [latitude, longitude] = data.loc.split(",");
        console.log("🌍 IP-based location fetched:", latitude, longitude);
        onSuccess(parseFloat(latitude), parseFloat(longitude));
      } else {
        throw new Error("No location in IP response");
      }
    })
    .catch((error) => {
      console.error("❌ IP-based geolocation failed:", error);
      onFailed("IP-based location retrieval failed.");
    });
}

// Function to get location (GPS → WiFi → IP)
function getLatLong(onSuccess, onFailed) {
  let locationFetched = false;

  if (checkLocationPermission()) {
    // First attempt with GPS / high accuracy
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (pos.coords.accuracy < 200) {
          console.log("📡 GPS location fetched:", pos.coords);
          onSuccess(pos.coords.latitude, pos.coords.longitude);
          locationFetched = true;
        } else {
          console.log("⚠️ Low GPS accuracy; trying Wi-Fi...");
          getLatLongWiFi(onSuccess, onFailed, () => (locationFetched = true));
        }
      },
      (error) => {
        console.warn("GPS Error:", error.code);
        if (error.code === error.PERMISSION_DENIED) {
          onFailed("Permission denied by the user.");
        } else {
          console.log("GPS failed; trying Wi-Fi...");
          getLatLongWiFi(onSuccess, onFailed, () => (locationFetched = true));
        }
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  } else {
    onFailed("Geolocation not supported by this browser.");
  }
}

// Function to get location with Wi-Fi accuracy
function getLatLongWiFi(onSuccess, onFailed, markFetched) {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      console.log("📶 Wi-Fi location fetched:", pos.coords);
      onSuccess(pos.coords.latitude, pos.coords.longitude);
      markFetched();
    },
    (error) => {
      console.warn("Wi-Fi Error:", error.code);
      console.log("👉 Falling back to IP-based location...");
      getLocationByIP(onSuccess, onFailed);
    },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
  );
}

// Exported cached geo fetcher
export const getGeoLocation = (onSuccess, onFailed) => {
  let lat, long;
  let locationFetchedAt = null;

  const now = Date.now();

  if (
    !lat ||
    !long ||
    !locationFetchedAt ||
    now - locationFetchedAt > 5 * 60 * 1000
  ) {
    console.log("🔄 Fetching fresh location...");
    getLatLong(
      (latX, longX) => {
        lat = latX;
        long = longX;
        locationFetchedAt = now;
        console.log("✅ Location fetched:", lat, long);
        onSuccess(lat, long);
      },
      (err) => {
        console.error("❌ Location error:", err);
        onFailed(err);
      }
    );
  } else {
    console.log("♻️ Using cached location:", lat, long);
    onSuccess(lat, long);
  }
};
