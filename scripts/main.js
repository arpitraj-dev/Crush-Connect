"use strict";

const supabaseApi = "https://hxrrxccfvtyhzpcguajx.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4cnJ4Y2NmdnR5aHpwY2d1YWp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc4MTkwOTAsImV4cCI6MjAyMzM5NTA5MH0.fJpt5C1Hy0relVA_COAYA7tnMCPtLNynuB_M2z1C9K8";

const supabaseU = supabase.createClient(supabaseApi, supabaseAnonKey);

document.getElementById("submit-btn").addEventListener("click", function (e) {
  e.preventDefault();
  const ina = document.getElementById("in-a").value;
  const inb = document.getElementById("in-b").value;
  formProcess(ina, inb);
});

function formProcess(...arr) {
  for (let i = 0; i < arr.length; ++i)
    arr[i] = arr[i].toLowerCase();

  const l = (arr[0].length > arr[1].length) ? arr[1].length : arr[0].length;
  let hashText = "";

  for (let i = 0; i < l; ++i) {
    if (arr[0][i] == arr[1][i])
      continue;
    else if (arr[0][i] < arr[1][i]) {
      hashText = arr[0] + arr[1];
      break;
    } else {
      hashText = arr[1] + arr[0];
      break;
    }
  }

  hashData(hashText).then((rv) => {
    supabaseU.from('hashedDataTable').select().then((data, err) => {
      try {
        let found = false;
        for (const i of data.data) {
          if (i.hashedData == rv) {
            found = true;
            break;
          }
        }
        if (found) {
          //found
          alert("match found!");
        } else {
          //not found
        }
      } catch (e) {
        console.log(err, e);
      }
    });
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

// supabaseU.from("hashedDataTable").insert({
//   boolEq: false,
//   created_at: "2024-02-13T11:18:37+00:00",
//   id: 4,
//   hashedData: "TeStT"
// }).then((err) => {
//   console.log(err);
// });
