// import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

export const json2Csv = (fileName, data) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  // console.log(worksheet);
  //   const csv = XLSX.utils.sheet_to_csv(worksheet);
  //console.log(csv);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const writingOptions = {
    bookType: "csv",
  };
  XLSX.writeFile(workbook, `${fileName}.csv`, writingOptions);
};

export const json2Pdf = (fileName, data) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  console.log(worksheet);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  //   const writingOptions = {
  //     bookType: "html",
  //   };
  //   const html = XLSX.utils.sheet_to_txt(worksheet);
  //   const doc = new jsPDF();
  //   doc.text(data, 10, 10);
  //   doc.save("html_test.pdf");
  //XLSX.writeFile(workbook, `${fileName}.pdf`);
};

export const json2Excel = (fileName, data) => {
  if (data && Array.isArray(data)) {
    for (let i in data) {
      const obj = data[i];
      if (obj) {
        for (let k in obj) {
          if (!isNaN(obj[k])) {
            obj[k] = parseFloat(obj[k]);
          }
        }
      }
    }
  }
  const worksheet = XLSX.utils.json_to_sheet(data);
  //console.log(worksheet);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

// file read . . . .
const readFileToJsonPromise = (e) => {
  return new Promise((resolve, reject) => {
    var data = new Uint8Array(e.target.result);
    var workbook = XLSX.read(data, { type: "array" });
    console.log("workbook", workbook);
    const wsname = workbook.SheetNames[0];
    console.log("worksheet name", wsname);
    const ws = workbook.Sheets[wsname];
    console.log("worksheet", ws);
    /* Convert array of arrays */
    const jsonData = XLSX.utils.sheet_to_json(ws);
    /* Update state */
    console.log("Data>>>", jsonData);
    //setData(jsonData);
    /* DO SOMETHING WITH workbook HERE */
    //okSuccessToast("File Imported successfully");
    // setLoading(false);
    resolve(
      jsonData
    ); /* return result here or you can use reject for execute catch block*/
  });
};

export const excel2Json = (excelFile, setLoading) => {
  if (excelFile) {
    if (setLoading) setLoading(true);
    var reader = new FileReader();
    reader.onload = function (e) {
      Promise.resolve(readFileToJsonPromise(e))
        .then(
          (result) => {
            // /your result come here/;
            if (setLoading) setLoading(false);
            console.log("Progress finished=>", result);
            alert(result);
          },
          (error) => {
            if (setLoading) setLoading(false);
            console.log(error);
          }
        )
        .catch(console.log("abc"));
    };
    reader.readAsArrayBuffer(excelFile);
  }
};

export const generatePdf = (jsonData) => {
  const doc = new jsPDF();

  // add text to PDF
  doc.text(`Hello ${jsonData.name}`, 10, 10);

  doc.save("my-document.pdf");
};
