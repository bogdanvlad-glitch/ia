const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");
const messages = document.getElementById("messages");

const history = [];

function addMessage(text, type) {
  const wrapper = document.createElement("div");
  wrapper.className = `message ${type}`;

  const label = document.createElement("strong");
  label.textContent = type === "user" ? "Toi" : "LeadPilot AI";

  const body = document.createElement("p");
  body.textContent = text;

  wrapper.appendChild(label);
  wrapper.appendChild(body);
  messages.appendChild(wrapper);
  messages.scrollTop = messages.scrollHeight;
}

function setLoading(isLoading) {
  const button = form.querySelector("button");
  button.disabled = isLoading;
  input.disabled = isLoading;
  button.textContent = isLoading ? "..." : "Envoyer";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = input.value.trim();
  if (!message) return;

  addMessage(message, "user");
  history.push({ role: "user", content: message });
  input.value = "";
  setLoading(true);

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        history: history.slice(0, -1),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erreur inconnue");
    }

    addMessage(data.reply, "bot");
    history.push({ role: "assistant", content: data.reply });
  } catch (error) {
    addMessage("Erreur: impossible de contacter l'IA. Verifie le serveur et la cle API.", "bot");
    console.error(error);
  } finally {
    setLoading(false);
    input.focus();
  }
});
