// src/utils/NumberToWordsIndian.js

export const convertNumberToWordsIndian = (num) => {
  if (num === null || num === undefined || num === "") return "";

  num = parseFloat(num).toFixed(2);

  const ones = [
    "", "one", "two", "three", "four", "five", "six", "seven",
    "eight", "nine", "ten", "eleven", "twelve", "thirteen",
    "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"
  ];

  const tens = [
    "", "", "twenty", "thirty", "forty", "fifty",
    "sixty", "seventy", "eighty", "ninety"
  ];

  // ✅ Add “and” inside hundreds (e.g., one hundred and twenty three)
  const numToWords = (n) => {
    if (n < 20) return ones[n];
    if (n < 100)
      return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000) {
      const hundredPart = Math.floor(n / 100);
      const remainder = n % 100;
      return (
        ones[hundredPart] +
        " hundred" +
        (remainder ? " and " + numToWords(remainder) : "")
      );
    }
    return "";
  };

  const [rupeesPart, paisePart] = num.split(".");
  let rupees = parseInt(rupeesPart);
  let paise = parseInt(paisePart);

  if (isNaN(rupees)) rupees = 0;
  if (isNaN(paise)) paise = 0;

  let str = "";
  const crore = Math.floor(rupees / 10000000);
  const lakh = Math.floor((rupees / 100000) % 100);
  const thousand = Math.floor((rupees / 1000) % 100);
  const hundred = Math.floor((rupees / 100) % 10);
  const remainder = rupees % 100;

  if (crore) str += numToWords(crore) + " crore ";
  if (lakh) str += numToWords(lakh) + " lakh ";
  if (thousand) str += numToWords(thousand) + " thousand ";
  if (hundred) str += ones[hundred] + " hundred ";
  if (remainder) str += (hundred && remainder ? " and " : "") + numToWords(remainder);

  let words = str.trim()
    ? str.trim() + " rupees"
    : "zero rupees";

  if (paise > 0) {
    words += " and " + numToWords(paise) + " paise";
  }

  return words.replace(/\s+/g, " ").trim();
};
