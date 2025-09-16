import { useLocation } from "react-router-dom";

const MoneyTransferReceipt = () => {
  const { state } = useLocation();
  const {
    date,
    operator,
    number,
    beneficiaryName,
    accountNumber,
    ifsc,
    amount,
    status,
    transactionId,
  } = state || {};

  return (
    <div>
      <h2>Transaction Receipt</h2>
      <p>Transaction ID: {transactionId}</p>
      <p>Date: {date}</p>
      <p>Operator: {operator}</p>
      <p>Number: {number}</p>
      <p>Beneficiary: {beneficiaryName}</p>
      <p>Account No: {accountNumber}</p>
      <p>IFSC: {ifsc}</p>
      <p>Amount: {amount}</p>
      <p>Status: {status}</p>
    </div>
  );
};

export default MoneyTransferReceipt;
