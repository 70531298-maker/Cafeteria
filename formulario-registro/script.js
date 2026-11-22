// =====================================================================
// script.js (Formulario de registro)
// Cambia entre "Iniciar Sesión" y "Registrarse" con una animación.
// La animación la hace el CSS; aquí solo ponemos o quitamos la clase "toggle".
// =====================================================================

// Buscamos los elementos del HTML.
const container = document.querySelector(".container");     // La caja que contiene los dos formularios
const btnSignIn = document.getElementById("btn-sign-in");   // Botón "Iniciar Sesión" del panel de color
const btnSignUp = document.getElementById("btn-sign-up");   // Botón "Registrarse" del panel de color

// Al presionar "Iniciar Sesión": quitamos la clase "toggle".
// Sin "toggle", el CSS muestra el formulario de iniciar sesión.
// (() => { ... } es una "función flecha": otra forma más corta de escribir function () { ... })
btnSignIn.addEventListener("click",()=>{
    container.classList.remove("toggle");
});

// Al presionar "Registrarse": agregamos la clase "toggle".
// Con "toggle", el CSS desliza los paneles y muestra el formulario de registro.
btnSignUp.addEventListener("click",()=>{
    container.classList.add("toggle");
});
