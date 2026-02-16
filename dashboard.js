const user = localStorage.getItem("user");
if (!user) window.location.href = "index.html";

document.getElementById("welcomeUser").textContent = "Connecté : " + user;

function logout() {
    localStorage.removeItem("user");
    window.location.href = "index.html";
}

let currentColumn = null;
let editingTask = null;

/* ================= OUVERTURE MODAL ================= */

document.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", function() {
        currentColumn = this.closest(".day-column");
        editingTask = null;
        document.getElementById("taskModal").style.display = "flex";
    });
});

function closeModal() {
    document.getElementById("taskModal").style.display = "none";
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskLocation").value = "";
    document.getElementById("taskTime").value = "";
    document.getElementById("taskMoney").value = "";
    document.getElementById("taskDesc").value = "";
}

/* ================= AJOUT / MODIFICATION ================= */

function addTask() {

    const title = document.getElementById("taskTitle").value;
    const location = document.getElementById("taskLocation").value;
    const time = document.getElementById("taskTime").value;
    const money = document.getElementById("taskMoney").value;
    const type = document.getElementById("taskType").value;
    const desc = document.getElementById("taskDesc").value;

    if (!title) return;

    if (editingTask) {
        editingTask.remove();
    }

    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task-card");

    taskDiv.innerHTML = `
        <div class="task-header">
            <strong>${time}</strong>
            <span class="badge ${type}">${type}</span>
        </div>

        <div>${title} - ${location}</div>

        <div class="money">$ ${money}</div>

        <div class="assigned">Créé par : ${user}</div>

        <div class="task-buttons">
            <button class="btn-edit">Modifier</button>
            <button class="btn-delete">Supprimer</button>
            <button class="btn-assign">S'assigner</button>
        </div>
    `;

    currentColumn.querySelector(".tasks").appendChild(taskDiv);
    currentColumn.querySelector(".no-task").style.display = "none";

    attachTaskEvents(taskDiv);

    closeModal();
}

/* ================= BOUTONS CARTE ================= */

function attachTaskEvents(taskDiv) {

    taskDiv.querySelector(".btn-delete").addEventListener("click", function() {
        taskDiv.remove();
    });

    taskDiv.querySelector(".btn-assign").addEventListener("click", function() {
        let assignedText = taskDiv.querySelector(".assigned");
        assignedText.innerHTML = `Assigné à : ${user}`;
    });

    taskDiv.querySelector(".btn-edit").addEventListener("click", function() {

        editingTask = taskDiv;

        document.getElementById("taskModal").style.display = "flex";

        const header = taskDiv.querySelector(".task-header strong").innerText;
        const badge = taskDiv.querySelector(".badge").innerText;
        const mainText = taskDiv.children[1].innerText.split(" - ");
        const money = taskDiv.querySelector(".money").innerText.replace("$ ", "");

        document.getElementById("taskTime").value = header;
        document.getElementById("taskTitle").value = mainText[0];
        document.getElementById("taskLocation").value = mainText[1];
        document.getElementById("taskMoney").value = money;
        document.getElementById("taskType").value = badge.toLowerCase();
    });
}
