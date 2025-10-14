/* eslint-disable eqeqeq */
import $ from "jquery";

//var uri = "https://127.0.0.1:8003/mfs100/";  //Secure
// var uri = "https://127.0.0.1:8004/mfs100/"; //Non-Secure
var GetCustomDomName = "127.0.0.1";
var primaryUrl = "http://" + GetCustomDomName + ":";

// var KeyFlag = "";
// var isGetSuccess = false;

export function GetMFS100Info(onSuccess, onFailed) {
  // KeyFlag = "";
  return GetMFS100Client("info", onSuccess, onFailed);
}

// export function CaptureFinger(rdport, onSuccess, onFailed) {
//   return PostMFS100Client("capture", rdport, onSuccess, onFailed);
// }

export function CaptureFinger(rdport, onSuccess, onFailed) {
  return PostMFS100Client("capture", rdport, onSuccess, onFailed);
}

export function CaptureFingerDmt1(dynamicWadh, rdport, onSuccess, onFailed) {
  return PostMFS100ClientDmt1(
    dynamicWadh,
    "capture",
    rdport,
    onSuccess,
    onFailed
  );
}
export function CaptureFingerDmt2(rdport, onSuccess, onFailed) {
  return PostMFS100ClientDmt2("capture", rdport, onSuccess, onFailed);
}
export function CaptureFingerDmt3(rdport, onSuccess, onFailed) {
  return PostMFS100ClientDmt3("capture", rdport, onSuccess, onFailed);
}
export function CaptureFingerAeps2(rdport, onSuccess, onFailed) {
  return PostMFS100ClientAeps2("capture", rdport, onSuccess, onFailed);
}
export function CaptureFingerTest(rdport, onSuccess, onFailed) {
  return PostMFS100ClientTest("capture", rdport, onSuccess, onFailed);
}

// function PostMFS100Client(method, rdport, onSuccess, onFailed) {
//   var res;
//   var XML =
//     // '<?xml version="1.0"?> <PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0"   pidVer="2.0" timeout="10000" pTimeout="20000" wadh="TF/lfPuh1n4ZY1xizYpqikIBm+gv65r51MFNek4uwNw=" posh="UNKNOWN" env="PP" /> <CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>';
//     '<PidOptions ver="1.0"><Opts fCount="1" fType="2" format="0" pidVer="2.0" timeout="30000" otp="" posh="UNKNOWN" env="P" wadh="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc="/></PidOptions>';
//   $.support.cors = true;
//   var httpStaus = false;
//   console.log("wadh",XML);
//   $.ajax({
//     type: "CAPTURE",
//     async: onSuccess,
//     crossDomain: true,
//     //url: uri + method,
//     url: primaryUrl + rdport + "/rd/" + method,
//     //contentType: "application/json; charset=utf-8",
//     data: XML,
//     dataType: "text",
//     processData: false,
//     success: function (data) {
//       httpStaus = true;
//       res = { httpStaus: httpStaus, data: data };
//       if (onSuccess) onSuccess(res);
//     },
//     error: function (jqXHR, ajaxOptions, thrownError) {
//       // console.log(thrownError);
//       //res = { httpStaus: httpStaus, err: getHttpError(jqXHR) };
//       if (onFailed) onFailed(thrownError);
//     },
//   });
//   return res;
// }
function PostMFS100Client(method, rdport, onSuccess, onFailed) {
  var res;
  var XML =
    //   '<PidOptions ver="1.0"><Opts fCount="1" fType="2" format="0" pidVer="2.0" timeout="30000" otp="" posh="UNKNOWN" env="P" wadh="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc="/></PidOptions>';
    '<PidOptions ver="1.0"><Opts fCount="1" fType="2" format="0" pidVer="2.0" timeout="30000" otp="" posh="UNKNOWN" env="P"/></PidOptions>';

  // Log the XML to check the wadh value
  console.log("Request aeps:", XML);

  $.support.cors = true;
  var httpStaus = false;

  $.ajax({
    type: "CAPTURE",
    async: onSuccess,
    crossDomain: true,
    url: primaryUrl + rdport + "/rd/" + method,
    data: XML,
    dataType: "text",
    processData: false,
    success: function (data) {
      console.log("Request Success: ", data); // Log server response
      httpStaus = true;
      res = { httpStaus: httpStaus, data: data };
      if (onSuccess) onSuccess(res);
    },
    error: function (jqXHR, ajaxOptions, thrownError) {
      console.log("Request Error: ", thrownError); // Log the error
      if (onFailed) onFailed(thrownError);
    },
  });

  return res;
}

