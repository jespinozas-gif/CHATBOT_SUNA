const API_URL = "https://chatbot-suna.onrender.com";

const toggle = document.getElementById("chat-toggle");
const panel = document.getElementById("chat-panel");
const closeBtn = document.getElementById("close-btn");

const loginBtn = document.getElementById("login-btn");

const loginSection = document.getElementById("login-section");
const chatSection = document.getElementById("chat-section");

const body = document.getElementById("chat-body");
const sendBtn = document.getElementById("send-btn");
const input = document.getElementById("chat-input");

toggle.onclick = () => {
    panel.style.display = "flex";
};

closeBtn.onclick = () => {
    panel.style.display = "none";
};

loginBtn.onclick = async () => {

    const apiKey = document.getElementById("api-key").value;
    const intendencia = document.getElementById("intendencia").value;
    const password = document.getElementById("password").value;

    if (!apiKey || !intendencia || !password) {
        alert("Complete todos los campos");
        return;
    }

    try {

        const resp = await fetch(API_URL + "/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                api_key: apiKey,
                intendencia: intendencia,
                password: password
            })
        });

        const data = await resp.json();

        if (data.success) {

            sessionStorage.setItem("api_key", apiKey);
            sessionStorage.setItem("intendencia", intendencia);

            loginSection.style.display = "none";
            chatSection.style.display = "block";

        } else {
            alert(data.error);
        }

    } catch (err) {
        alert("No se pudo conectar con la API");
    }

};

sendBtn.onclick = sendMessage;

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});

async function sendMessage() {

    const pregunta = input.value.trim();
    if (!pregunta) return;

    addMessage(pregunta, "user");
    input.value = "";

    const categorias = [];
    document.querySelectorAll(".categoria:checked")
        .forEach(c => categorias.push(c.value));

    try {

        const resp = await fetch(API_URL + "/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                api_key: sessionStorage.getItem("api_key"),
                intendencia: sessionStorage.getItem("intendencia"),
                categorias: categorias,
                pregunta: pregunta
            })
        });

        const data = await resp.json();

        addMessage(data.respuesta, "bot");

    } catch (err) {
        addMessage("Error al consultar la API.", "bot");
    }

    body.scrollTop = body.scrollHeight;
}

function addMessage(text, type) {
    const div = document.createElement("div");
    div.classList.add("msg", type);
    div.innerText = text;
    body.appendChild(div);
}
