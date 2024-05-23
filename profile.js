
const loadUserDetails = () => {
    const user_id = localStorage.getItem("user_id");
    fetch(`https://personal-finance-management-hauf.onrender.com/users/${user_id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        document.getElementById("username").value = data.username;
        document.getElementById("firstName").value = data.first_name;
        document.getElementById("lastName").value = data.last_name;
        document.getElementById("email").value = data.email;
      });
};

loadUserDetails();

document.getElementById("editUserBtn").addEventListener("click", () => {
    document.querySelectorAll("#user-details-form input").forEach((input) => {
        input.removeAttribute("readonly");
    });
    document.getElementById("editUserBtn").classList.add("d-none");
    document.getElementById("saveUserBtn").classList.remove("d-none");
});

document.getElementById("user-details-form").addEventListener("submit", (event) => {
    event.preventDefault();
    //  to handle form submission and update user details
    const formData = new FormData(event.target);
    const user_id = localStorage.getItem("user_id");
    fetch(`https://personal-finance-management-hauf.onrender.com/users/${user_id}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(Object.fromEntries(formData)),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        
        loadUserDetails();
        
    })
    .catch((error) => console.error("Error updating user details:", error));
});