function PostMFS100ClientDmt1(
  dynamicWadh,
  method,
  rdport,
  onSuccess,
  onFailed
) {
  var res;
  var XML = `<PidOptions ver="1.0"><Opts fCount="1" fType="2" format="0" pidVer="2.0" timeout="30000" otp="" posh="" env="P" wadh="${dynamicWadh}"/></PidOptions>`;

  // Log the XML to check the wadh value
  console.log("Request dmt1:", XML);

  $.support.cors = true;
  var httpStaus = false;

  $.ajax({
    type: "CAPTURE",
    async: onSuccess,
    crossDomain: true,
    url: primaryUrl + rdport + "/rd/" + method,
    data: XML,
    dataType: "text",
    processData: false,
    success: function (data) {
      console.log("Request Success: ", data); // Log server response
      httpStaus = true;
      res = { httpStaus: httpStaus, data: data };
      if (onSuccess) onSuccess(res);
    },
    error: function (jqXHR, ajaxOptions, thrownError) {
      console.log("Request Error: ", thrownError); // Log the error
      if (onFailed) onFailed(thrownError);
    },
  });

  return res;
}
function PostMFS100ClientDmt2(method, rdport, onSuccess, onFailed) {
  var res;
  var XML =
    '<PidOptions ver="1.0"><Opts env="P" fCount="1" fType="2" iCount="0" format="0" pCount="0" pidVer="2.0" timeout="15000" wadh="18f4CEiXeXcfGXvgWA/blxD+w2pw7hfQPY45JMytkPw=" posh=""/></PidOptions>';
  console.log("Request XML dmt2:", XML);

  // '<PidOptions ver="1.0"><Opts fCount="1" fType="2" format="0" pidVer="2.0" timeout="30000" otp="" posh="UNKNOWN" env="P" /></PidOptions>';
  $.support.cors = true;
  var httpStaus = false;

  $.ajax({
    type: "CAPTURE",
    async: onSuccess,
    crossDomain: true,
    //url: uri + method,
    url: primaryUrl + rdport + "/rd/" + method,
    //contentType: "application/json; charset=utf-8",
    data: XML,
    dataType: "text",
    processData: false,
    success: function (data) {
      httpStaus = true;
      res = { httpStaus: httpStaus, data: data };
      if (onSuccess) onSuccess(res);
    },
    error: function (jqXHR, ajaxOptions, thrownError) {
      // console.log(thrownError);
      //res = { httpStaus: httpStaus, err: getHttpError(jqXHR) };
      if (onFailed) onFailed(thrownError);
    },
  });
  return res;
}
function PostMFS100ClientDmt3(method, rdport, onSuccess, onFailed) {
  var res;
  var XML =
    '<PidOptions ver="1.0"><Opts env="P" fCount="1" fType="2" iCount="0" format="0" pCount="0" pidVer="2.0" timeout="15000" wadh="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc=" posh=""/></PidOptions>';
  console.log("Request XML dmt2:", XML);

  // '<PidOptions ver="1.0"><Opts fCount="1" fType="2" format="0" pidVer="2.0" timeout="30000" otp="" posh="UNKNOWN" env="P" /></PidOptions>';
  $.support.cors = true;
  var httpStaus = false;

  $.ajax({
    type: "CAPTURE",
    async: onSuccess,
    crossDomain: true,
    //url: uri + method,
    url: primaryUrl + rdport + "/rd/" + method,
    //contentType: "application/json; charset=utf-8",
    data: XML,
    dataType: "text",
    processData: false,
    success: function (data) {
      httpStaus = true;
      res = { httpStaus: httpStaus, data: data };
      if (onSuccess) onSuccess(res);
    },
    error: function (jqXHR, ajaxOptions, thrownError) {
      // console.log(thrownError);
      //res = { httpStaus: httpStaus, err: getHttpError(jqXHR) };
      if (onFailed) onFailed(thrownError);
    },
  });
  return res;
}
function PostMFS100ClientAeps2(method, rdport, onSuccess, onFailed) {
  var res;
  var XML =
    '<PidOptions ver="1.0"><Opts env="P" fCount="1" fType="2" iCount="0" format="0" pCount="0" pidVer="2.0" timeout="15000" wadh="" posh="UNKNOWN" /></PidOptions>';
  console.log("XML with aeps2:", XML);

  $.support.cors = true;
  var httpStaus = false;

  $.ajax({
    type: "CAPTURE",
    async: onSuccess,
    crossDomain: true,
    //url: uri + method,
    url: primaryUrl + rdport + "/rd/" + method,
    //contentType: "application/json; charset=utf-8",
    data: XML,
    dataType: "text",
    processData: false,
    success: function (data) {
      httpStaus = true;
      res = { httpStaus: httpStaus, data: data };
      if (onSuccess) onSuccess(res);
    },
    error: function (jqXHR, ajaxOptions, thrownError) {
      // console.log(thrownError);
      //res = { httpStaus: httpStaus, err: getHttpError(jqXHR) };
      if (onFailed) onFailed(thrownError);
    },
  });
  return res;
}

