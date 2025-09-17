import React from "react";
import QRCode from "react-qr-code";

export default function QRLogin({ string }) {
 

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
      <div style={{ background: "#fff", padding: 20, borderRadius: 12 }}>
        <QRCode
          value={string}
          size={220} // QR ka size (px)
          level="H" // Error correction (H = highest)
          bgColor="#ffffff"
          fgColor="#000000"
        />
        <p style={{ marginTop: 12, textAlign: "center" }}>
          Scan this QR to get the string
        </p>
      </div>
    </div>
  );
}
