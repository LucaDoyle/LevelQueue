const levelIndicator = document.getElementById("level-indicator");
const nextButton = document.getElementById("next-button");
const clearAllButton = document.getElementById("clear-all");
const table = document.getElementById("queue-table");
const rowTemplate = table.querySelector("#row-template");
const loginError = document.getElementById("login-error");
const loginButton = document.getElementById("login-button");

const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const indentificationField = document.getElementById("identification-field");
const passwordField = document.getElementById("password-field");

async function getQueue() {
    try {
        const response = await fetch("https://queue.lucamakesstuff.com/api/queue", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        const readableResponse = await response.json();

        if (!response.ok) {
            levelIndicator.textContent = readableResponse;
            table.style.display = "none";

            return;
        }

        populateQueue(readableResponse);
    } catch (error) {
        levelIndicator.textContent = "The server is most likely down.";
        table.style.display = "none";
    }
}

async function populateQueue(queue) {
    for (let i = 0; i < queue.length; i++) {

        console.log(queue)

        const levelCode = queue[i].code;
        const user = queue[i].username;
        const createdDateTime = queue[i].created;

        const newRow = rowTemplate.cloneNode(true);
        newRow.id = levelCode;

        newRow.querySelector("#position").textContent = i + 1;
        newRow.querySelector("#username").textContent = user;
        newRow.querySelector("#code").textContent = levelCode;
        newRow.querySelector("#time").textContent = new Date(createdDateTime).toLocaleString('en-GB', { timeZone: userTimezone });

        table.querySelector("tbody").appendChild(newRow);

        table.style.display = "table";

    }



    levelIndicator.textContent = "Current level: " + queue[0].code;
}


async function login() {

    if (indentificationField.value == null) {
        loginError.textContent = "Please provide an email address or username.";
        loginError.style.display = "block";
    }

    if (loginField.value == null) {
        loginError.textContent = "Please provide a password.";
        loginError.style.display = "block";
    }

    const data = {
        "identification": indentificationField.value,
        "pass": passwordField.value
    }

    try {
        const response = await fetch("https://queue.lucamakesstuff.com/api/login", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })

        const readableResponse = await response.json();

        if (!response.ok) {
            loginError.textContent = readableResponse;
            loginError.style.display = "block";

            return;
        } else {
            window.location.reload();
        }

    } catch (error) {
        loginError.textContent = "The servers are down.";
        loginError.style.display = "block";
    }
}

loginButton.addEventListener("click", console.log("Hi"));

getQueue();