// nepal transfer client test
function PostMFS100ClientTest(method, rdport, onSuccess, onFailed) {
  var res;
  var XML =
    '<?xml version="1.0"?> <PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0"   pidVer="2.0" timeout="10000" pTimeout="20000" wadh="TF/lfPuh1n4ZY1xizYpqikIBm+gv65r51MFNek4uwNw=" posh="UNKNOWN" env="P" /> <CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>';
  // '<PidOptions ver="1.0"><Opts fCount="1" fType="2" format="0" pidVer="2.0" timeout="30000" otp="" posh="UNKNOWN" env="P" /></PidOptions>';

  console.log("XML with nepal:", XML);
  $.support.cors = true;
  var httpStaus = false;

  $.ajax({
    type: "CAPTURE",
    async: onSuccess,
    crossDomain: true,
    //url: uri + method,
    url: primaryUrl + rdport + "/rd/" + method,
    //contentType: "application/json; charset=utf-8",
    data: XML,
    dataType: "text",
    processData: false,
    success: function (data) {
      httpStaus = true;
      res = { httpStaus: httpStaus, data: data };
      if (onSuccess) onSuccess(res);
    },
    error: function (jqXHR, ajaxOptions, thrownError) {
      // console.log(thrownError);
      //res = { httpStaus: httpStaus, err: getHttpError(jqXHR) };
      if (onFailed) onFailed(thrownError);
    },
  });
  return res;
}

async function GetMFS100Client(method, onSuccess, onFailed) {
  $.support.cors = true;
  new Promise((resolve, reject) => {
    var dataRes = [];
    var httpStaus = false;
    for (var i = 11100; i < 11103; i++) {
      $.ajax({
        type: "RDSERVICE",
        async: false,
        url: primaryUrl + i.toString(),
        dataType: "text",
        processData: false,
        cache: false,
        crossDomain: true,
        success: function (data) {
          dataRes.push({ httpStaus: true, data: data, port: i });
          // console.log(
          //   `GetMFS100Client => ${i} :` + JSON.stringify(data, null, 2)
          // );
        },
        error: function (jqXHR, ajaxOptions, thrownError) {
          if (i === "8005" || i === 8005) {
            i = "11099";
          }
          if ((!httpStaus && i === 11103) || (!httpStaus && i === "11103")) {
            //console.log("GetMFS100Client Error => " + thrownError);
          }
        },
      });
    }
    if (dataRes && dataRes.length > 0) {
      resolve(dataRes);
    } else {
      reject("No Driver Found");
    }
  })
    .then((result) => {
      if (onSuccess) onSuccess(result);
    })
    .catch((error) => {
      if (onFailed) onFailed(error);
    });
}

