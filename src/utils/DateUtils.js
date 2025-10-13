var options = {
  hour: "numeric",
  hour12: false,
  minute: "numeric",
  //   weekday: "long",
  //   year: "numeric",
  month: "short",
  day: "numeric",
  second: "numeric",
};

var options2 = {
  month: "short",
  day: "numeric",
};

export const rawDate = () => {
  const date = new Date();
  return date;
};
export const dateToday = () => {
  let dateToday = new Date();
  let date = dateToday.getDate();
  let month = dateToday.getMonth() + 1;
  let year = dateToday.getFullYear();
  let separator = "-";
  let txnDate = `${year}${separator}${
    month < 10 ? `0${month}` : `${month}`
  }${separator}${date}`;
  return txnDate;
  // console.log("date today=>", txnDate)
};

export const myDate = (dateObj) => {
  return new Date(dateObj).toLocaleDateString("en-US", options);
};

export const myDate2 = (dateObj) => {
  return new Date(dateObj)
    .toLocaleDateString("en-US", options2)
    .replace("/", "_")
    .replace(" ", "_")
    .replace(",", "_");
};

export const myDate7 = (dateObj) => {
  return new Date(dateObj).toLocaleDateString("en-US", options2);
};

export const myDate4 = (dateObj) => {
  if (dateObj) {
    const d = new Date(dateObj);
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  } else {
    return "";
  }
};

export const myDateDDMMyy = (dateObj) => {
  if (dateObj) {
    const d = new Date(dateObj);
    return d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
  } else {
    return "";
  }
};

export const myDate3 = (dateObj) => {
  return new Date(new Date(dateObj));
};

export const myDate5 = (dateObj) => {
  const d = new Date(dateObj);
  return d.getDate() + "/" + (d.getMonth() + 1);
};

export const changeDateFormatTo = (date) => {
  const [yy, mm, dd] = date.split(/-/g);
  return `${dd}/${mm}/${yy}`;
};

export const dateToFrom = (date = []) => {
  if (date.length > 0) {
    let d = [];
    for (let i = 0; i < date.length; i++) {
      d[i] = new Date(date[0]);
    }
    return (
      d[0].getFullYear() +
      "-" +
      (d[0].getMonth() + 1) +
      "-" +
      d[0].getDate() +
      "_" +
      d[0].getFullYear() +
      "-" +
      (d[0].getMonth() + 1) +
      "-" +
      d[0].getDate()
    );
  } else {
    return "";
  }
};
export const datemonthYear = (dateObj) => {
  const date = new Date(dateObj);
  const dateTime =
    date
      .toLocaleDateString("en-US", options2)
      .replace("/", " ")
      .replace(" ", " ")
      .replace(",", " ") +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds();
  return dateTime;
};
export const datemonthYear1 = (dateObj) => {
  const date = new Date(dateObj);
  const dateTime =
    date
      .toLocaleDateString("en-US", options2)
      .replace("/", " ")
      .replace(" ", " ")
      .replace(",", " ") +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes();

  return dateTime;
};
export const ddmmyyyy = (dateObj) => {
  const d = new Date(dateObj);
  return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
};
export const ddmmyy = (dateObj) => {
  const d = new Date(dateObj);

  // Get the day, month, and year
  const day = String(d.getDate()).padStart(2, "0"); // Pad day with leading zero if needed
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Pad month with leading zero if needed
  const year = String(d.getFullYear()).slice(-2); // Get last two digits of the year

  // Return the formatted date
  return `${day}/${month}/${year}`;
};
export const ddmmyyWithTime = (dateObj) => {
  const d = new Date(dateObj);

  // Get the day, month, and year
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);

  // Get hours, minutes, and seconds
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  // Return date and time
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

export const yyyymdd = (dateObj) => {
  const d = new Date(dateObj);
  return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
};

const _MS_PER_DAY = 1000 * 60 * 60 * 24;
export const dateDifference = (a1, b1) => {
  var a = new Date(a1);
  var b = new Date(b1);

  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
};

export const yyyymmdd = (date) => {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

export const myDateDDMMTT = (dateObj) => {
  if (dateObj) {
    const d = new Date(dateObj);
    return (
      d.getDate() +
      "-" +
      (d.getMonth() + 1) +
      " " +
      d.getHours() +
      ":" +
      d.getMinutes() +
      ":" +
      d.getSeconds() +
      ":" +
      d.getMilliseconds()
    );
  } else {
    return "";
  }
};
export const dateToTime = (dateObj) => {
  const d = new Date(dateObj);
  const hours = String(d.getHours()).padStart(2, "0"); // Hours (00-23)
  const minutes = String(d.getMinutes()).padStart(2, "0"); // Minutes (00-59)
  const seconds = String(d.getSeconds()).padStart(2, "0"); // Seconds (00-59)
  return `${hours}:${minutes}:${seconds}`;
};
export const isPastDate = (date) => {
  if (date) return new Date(date) < new Date().setHours(0, 0, 0, 0);
};
export const dateToTime1 = (dateObj) => {
  const d = new Date(dateObj);
  const hours = String(d.getHours()).padStart(2, "0"); // Hours (00-23)
  const minutes = String(d.getMinutes()).padStart(2, "0"); // Minutes (00-59)

  return `${hours}:${minutes}`;
};

export const predefinedRanges = [
  {
    label: "Today",
    value: [new Date(), new Date()],
  },
  {
    label: "Yesterday",
    value: [
      new Date(new Date().setDate(new Date().getDate() - 1)),
      new Date(new Date().setDate(new Date().getDate() - 1)),
    ],
  },
  {
    label: "Last 7 Days",
    value: [new Date(new Date().setDate(new Date().getDate() - 7)), new Date()],
  },
];

export const afterToday = () => (date) => {
  return date > new Date();
};
