const users = [
    { username: "curtis junior", password: "CJ2024!Supreme" },
    { username: "félicia flores", password: "FFJustice#91" },
    { username: "Louis moroe", password: "LM_Court88" },
    { username: "lopez", password: "Lopez!RP2024" }
];

const form = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const usernameInput = document.getElementById("username").value.trim();
    const passwordInput = document.getElementById("password").value.trim();

    const userFound = users.find(user =>
        user.username === usernameInput &&
        user.password === passwordInput
    );

    if (userFound) {

        localStorage.setItem("user", userFound.username);

        window.location.href = "dashboard.html";

    } else {

        errorMsg.style.color = "red";
        errorMsg.textContent = "Nom d'utilisateur ou mot de passe incorrect.";
    }
});