/**
 * CMPundhir ka code
 */

export async function GetMFS100InfoLoad(
  setMachineRequest,
  onSuccess,
  onFailed
) {
  setMachineRequest(true);
  GetMFS100Info(
    (res) => {
      var htmlData = "";
      var RdSer = false;
      const dataArray = [];
      for (var k in res) {
        if (res.hasOwnProperty(k)) {
          var $doc = $.parseXML(res[k].data);
          htmlData +=
            '<p><input type="radio" checked="checked" name="rdport" value="' +
            k +
            '">  ' +
            $($doc).find("RDService").attr("info") +
            " (" +
            $($doc).find("RDService").attr("status") +
            ")</p>";
          let data = {
            rdport: res[k].port,
            info: $($doc).find("RDService").attr("info"),
            status: $($doc).find("RDService").attr("status"),
          };

          if ($($doc).find("RDService").attr("status") == "READY") {
            RdSer = true;
            dataArray.push(data);
          } else if ($($doc).find("RDService").attr("status") == "NOTREADY") {
            dataArray.push(data);
          }
        }
      }
      if (dataArray && dataArray.length > 0) {
        console.log("loop finished success=> ", k);
        setMachineRequest(false);
        onSuccess(dataArray);
      } else if (dataArray.length == 0) {
        console.log("loop finished failed=> ", k);
        setMachineRequest(false);
        onSuccess(dataArray);
      }
      // else if (dataArray && dataArray.length > 0) {
      //   console.log("loop finished fail=> ", k);
      //   setMachineRequest(false);
      //   onFailed(dataArray);
      // }
    },
    (error) => {
      setMachineRequest(false);
      console.log("machine not detected");
      onFailed(error);
    }
  );
}
export function CaptureFingerPrint(rdport, onSuccess, onFailed) {
  setTimeout(function () {
    CaptureFinger(
      rdport,
      (res) => {
        if (res.httpStaus) {
          var $doc = $.parseXML(res.data);
          console.log("second data=> ", res);

          let qScoreValue = $($doc).find("PidData").find("Resp").attr("qScore");
          if (!qScoreValue || isNaN(parseInt(qScoreValue))) {
            qScoreValue = 47; // Default qScore value
          } else {
            qScoreValue = parseInt(qScoreValue);
          }

          var quality = "";
          if (qScoreValue < 41) {
            quality = "Poor";
          } else if (qScoreValue >= 41 && qScoreValue < 56) {
            quality = "Average";
          } else if (qScoreValue >= 56 && qScoreValue < 70) {
            quality = "Good";
          } else {
            quality = "Very Good";
          }

          if (qScoreValue > 0) {
            let paramSr = $($doc)
              .find("PidData")
              .find("DeviceInfo")
              .find("additional_info")
              .find("Param")[0];
            let sysId = $($doc)
              .find("PidData")
              .find("DeviceInfo")
              .find("additional_info")
              .find("Param")[1];

            let data = {
              score: qScoreValue,
              quality: quality,
              type: $($doc).find("PidData").find("Data").attr("type"),
              pidData: $($doc).find("PidData").find("Data").text(),
              cI: $($doc).find("PidData").find("Skey").attr("ci"),
              dC: $($doc).find("PidData").find("DeviceInfo").attr("dc"),
              dpId: $($doc).find("PidData").find("DeviceInfo").attr("dpId"),
              errInfo: $($doc).find("PidData").find("Resp").attr("errInfo"),
              fCount: $($doc).find("PidData").find("Resp").attr("fCount"),
              hMac: $($doc).find("PidData").find("Hmac").text(),
              mC: $($doc).find("PidData").find("DeviceInfo").attr("mc"),
              mI: $($doc).find("PidData").find("DeviceInfo").attr("mi"),
              nmPoints: $($doc).find("PidData").find("Resp").attr("nmPoints"),
              pidDataType: $($doc).find("PidData").find("Data").attr("type"),
              qScore: qScoreValue,
              rdsId: $($doc).find("PidData").find("DeviceInfo").attr("rdsId"),
              rdsVer: $($doc).find("PidData").find("DeviceInfo").attr("rdsVer"),
              sessionKey: $($doc).find("PidData").find("Skey").text(),
              srno: $(paramSr).attr("value"),
              sysId: $(sysId).attr("value"),
            };

            onSuccess("Quality: " + qScoreValue + "% " + quality, data);
          } else {
            onFailed($($doc).find("PidData").find("Resp").attr("errInfo"));
          }
        }
      },
      (err) => {
        console.log("manthra error", err);
        onFailed(err);
      }
    );
  }, 100);
}

