const handlelogOut = () => {
    const token = localStorage.getItem("token");
  
    fetch("https://personal-finance-management-hauf.onrender.com/authenticate/logout/", {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        window.location.href="home.html";
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle error
    });

  };
  