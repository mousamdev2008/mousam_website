const projectSearch = document.getElementById("project-search");
const projectItems = document.querySelectorAll(".projects-list li");

if (projectSearch) {
    projectSearch.addEventListener("input", function () {
        const searchText = projectSearch.value.toLowerCase().trim();

        projectItems.forEach(function (item) {
            const projectText = item.textContent.toLowerCase();

            if (projectText.includes(searchText)) {
                item.style.display = "";
            } else {
                item.style.display = "none";
            }
        });
    });
}
const themeToggle = document.getElementById("theme-toggle");

if (themeToggle) {
    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            themeToggle.textContent = "Switch to Light Mode";
        } else {
            themeToggle.textContent = "Switch to Dark Mode";
        }
    });
}

const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");
const chatMessages = document.getElementById("chat-messages");
const chatStatus = document.getElementById("chat-status");

let chatBusy = false;

function addChatMessage(role, text) {
    if (!chatMessages) {
        return;
    }

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble " + role;
    bubble.textContent = text;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function setChatLoading(isLoading) {
    chatBusy = isLoading;

    if (chatStatus) {
        chatStatus.hidden = !isLoading;
    }

    if (chatSend) {
        chatSend.disabled = isLoading;
    }

    if (chatInput) {
        chatInput.disabled = isLoading;
    }
}

if (chatMessages) {
    addChatMessage(
        "assistant",
        "Hi, I can answer questions about Mousam Kumari's education, skills, projects, and contact details."
    );
}

if (chatForm && chatInput) {
    chatForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const message = chatInput.value.trim();

        if (!message || chatBusy) {
            return;
        }

        addChatMessage("user", message);
        chatInput.value = "";
        setChatLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: message }),
            });

            let data = {};

            try {
                data = await response.json();
            } catch (error) {
                data = {};
            }

            if (!response.ok || !data.reply) {
                addChatMessage(
                    "error",
                    data.error || "Sorry, I could not get a response. Please try again."
                );
                return;
            }

            addChatMessage("assistant", data.reply);
        } catch (error) {
            addChatMessage(
                "error",
                "Sorry, I could not reach the assistant. Please try again."
            );
        } finally {
            setChatLoading(false);
            chatInput.focus();
        }
    });
}