export function CaptureFingerPrintDmt1(
  dynamicWadh,
  rdport,
  onSuccess,
  onFailed
) {
  setTimeout(function () {
    CaptureFingerDmt1(
      dynamicWadh,
      rdport,
      (res) => {
        if (res.httpStaus) {
          var $doc = $.parseXML(res.data);
          console.log("second data=> ", res);

          let qScoreValue = $($doc).find("PidData").find("Resp").attr("qScore");
          if (!qScoreValue || isNaN(parseInt(qScoreValue))) {
            qScoreValue = 47; // Default qScore value
          } else {
            qScoreValue = parseInt(qScoreValue);
          }

          var quality = "";
          if (qScoreValue < 41) {
            quality = "Poor";
          } else if (qScoreValue >= 41 && qScoreValue < 56) {
            quality = "Average";
          } else if (qScoreValue >= 56 && qScoreValue < 70) {
            quality = "Good";
          } else {
            quality = "Very Good";
          }

          if (qScoreValue > 0) {
            let paramSr = $($doc)
              .find("PidData")
              .find("DeviceInfo")
              .find("additional_info")
              .find("Param")[0];
            let sysId = $($doc)
              .find("PidData")
              .find("DeviceInfo")
              .find("additional_info")
              .find("Param")[1];

            let data = {
              score: qScoreValue,

              quality: quality,
              type: $($doc).find("PidData").find("Data").attr("type"),
              pidData: $($doc).find("PidData").find("Data").text(),
              cI: $($doc).find("PidData").find("Skey").attr("ci"),
              dC: $($doc).find("PidData").find("DeviceInfo").attr("dc"),
              dpId: $($doc).find("PidData").find("DeviceInfo").attr("dpId"),
              errInfo: $($doc).find("PidData").find("Resp").attr("errInfo"),
              fCount: $($doc).find("PidData").find("Resp").attr("fCount"),
              hMac: $($doc).find("PidData").find("Hmac").text(),
              mC: $($doc).find("PidData").find("DeviceInfo").attr("mc"),
              mI: $($doc).find("PidData").find("DeviceInfo").attr("mi"),
              nmPoints: $($doc).find("PidData").find("Resp").attr("nmPoints"),
              pidDataType: $($doc).find("PidData").find("Data").attr("type"),
              qScore: qScoreValue,
              rdsId: $($doc).find("PidData").find("DeviceInfo").attr("rdsId"),
              rdsVer: $($doc).find("PidData").find("DeviceInfo").attr("rdsVer"),
              sessionKey: $($doc).find("PidData").find("Skey").text(),
              srno: $(paramSr).attr("value"),
              sysId: $(sysId).attr("value"),
            };

            onSuccess("Quality: " + qScoreValue + "% " + quality, data);
          } else {
            onFailed($($doc).find("PidData").find("Resp").attr("errInfo"));
          }
        }
      },
      (err) => {
        console.log("manthra error", err);
        onFailed(err);
      }
    );
  }, 100);
}
export function CaptureFingerPrintDmt2(rdport, onSuccess, onFailed) {
  setTimeout(function () {
    CaptureFingerDmt2(
      rdport,
      (res) => {
        if (res.httpStaus) {
          var $doc = $.parseXML(res.data);
          console.log("second data=> ", res);

          let qScoreValue = $($doc).find("PidData").find("Resp").attr("qScore");
          if (!qScoreValue || isNaN(parseInt(qScoreValue))) {
            qScoreValue = 47; // Default qScore value
          } else {
            qScoreValue = parseInt(qScoreValue);
          }

          var quality = "";
          if (qScoreValue < 41) {
            quality = "Poor";
          } else if (qScoreValue >= 41 && qScoreValue < 56) {
            quality = "Average";
          } else if (qScoreValue >= 56 && qScoreValue < 70) {
            quality = "Good";
          } else {
            quality = "Very Good";
          }

          if (qScoreValue > 0) {
            let paramSr = $($doc)
              .find("PidData")
              .find("DeviceInfo")
              .find("additional_info")
              .find("Param")[0];
            let sysId = $($doc)
              .find("PidData")
              .find("DeviceInfo")
              .find("additional_info")
              .find("Param")[1];

            let data = {
              score: qScoreValue,
              quality: quality,
              doc: res.data,
              type: $($doc).find("PidData").find("Data").attr("type"),
              pidData: $($doc).find("PidData").find("Data").text(),
              cI: $($doc).find("PidData").find("Skey").attr("ci"),
              dC: $($doc).find("PidData").find("DeviceInfo").attr("dc"),
              dpId: $($doc).find("PidData").find("DeviceInfo").attr("dpId"),
              errInfo: $($doc).find("PidData").find("Resp").attr("errInfo"),
              fCount: $($doc).find("PidData").find("Resp").attr("fCount"),
              hMac: $($doc).find("PidData").find("Hmac").text(),
              mC: $($doc).find("PidData").find("DeviceInfo").attr("mc"),
              mI: $($doc).find("PidData").find("DeviceInfo").attr("mi"),
              nmPoints: $($doc).find("PidData").find("Resp").attr("nmPoints"),
              pidDataType: $($doc).find("PidData").find("Data").attr("type"),
              qScore: qScoreValue,
              rdsId: $($doc).find("PidData").find("DeviceInfo").attr("rdsId"),
              rdsVer: $($doc).find("PidData").find("DeviceInfo").attr("rdsVer"),
              sessionKey: $($doc).find("PidData").find("Skey").text(),
              srno: $(paramSr).attr("value"),
              sysId: $(sysId).attr("value"),
            };

            onSuccess("Quality: " + qScoreValue + "% " + quality, data);
          } else {
            onFailed($($doc).find("PidData").find("Resp").attr("errInfo"));
          }
        }
      },
      (err) => {
        console.log("manthra error", err);
        onFailed(err);
      }
    );
  }, 100);
}

