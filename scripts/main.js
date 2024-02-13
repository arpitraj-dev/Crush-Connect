// "use strict";

document.getElementById("submit-btn").addEventListener("click", function (e) {
  e.preventDefault();
  const ina = document.getElementById("in-a").value;
  const inb = document.getElementById("in-b").value;
  formProcess(ina, inb);
});

function formProcess(...arr) {
  for (let i=0; i<arr.length; ++i)
    arr[i] = arr[i].toLowerCase();

  const l = (arr[0].length > arr[1].length) ? arr[1].length : arr[0].length;
  let hashText = "";

  for (let i=0; i<l; ++i) {
    if(arr[0][i] == arr[1][i])
      continue;
    else if (arr[0][i]<arr[1][i]) {
      hashText = arr[0] + arr[1];
      break;
    } else {
      hashText = arr[1] + arr[0];
      break;
    }
  }
  hashData(hashText).then((rv) => {
    console.log(rv);
  });
}

async function hashData(string) {
  const utf8 = new TextEncoder().encode(string);
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((bytes) => bytes.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}