const handleRegistration = (event) => {
    event.preventDefault();
    const username = getValue("username");
    const first_name = getValue("first_name");
    const last_name = getValue("last_name");
    const email = getValue("email");
    const password = getValue("password");
    const confirm_password = getValue("confirm_password");
   

    const info = new FormData();
    info.append("username", username);
    info.append("first_name", first_name);
    info.append("last_name", last_name);
    info.append("email", email);
    info.append("password", password);
    info.append("confirm_password", confirm_password);
   

    if (password === confirm_password) {
        document.getElementById("error").innerText = "";
        if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)) {
            fetch("https://personal-finance-management-hauf.onrender.com/authenticate/register/", {
                method: "POST",
                body: info
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    document.getElementById("error").innerText = data.error;
                } else {
                    alert("Registration successful! Check your email for confirmation.");
                    window.location.href = "login.html";
                }
            })
            .catch((error) => {
                document.getElementById("error").innerText = "An error occurred. Please try again.";
            });
        } else {
            document.getElementById("error").innerText = "Password must contain eight characters, at least one letter, one number, and one special character.";
        }
    } else {
        document.getElementById("error").innerText = "Password and confirm password do not match.";
    }
};




const handleLogin = (event) => {
    event.preventDefault();
    const username = getValue("login-username");
    const password = getValue("login-password");
    // console.log(username, password);
    if ((username, password)) {
      fetch("https://personal-finance-management-hauf.onrender.com/authenticate/login/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
  
          if (data.token && data.user_id) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user_id", data.user_id);
            window.location.href = "dashboard.html";
          }
          else{
            alert("Please Register first");
          }
        });
    }
  };
const getValue = (id) => {
    return document.getElementById(id).value;
};