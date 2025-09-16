import { Brightness2Rounded } from "@mui/icons-material";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { bgImage, Logo } from "../iconsImports";

export const Toast = Swal.mixin({
  // toast: true,
  // position: "top",
  showConfirmButton: true,
  // timer: 7000,
  timerProgressBar: false,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
  width: "max-content",
  // background: "#4caf50",
  background: "#fefefe",
  color: "#169816",
  iconColor: "#2fa92f",
  showCloseButton: true,
  allowEscapeKey: true,
  allowEnterKey: true,
});

const ToastSm = Swal.mixin({
  showClass: {
    backdrop: "swal12-noanimation",
    popup: "",
    icon: "",
  },
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
  width: "max-content",
  background: "#fefefe",
});

export const ErrorToast = Swal.mixin({
  // toast: true,
  // position: "top",
  showConfirmButton: true,
  // timer: 10000,
  timerProgressBar: false,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
  width: "max-content",
  background: "#fff",
  color: "#000",
  iconColor: "#dc5f5f",
  showCloseButton: true,
  allowEscapeKey: true,
  allowEnterKey: true,
  keydownListenerCapture: true,
  returnFocus: false,
});
const ToastAlt = Swal.mixin({
  showConfirmButton: true,
  timerProgressBar: false,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
  width: "max-content",
  background: "#e6f7ff", // slightly different from #fefefe
  color: "#0a6ebd", // slightly different from green
  iconColor: "#0288d1", // slightly different from green
  showCloseButton: true,
  allowEscapeKey: true,
  allowEnterKey: true,
});
export const MySwalAlt = withReactContent(ToastAlt);

//
const ConfirmSwal = (apiCallFunc, res) => {
  Swal.fire({
    title: "Are you sure you want to add this below Account",
    // text: "",
    html: res,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Confirm",
    allowEscapeKey: false,
    allowEnterKey: true,
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      apiCallFunc();
    }
  });
};
const confirmSettlement = (apiCallFunc, res) => {
  Swal.fire({
    title: "Are you sure you want to add this settlement Account",
    // text: "",
    html: res,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Confirm",
    allowEscapeKey: false,
    allowEnterKey: true,
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      apiCallFunc(res);
    }
  });
};

export const confirmButtonSwal = (apiCallFunc, res) => {
  ConfirmSwal(apiCallFunc, res);
};
export const confirmButtonSwalSettlement = (apiCallFunc, res) => {
  confirmSettlement(apiCallFunc, res);
};

export const NormalToast = Swal.mixin({
  confirmButtonColor: "#3578EA",
});
export const MySwal = withReactContent(Toast);
export const ErrorSwal = withReactContent(ErrorToast);

// small error toast
export const errorNotiToast = Swal.mixin({
  toast: true,
  position: "top-end",
  width: "26em",
  iconHtml: "⚠️",
  iconColor: "#FFEB3B",
  background: "#F0F8FF",
  // color: "#72A0C1",
  confirmButtonText: "View",
  showConfirmButton: true,
  showCancelButton: true,
  cancelButtonText: "Dismiss",
  allowOutsideClick: false,
  allowEscapeKey: false,
  allowEnterKey: false,

  // Custom classes for styling
  customClass: {
    icon: "custom-toast-icon",
    title: "custom-toast-title",
    content: "custom-toast-content",
    confirmButton: "custom-toast-button",
    cancelButton: "custom-toast-cancel-button",
  },

  // didOpen: (toast) => {
  //   toast.addEventListener("mouseenter", Swal.stopTimer);
  //   toast.addEventListener("mouseleave", Swal.resumeTimer);
  //   toast.classList.add('fade-in');
  // },
});

// type = 'success' | 'error' | 'warning' | 'info' | 'question'
export const okToast = (title, msg, type) => {
  MySwal.fire(title, msg, type);
};

export const okErrorToast = (title, msg) => {
  try {
    document.activeElement.blur();
  } catch (e) {}
  // ErrorToast.fire(title, msg, "error");
  setTimeout(() => {
    ErrorSwal.fire({
      title: title,
      text: msg ? msg : "Error can't be identified",
      icon: "error", // 'success' | 'error' | 'warning' | 'info' | 'question'
      showCancelButton: false,
      confirmButtonText: "OK",
      showConfirmButton: true,
      keydownListenerCapture: true,
      focusConfirm: true,
      inputAutoFocus: true,
      // preConfirm: () => {},
      // allowOutsideClick: () => !Swal.isLoading(),
      // backdrop: true,
    });
  }, 200);
};

