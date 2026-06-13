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
            alert(data.error || "Error en login");
        }

    } catch (err) {
        console.error(err);
        alert("No se pudo conectar con la API");
    }

};

Btn.onclick = Message;

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") Message();
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
        
        const typingDiv = document.createElement("div");
        typingDiv.className = "msg bot typing";
        typingDiv.id = "typing-indicator";
        
        typingDiv.innerHTML = `
        <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
        `;
        body.appendChild(typingDiv);
        
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

        if (data.success === false) {
            addMessage(data.respuesta || "Error del servidor", "bot");
            return;
        }

        if (!data.respuesta) {
            addMessage("Respuesta vacía del servidor", "bot");
            return;
        }

        document.getElementById("typing-indicator")?.remove();
        addMessage(data.respuesta, "bot");

    } catch (err) {
        document.getElementById("typing-indicator")?.remove();
        console.error(err);
        addMessage("Error al conectar con la API", "bot");
    }

    body.scrollTop = body.scrollHeight;
}

function addMessage(text, type) {
    const div = document.createElement("div");
    div.classList.add("msg", type);
    div.innerHTML = marked.parse(text);
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
}
