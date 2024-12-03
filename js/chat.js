async function sendMessage() {
    const input = document.getElementById("user-input");
    const message = input.value;

    const senderId = sessionStorage.getItem("senderId") || `user_${Date.now()}`;
    sessionStorage.setItem("senderId", senderId);

    if (message) {
        addMessageToChat("User", message);
        input.value = '';

        try {
            const response = await fetch('https://8a3b-101-255-123-126.ngrok-free.app/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message, sender: senderId })
            });

            const data = await response.json();

            addMessageToChat("Bot", data.reply);

            if (data.suggestions) {
                displaySuggestions(data.suggestions);
            }
        } catch (error) {
            console.error("Error fetching chat response:", error);
            addMessageToChat("Bot", "Maaf, terjadi masalah pada server. Silakan coba lagi.");
        }
    }
}

function addMessageToChat(sender, message) {
    const chatbox = document.getElementById("chatbox");
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender.toLowerCase());

    if (message.includes("-") || message.includes("p") || message.includes("a")) {
        messageElement.innerHTML = `${sender}: <pre>${message}</pre>`;
    } else {
        messageElement.textContent = `${sender}: ${message}`;
    }

    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight; 
}

function displaySuggestions(suggestions) {
    const suggestionContainer = document.createElement("div");
    suggestionContainer.classList.add("suggestions");

    suggestions.forEach((text) => {
        const suggestionButton = document.createElement("button");
        suggestionButton.textContent = text;
        suggestionButton.onclick = () => {
            document.getElementById("user-input").value = text;
            sendMessage();
        };
        suggestionContainer.appendChild(suggestionButton);
    });

    const chatbox = document.getElementById("chatbox");
    chatbox.appendChild(suggestionContainer);
    chatbox.scrollTop = chatbox.scrollHeight; 
}