export const apiErrorToast = (error, history) => {
  let msg = "Something went wrong";
  let status =
    error && error.response && error.response.status && error.response.status;

  if (error) {
    if (error.data) {
      error.response = error; // normalize
    }

    if (error.response) {
      status = error.response.status;

      if (error.response.data) {
        const data = error.response.data;

        // ✅ Handle "message" field
        if (data.message) {
          if (typeof data.message === "string") {
            msg = data.message;
          } else if (typeof data.message === "object") {
            msg = Object.values(data.message).flat().join("\n");
          }
        }
        // ✅ Handle "detail" field
        else if (data.detail) {
          if (typeof data.detail === "string") {
            msg = data.detail;
          } else if (typeof data.detail === "object") {
            msg = Object.values(data.detail).flat().join("\n");
          }
        }
        // ✅ Handle raw object response
        else if (typeof data === "object") {
          msg = Object.values(data).flat().join("\n");
        } else {
          msg = data;
        }
      } else {
        msg = "Something went wrong, Please try after sometime";
      }
    } else {
      if (error.message) {
        msg = error.message;
      } else if (typeof error === "object") {
        msg = Object.values(error).flat().join("\n");
      } else {
        msg = error;
      }
    }
  }

  // 🔑 Handle different statuses
  if (status === 401) {
    ErrorSwal.fire({
      title: history ? "Login Required!!" : "Error!",
      text: msg,
      icon: "error",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Login",
      showCancelButton: false,
      showConfirmButton: history,
      showLoaderOnConfirm: history,
      keydownListenerCapture: true,
      allowOutsideClick: () => !Swal.isLoading(),
    }).then(() => {
      localStorage.clear();
      const location = window.location;
      let baseUrl = location.protocol + "//" + location.host;
      window.open(baseUrl, "_self");
    });
  } else if (status === 500) {
    okErrorToast("", "Something Went wrong");
  } else if (status === 404 || status === 406) {
    okErrorToast("", msg ? msg : "Something Went wrong");
  } else {
    okErrorToast("", msg);
  }

  return msg;
};

export const okSuccessToast = (title, msg) => {
  Toast.fire(title, msg, "success");
};

export const showCopyDialog = (title, data) => {
  MySwal.fire({
    title: title,
    text: data,
    icon: "success", // 'success' | 'error' | 'warning' | 'info' | 'question'
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Copy",
    showLoaderOnConfirm: true,
    allowEscapeKey: true,
    allowEnterKey: true,
    preConfirm: () => {},
    allowOutsideClick: () => !Swal.isLoading(),
    backdrop: true,
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: `${title} copied successfully`,
      });
    }
  });
};

