const mortgageAmount = document.getElementById("mortgage-amount");
const mortgageTerm = document.getElementById("mortgage-term");
const interestRate = document.getElementById("interest-rate");
const result = document.getElementById("result");
const results = document.getElementById("results");
const right = document.getElementById("right");
const clear = document.getElementById("clear");
const calculate = document.getElementById("calculate");
const repayment = document.getElementById("Repayment");
const interest = document.getElementById("Interest");
const errorAmount = document.getElementById("error-amount");
const errorTerm = document.getElementById("error-term");
const errorRate = document.getElementById("error-rate");
const errorType = document.getElementById("error-type");
const radio = document.getElementById("radio");
const radio2 = document.getElementById("radio2");

const formatAmount = (value) => {
  let number = value.replace(/,/g, "");
  if (!isNaN(number) && number.trim() !== "") {
    return Number(number).toLocaleString();
  }
  return value;
};

const parseAmount = (value) => {
  return Number(value.replace(/,/g, ""));
};

const validateInput = (
  value,
  errorElement,
  inputElement,
  backgroundElement
) => {
  if (isNaN(value) || value <= 0) {
    backgroundElement.style.backgroundColor = "red";
    backgroundElement.style.color = "white";
    inputElement.style.borderColor = "red";
    errorElement.style.display = "block";
    return false;
  }
  backgroundElement.style.backgroundColor = "#D4DF2B";
  backgroundElement.style.color = "#253000";
  inputElement.style.borderColor = "#ebee97";
  return true;
};

const validateFields = () => {
  const amount = parseAmount(mortgageAmount.value);
  const years = Number(mortgageTerm.value);
  const rate = Number(interestRate.value);

  [errorAmount, errorTerm, errorRate, errorType].forEach(
    (e) => (e.style.display = "none")
  );
  [mortgageAmount, mortgageTerm, interestRate].forEach(
    (input) => (input.style.borderColor = "")
  );
  [
    document.getElementById("currency-amount"),
    document.getElementById("currency-term"),
    document.getElementById("currency-rate"),
  ].forEach((span) => {
    span.style.backgroundColor = "";
    span.style.color = "#79919d";
  });

  const isAmountValid = validateInput(
    amount,
    errorAmount,
    mortgageAmount,
    document.getElementById("currency-amount")
  );
  const isTermValid = validateInput(
    years,
    errorTerm,
    mortgageTerm,
    document.getElementById("currency-term")
  );
  const isRateValid = validateInput(
    rate,
    errorRate,
    interestRate,
    document.getElementById("currency-rate")
  );

  if (!repayment.checked && !interest.checked) {
    errorType.style.display = "block";
    errorType.style.color = "red";
    return false;
  }
  return isAmountValid && isTermValid && isRateValid;
};

const calculateMortgage = () => {
  if (!validateFields()) {
    right.style.display = "none";
    result.style.display = "flex";
    return;
  }

  const amount = parseAmount(mortgageAmount.value);
  const years = Number(mortgageTerm.value);
  const rate = Number(interestRate.value);

  right.style.display = "block";
  result.style.display = "none";
  const months = years * 12;
  const ratePerMonth = rate / 100 / 12;
  const top = Math.pow(1 + ratePerMonth, months);
  const bottom = top - 1;
  const monthly = amount * (ratePerMonth + ratePerMonth / bottom);
  const total = monthly * months;
  const formatCurrency = (value) =>
    `£ ${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  results.innerHTML = `
  <div>
  <p>Your monthly repayments</p>
  <p id="monthly-repayments">${formatCurrency(monthly)}</p>  
  </div>
    <hr />
    <div>
    <p>Total you'll repay over the term</p>
    <p id="total-repayment">${formatCurrency(total)}</p>
    </div>
    `;

  mortgageAmount.value = "";
  mortgageTerm.value = "";
  interestRate.value = "";
  repayment.checked = false;
  interest.checked = false;
};

const handleRadioSelection = (event) => {
  document
    .querySelectorAll(".radio-group div")
    .forEach((div) => div.classList.remove("selected"));
  event.target.parentElement.classList.add("selected");
};

const clearForm = () => {
  mortgageAmount.value = "";
  mortgageTerm.value = "";
  interestRate.value = "";
  result.style.display = "flex";
  right.style.display = "none";
  [
    document.getElementById("currency-amount"),
    document.getElementById("currency-term"),
    document.getElementById("currency-rate"),
  ].forEach((span) => {
    span.style.backgroundColor = "";
    span.style.color = "#79919d";
  });
  [
    document.getElementById("error-amount"),
    document.getElementById("error-term"),
    document.getElementById("error-rate"),
    document.getElementById("error-type"),
  ].forEach((span) => {
    span.style.display = "none";
  });

  [mortgageAmount, mortgageTerm, interestRate].forEach(
    (input) => (input.style.borderColor = "")
  );
  repayment.checked = false;
  interest.checked = false;
  document
    .querySelectorAll(".radio-group div")
    .forEach((div) => div.classList.remove("selected"));
};

[mortgageAmount, mortgageTerm, interestRate].forEach((input) => {
  input.addEventListener("input", () => {
    if (input.id === "mortgage-amount") {
      input.value = formatAmount(input.value);
    }
    validateFields();
  });
});
[mortgageAmount, mortgageTerm, interestRate].forEach((input) => {
  input.addEventListener("change", () => {
    if (input.id === "mortgage-amount") {
      input.value = formatAmount(input.value);
    }
    validateFields();
  });
});

repayment.addEventListener("change", validateFields);
interest.addEventListener("change", validateFields);

repayment.addEventListener("change", handleRadioSelection);
interest.addEventListener("change", handleRadioSelection);

calculate.addEventListener("click", calculateMortgage);
clear.addEventListener("click", clearForm);
