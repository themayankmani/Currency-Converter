const BASE_URL = `https://api.frankfurter.app`;


const dropdowns = document.querySelectorAll(".select-container select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if(select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", function() {
    updateFlag(this);
  });
}


const updateFlag = (element) =>{
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
}


btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;
    if(amtVal === "" || isNaN(amtVal) || amtVal < 1){
        amtVal = 1;
        amount.value = "1";
    }
    amtVal = Number(amtVal);

    try {
        const URL = `${BASE_URL}/latest?amount=${amtVal}&from=${fromCurr.value}&to=${toCurr.value}`;
        let response = await fetch(URL);
        let data = await response.json();
        
        if (data.rates && data.rates[toCurr.value]) {
            let finalAmount = data.rates[toCurr.value];
            msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
        } else {
            msg.innerText = `Exchange rate not available for ${fromCurr.value} to ${toCurr.value}`;
        }
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        msg.innerText = "Error fetching exchange rate. Please try again later.";
    }
})