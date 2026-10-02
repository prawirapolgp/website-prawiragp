// ==========================================
// KEPOLISIAN KOTAKITA - LOGIN SYSTEM
// ==========================================

// DATA LOGIN YANG DITENTUKAN
const LOGIN_USERNAME = "prawiragp";
const LOGIN_PASSWORD = "polgpontop";


// ==========================================
// ELEMENT
// ==========================================

const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginButton = document.querySelector(".login-button");


// ==========================================
// PAKSA NILAI LOGIN
// ==========================================

usernameInput.value = LOGIN_USERNAME;
passwordInput.value = LOGIN_PASSWORD;


// ==========================================
// CEGAH PERUBAHAN DATA
// ==========================================

usernameInput.addEventListener("input", function () {
    this.value = LOGIN_USERNAME;
});

passwordInput.addEventListener("input", function () {
    this.value = LOGIN_PASSWORD;
});


// ==========================================
// PROSES LOGIN
// ==========================================

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const username = usernameInput.value;
    const password = passwordInput.value;


    // CEK LOGIN
    if (
        username === LOGIN_USERNAME &&
        password === LOGIN_PASSWORD
    ) {

        // Simpan status login
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("username", LOGIN_USERNAME);


        // Ubah tombol
        loginButton.innerHTML = `
            <span>✓</span>
            Login Berhasil
        `;

        loginButton.disabled = true;


        // Masuk dashboard
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 700);


    } else {

        alert("Akses ditolak!");

        usernameInput.value = LOGIN_USERNAME;
        passwordInput.value = LOGIN_PASSWORD;

    }

});