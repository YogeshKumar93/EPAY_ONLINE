// components/common/ShowSuccessToast.js
import Swal from "sweetalert2";
import Logo from "../../assets/logo.png";
import { bgImage } from "../../iconsImports";

const triggerConfetti = () => {
  console.log("Confetti animation triggered!");
};

export const showSuccessToast = ({ txnID, message, redirectUrl }) => {
  Swal.fire({
    title: "",
    html: `
      <div style="text-align: center; padding: 0px; position: relative;">
        <img 
          src="${Logo}" 
          alt="logo"
          style="position: absolute; top: -10px; left: -20px; height: 30px; width: auto;"
        />
        <div style="position: relative; width: 100%; height: 140px; margin: 0 auto 15px auto; display: flex; align-items: center; justify-content: center;">
          <img src="${bgImage}" alt="confetti left" style="position: absolute; left: 0; top: 0; height: 100%; width: 45%; object-fit: cover;" />
          <img src="${bgImage}" alt="confetti right" style="position: absolute; right: 0; top: 0; height: 100%; width: 45%; object-fit: cover;" />
          <div style="width: 90px; height: 90px; border-radius: 50%; background-color: #eaf9f0; display: flex; align-items: center; justify-content: center; z-index: 1;">
            <img src="https://cdn-icons-png.flaticon.com/512/845/845646.png" width="50" height="50" alt="success"/>
          </div>
        </div>
        <div style="font-size: 15px; font-weight: 600; color: #333; margin-bottom: 6px;">
          <span style="color: #169816">${txnID || ""}</span>
        </div>
        <div style="font-size: 15px; margin-bottom: 10px; color: #555;">
          ${
            message ||
            "Congratulations! Your transaction was completed successfully."
          }
        </div>  
        <button id="print-receipt" style="background-color: #ff7f27; color: white; border: none; padding: 10px 24px; border-radius: 24px; font-weight: bold; margin-top: 25px; cursor: pointer; font-size: 15px; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
          Print Receipt
        </button>
      </div>
    `,
    showConfirmButton: false,
    showCloseButton: true,
    background: "#fff",
    customClass: {
      popup: "swal2-border-radius",
      closeButton: "custom-close-btn",
    },
    didOpen: () => {
      const btn = document.getElementById("print-receipt");
      if (btn) {
        btn.addEventListener("click", () => {
          if (redirectUrl) {
            window.open(redirectUrl, "_blank"); // ✅ open dynamic URL
          } else {
            window.open("/print-dmt", "_blank"); // fallback
          }
        });
      }
      triggerConfetti();
    },
  });
};
