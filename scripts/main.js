"use strict";

const supabaseApi = "https://hxrrxccfvtyhzpcguajx.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4cnJ4Y2NmdnR5aHpwY2d1YWp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc4MTkwOTAsImV4cCI6MjAyMzM5NTA5MH0.fJpt5C1Hy0relVA_COAYA7tnMCPtLNynuB_M2z1C9K8";

const supabaseU = supabase.createClient(supabaseApi, supabaseAnonKey);

document.getElementById("submit-btn").addEventListener("click", function (e) {
  e.preventDefault();

  const instaInputA = document.getElementById("in-a").value.toLowerCase().trim();
  const instaInputB = document.getElementById("in-b").value.toLowerCase().trim();

  if (instaInputA === "" || instaInputB === "" || instaInputA == instaInputB) {
    document.getElementById("exampleModalLabel2").innerHTML =
      "Please specify id's";
    document.getElementById("modal-data-h3").innerHTML =
      "Please specify both your and your crush's instagram unique id to continue.";
  } else {
    formProcess(instaInputA, instaInputB);
  }
});

document.querySelectorAll(".input-group").forEach((e) => {
  e.addEventListener("click", () => {
    e.children[1].focus();
  });
});

document.getElementById("exampleModal2").addEventListener("hide.bs.modal", (e) => {
  const t = document.getElementById("exampleModalLabel2").innerHTML;
  if (t == "Congratulations!!" || t == "Hang in there!")
    window.location.reload();
});

async function checkLocalStorage() {
  if (localStorage.getItem("ina") || localStorage.getItem("inb")) {
    let status = "Pending...";
    hashData(localStorage.getItem("ina") + localStorage.getItem("inb")).then((hashedData) => {
      document.getElementById("ur-hash").innerHTML = "you hash: " + hashedData;
      console.log(hashedData);
      supabaseU.from("hashedDataTable").select("*").eq("hashedData", hashedData).then((data, err) => {
        if (data.data.length > 0) {
          if (data.data[0].boolEq)
            status = "Matched";
          else
            status = "Pending..";
        } else {
          status = "Unavailable!";
        }
        document.getElementById("curr-status").innerHTML = "Status: " + status;
      });
    });

    document.querySelector(".already-done").style.display = "block";
    document.querySelector(".overlay-class").style.filter = "blur(8px)";
    document.querySelector("#in-a-h5").innerHTML = localStorage.getItem("ina");
    document.querySelector("#in-b-h5").innerHTML = localStorage.getItem("inb");
  }
}

function formProcess(...arr) {
  for (let i = 0; i < arr.length; ++i) arr[i] = arr[i].toLowerCase();

  const l = arr[0].length > arr[1].length ? arr[1].length : arr[0].length;
  let hashText = "";

  for (let i = 0; i < l; ++i) {
    if (arr[0][i] == arr[1][i]) continue;
    else if (arr[0][i] < arr[1][i]) {
      hashText = arr[0] + arr[1];
      localStorage.setItem("ina", arr[0]);
      localStorage.setItem("inb", arr[1]);
      break;
    } else {
      hashText = arr[1] + arr[0];
      localStorage.setItem("ina", arr[1]);
      localStorage.setItem("inb", arr[0]);
      break;
    }
  }

  hashData(hashText).then((rv) => {
    supabaseU
      .from("hashedDataTable")
      .select()
      .then(async (data, err) => {
        try {
          let found = false;
          for (const i of data.data) {
            if (i.hashedData == rv) {
              found = true;
              break;
            }
          }
          if (found) {
            const { data, error } = await supabaseU
              .from("hashedDataTable")
              .update({ boolEq: true })
              .eq("hashedData", rv);

            document.getElementById("exampleModalLabel2").innerHTML =
              "Congratulations!!";
            document.getElementById("modal-data-h3").innerHTML =
              "Looks like someone found themselve a date. It seems you and your crush have the same feelings and have used crush connect!";
          } else {
            document.getElementById("exampleModalLabel2").innerHTML =
              "Hang in there!";
            document.getElementById("modal-data-h3").innerHTML =
              "May the luck be on your side. We have registered your response (as a hash). wait till you have any response from your crush ;)";
            supabaseU
              .from("hashedDataTable")
              .insert({
                boolEq: false,
                created_at: `now()`,
                hashedData: rv,
              })
              .then((err) => {
                console.log(err);
              });
          }
        } catch (e) {
          console.log(e);
        }
      });
  });
}

async function hashData(string) {
  const utf8 = new TextEncoder().encode(string);
  const hashBuffer = await crypto.subtle.digest("SHA-256", utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((bytes) => bytes.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}