export function CaptureFingerPrintDmt3(rdport, onSuccess, onFailed) {
  setTimeout(function () {
    CaptureFingerDmt3(
      rdport,
      (res) => {
        console.log("manthra response dmt3 CaptureFingerPrintDmt3");
        if (res.httpStaus) {
          var $doc = $.parseXML(res.data);
          console.log("second data=> ", res);

          let qScoreValue = $($doc).find("PidData").find("Resp").attr("qScore");
          if (!qScoreValue || isNaN(parseInt(qScoreValue))) {
            qScoreValue = 47; // Default qScore value
          } else {
            qScoreValue = parseInt(qScoreValue);
          }

          var quality = "";
          if (qScoreValue < 41) {
            quality = "Poor";
          } else if (qScoreValue >= 41 && qScoreValue < 56) {
            quality = "Average";
          } else if (qScoreValue >= 56 && qScoreValue < 70) {
            quality = "Good";
          } else {
            quality = "Very Good";
          }

          if (qScoreValue > 0) {
            let paramSr = $($doc)
              .find("PidData")
              .find("DeviceInfo")
              .find("additional_info")
              .find("Param")[0];
            let sysId = $($doc)
              .find("PidData")
              .find("DeviceInfo")
              .find("additional_info")
              .find("Param")[1];

            let data = {
              score: qScoreValue,
              quality: quality,
              type: $($doc).find("PidData").find("Data").attr("type"),
              pidData: $($doc).find("PidData").find("Data").text(),
              cI: $($doc).find("PidData").find("Skey").attr("ci"),
              dC: $($doc).find("PidData").find("DeviceInfo").attr("dc"),
              dpId: $($doc).find("PidData").find("DeviceInfo").attr("dpId"),
              errInfo: $($doc).find("PidData").find("Resp").attr("errInfo"),
              fCount: $($doc).find("PidData").find("Resp").attr("fCount"),
              hMac: $($doc).find("PidData").find("Hmac").text(),
              mC: $($doc).find("PidData").find("DeviceInfo").attr("mc"),
              mI: $($doc).find("PidData").find("DeviceInfo").attr("mi"),
              nmPoints: $($doc).find("PidData").find("Resp").attr("nmPoints"),
              pidDataType: $($doc).find("PidData").find("Data").attr("type"),
              qScore: qScoreValue,
              rdsId: $($doc).find("PidData").find("DeviceInfo").attr("rdsId"),
              rdsVer: $($doc).find("PidData").find("DeviceInfo").attr("rdsVer"),
              sessionKey: $($doc).find("PidData").find("Skey").text(),
              srno: $(paramSr).attr("value"),
              sysId: $(sysId).attr("value"),
            };

            onSuccess("Quality: " + qScoreValue + "% " + quality, data);
          } else {
            onFailed($($doc).find("PidData").find("Resp").attr("errInfo"));
          }
        }
      },
      (err) => {
        console.log("manthra error", err);
        onFailed(err);
      }
    );
  }, 100);
}
export function CaptureFingerPrintAeps2(rdport, onSuccess, onFailed) {
  setTimeout(function () {
    CaptureFingerAeps2(
      rdport,
      (res) => {
        if (res.httpStaus) {
          var $doc = $.parseXML(res.data);
          console.log("second data=> ", res);

          let qScoreValue = $($doc).find("PidData").find("Resp").attr("qScore");
          if (!qScoreValue || isNaN(parseInt(qScoreValue))) {
            qScoreValue = 47; // Default qScore value
          } else {
            qScoreValue = parseInt(qScoreValue);
          }

          var quality = "";
          if (qScoreValue < 41) {
            quality = "Poor";
          } else if (qScoreValue >= 41 && qScoreValue < 56) {
            quality = "Average";
          } else if (qScoreValue >= 56 && qScoreValue < 70) {
            quality = "Good";
          } else {
            quality = "Very Good";
          }

          if (qScoreValue > 0) {
            let paramSr = $($doc)
              .find("PidData")
              .find("DeviceInfo")
              .find("additional_info")
              .find("Param")[0];
            let sysId = $($doc)
              .find("PidData")
              .find("DeviceInfo")
              .find("additional_info")
              .find("Param")[1];

            let data = {
              score: qScoreValue,
              quality: quality,
              type: $($doc).find("PidData").find("Data").attr("type"),
              pidData: $($doc).find("PidData").find("Data").text(),
              cI: $($doc).find("PidData").find("Skey").attr("ci"),
              dC: $($doc).find("PidData").find("DeviceInfo").attr("dc"),
              dpId: $($doc).find("PidData").find("DeviceInfo").attr("dpId"),
              errInfo: $($doc).find("PidData").find("Resp").attr("errInfo"),
              fCount: $($doc).find("PidData").find("Resp").attr("fCount"),
              hMac: $($doc).find("PidData").find("Hmac").text(),
              mC: $($doc).find("PidData").find("DeviceInfo").attr("mc"),
              mI: $($doc).find("PidData").find("DeviceInfo").attr("mi"),
              nmPoints: $($doc).find("PidData").find("Resp").attr("nmPoints"),
              pidDataType: $($doc).find("PidData").find("Data").attr("type"),
              qScore: qScoreValue,
              rdsId: $($doc).find("PidData").find("DeviceInfo").attr("rdsId"),
              rdsVer: $($doc).find("PidData").find("DeviceInfo").attr("rdsVer"),
              sessionKey: $($doc).find("PidData").find("Skey").text(),
              srno: $(paramSr).attr("value"),
              sysId: $(sysId).attr("value"),
            };

            onSuccess("Quality: " + qScoreValue + "% " + quality, data);
          } else {
            onFailed($($doc).find("PidData").find("Resp").attr("errInfo"));
          }
        }
      },
      (err) => {
        console.log("manthra error", err);
        onFailed(err);
      }
    );
  }, 100);
}

