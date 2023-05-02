const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const submitBtn = document.querySelector("#submit-btn");
const errMessage = document.querySelector("#error-message");

const BASE_URL = "https://reqres.in/api/";

submitBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  errMessage.textContent = "";
  passwordInput.classList.remove("error-active");
  emailInput.classList.remove("error-active");

  const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailInput.value.match(mailformat)) {
    emailInput.classList.add("error-active");
    errMessage.textContent = "Email is not in the correct format";
    return;
  }

  if (passwordInput.value.trim().length < 6) {
    passwordInput.classList.add("error-active");
    errMessage.textContent = "Password must be at least 6 characters long";
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailInput.value,
        password: passwordInput.value,
      }),
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }

    const token = data.token;
    localStorage.setItem("token", token);
    const newUrl = new URL("https://bejewelled-creponne-bce146.netlify.app/index.html");
    window.location.assign(newUrl.href);

    console.log(localStorage);
  } catch (err) {
    errMessage.textContent = "User does not exist";
    console.error(err);
  }
});