export const toastWithTimer = (
  msg,
  timer,
  title = "Details Updated Successfully.",
  apiCallFunc
) => {
  let timerInterval;
  Swal.fire({
    title: `<div class="success-color">${title}</div>`,
    // html: "I will close in <b></b> milliseconds.",
    html: msg,
    timer: timer,
    timerProgressBar: true,
    allowEscapeKey: false,
    allowOutsideClick: false,
    allowEnterKey: true,

    didOpen: () => {
      // const content = Swal.getHtmlContainer();
      // const $ = content.querySelector.bind(content);
      Swal.showLoading();
      const b = Swal.getHtmlContainer().querySelector("strong");
      timerInterval = setInterval(() => {
        b.textContent = (Swal.getTimerLeft() / 1000).toFixed(0);
      }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    },
  }).then((result) => {
    /* Read more about handling dismissals below */
    if (result.isDismissed) {
      apiCallFunc();
    }
  });
};
export const toastInvoicePopup = (msg, timer) => {
  let timerInterval;
  Swal.fire({
    title: '<div class="green-color">Please LogIn/SignUp to view Invoice</div>',
    // html: "I will close in <b></b> milliseconds.",
    html: msg,
    timer: timer,
    timerProgressBar: true,
    allowEscapeKey: false,
    allowOutsideClick: false,
    allowEnterKey: true,
    didOpen: () => {
      // const content = Swal.getHtmlContainer();
      // const $ = content.querySelector.bind(content);
      Swal.showLoading();
      const b = Swal.getHtmlContainer().querySelector("strong");
      timerInterval = setInterval(() => {
        b.textContent = (Swal.getTimerLeft() / 1000).toFixed(0) + " seconds";
      }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    },
  }).then((result) => {
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
    }
  });
};

// small toast
export const okSuccessToastsm = (title, msg) => {
  ToastSm.fire(title, msg, "success");
};
export const okSuccessToastAlt = (txnDetails) => {
  MySwalAlt.fire({
    title: "",
    html: `
      <div style="text-align: center; padding: 0px; position: relative;">
        
        <!-- Logo at top-left corner -->
        <img 
          src="${Logo}" 
          alt="logo"
          style="
            position: absolute;
            top: -10px;
            left: -20px;
            height: 30px;
            width: auto;
          "
        />

        <!-- Success Icon with Full Left/Right Confetti -->
        <div style="
          position: relative;
          width: 100%;
          height: 140px;
          margin: 0 auto 15px auto;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <!-- Left Confetti -->
          <img 
            src="${bgImage}" 
            alt="confetti left"
            style="
              position: absolute;
              left: 0;
              top: 0;
              height: 100%;
              width: 45%;
              object-fit: cover;
            "
          />
          <!-- Right Confetti -->
          <img 
            src="${bgImage}" 
            alt="confetti right"
            style="
              position: absolute;
              right: 0;
              top: 0;
              height: 100%;
              width: 45%;
              object-fit: cover;
            "
          />
          <!-- Tick Icon in Circle -->
          <div style="
            width: 90px;
            height: 90px;
            border-radius: 50%;
            background-color: #eaf9f0;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1;
          ">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/845/845646.png" 
              width="50" 
              height="50" 
              alt="success"
            />
          </div>
        </div>

        <!-- Transaction ID -->
        <div style="font-size: 15px; font-weight: 600; color: #333;">
          <span style="color: #169816">${txnDetails.txnID}</span>
        </div>
        <div style="font-size: 15px; margin-bottom: 10px; color: #555;">
          Congratulations! Your transaction was completed successfully.
        </div>

        <!-- Hidden Receipt Content for Printing -->
        <div id="receipt-content" style="display:none;">
          <div style="text-align:left;padding:10px;border:1px dashed #ddd;border-radius:8px;background:#fafafa;max-width:280px;margin:0 auto;">
            <h3 style="text-align:center;margin-bottom:10px;color:#169816;">Transaction Receipt</h3>
            <p><b>Txn ID:</b> ${txnDetails.txnID}</p>
            <p><b>Name:</b> ${txnDetails.beneficiary.name}</p>
            <p><b>Account:</b> ${txnDetails.beneficiary.account}</p>
            <p><b>Bank:</b> ${txnDetails.beneficiary.bank}</p>
            <p><b>IFSC:</b> ${txnDetails.beneficiary.ifsc}</p>
            <p><b>Amount:</b> ₹${txnDetails.amount}</p>
            <p><b>Mode:</b> ${txnDetails.transferMode}</p>
            <p><b>Date:</b> ${txnDetails.date}</p>
          </div>
        </div>

        <!-- Print Button -->
        <button id="print-receipt" style="
          background-color: #ff7f27;
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 24px;
          font-weight: bold;
          margin-top: 25px;
          cursor: pointer;
          font-size: 15px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        ">
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
      document.getElementById("print-receipt").addEventListener("click", () => {
        const printContents =
          document.getElementById("receipt-content").innerHTML;
        const newWindow = window.open("", "", "width=600,height=400");
        newWindow.document.write(`
          <html>
            <head>
              <title>Transaction Receipt</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                p { margin: 4px 0; font-size: 14px; }
                h3 { text-align: center; color: #169816; margin-bottom: 10px; }
                div { border: 1px dashed #ddd; padding: 10px; border-radius: 8px; background: #fafafa; }
              </style>
            </head>
            <body>${printContents}</body>
          </html>
        `);
        newWindow.document.close();
        newWindow.print();
      });

      triggerConfetti();
    },
  });
};