export function CaptureFingerPrintTest(rdport, onSuccess, onFailed) {
  setTimeout(function () {
    CaptureFingerTest(
      rdport,
      (res) => {
        if (res.httpStaus) {
          var $doc = $.parseXML(res.data);
          console.log("second data=> ", res);

          let qScoreValue = $($doc).find("PidData").find("Resp").attr("qScore");
          if (!qScoreValue || isNaN(parseInt(qScoreValue))) {
            qScoreValue = 47; // Default qScore value
          } else {
            qScoreValue = parseInt(qScoreValue);
          }

          var quality = "";
          if (qScoreValue < 41) {
            quality = "Poor";
          } else if (qScoreValue >= 41 && qScoreValue < 56) {
            quality = "Average";
          } else if (qScoreValue >= 56 && qScoreValue < 70) {
            quality = "Good";
          } else {
            quality = "Very Good";
          }

          if (qScoreValue > 0) {
            let paramSr = $($doc)
              .find("PidData")
              .find("DeviceInfo")
              .find("additional_info")
              .find("Param")[0];
            let sysId = $($doc)
              .find("PidData")
              .find("DeviceInfo")
              .find("additional_info")
              .find("Param")[1];

            let data = {
              score: qScoreValue,
              quality: quality,
              type: $($doc).find("PidData").find("Data").attr("type"),
              pidData: $($doc).find("PidData").find("Data").text(),
              cI: $($doc).find("PidData").find("Skey").attr("ci"),
              dC: $($doc).find("PidData").find("DeviceInfo").attr("dc"),
              dpId: $($doc).find("PidData").find("DeviceInfo").attr("dpId"),
              errInfo: $($doc).find("PidData").find("Resp").attr("errInfo"),
              fCount: $($doc).find("PidData").find("Resp").attr("fCount"),
              hMac: $($doc).find("PidData").find("Hmac").text(),
              mC: $($doc).find("PidData").find("DeviceInfo").attr("mc"),
              mI: $($doc).find("PidData").find("DeviceInfo").attr("mi"),
              nmPoints: $($doc).find("PidData").find("Resp").attr("nmPoints"),
              pidDataType: $($doc).find("PidData").find("Data").attr("type"),
              qScore: qScoreValue,
              rdsId: $($doc).find("PidData").find("DeviceInfo").attr("rdsId"),
              rdsVer: $($doc).find("PidData").find("DeviceInfo").attr("rdsVer"),
              sessionKey: $($doc).find("PidData").find("Skey").text(),
              srno: $(paramSr).attr("value"),
              sysId: $(sysId).attr("value"),
            };

            onSuccess("Quality: " + qScoreValue + "% " + quality, data);
          } else {
            onFailed($($doc).find("PidData").find("Resp").attr("errInfo"));
          }
        }
      },
      (err) => {
        console.log("manthra error", err);
        onFailed(err);
      }
    );
  }, 100);
}
