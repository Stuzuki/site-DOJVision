import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ================= FIREBASE ================= */

const firebaseConfig = {
    apiKey: "AIzaSyBvxjntS-Z1XrHa9a0o0N1--bssp7xym_U",
    authDomain: "dojvision-be614.firebaseapp.com",
    projectId: "dojvision-be614",
    storageBucket: "dojvision-be614.firebasestorage.app",
    messagingSenderId: "1073844982688",
    appId: "1:1073844982688:web:717e4e2d4503267ff4cac5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= USER ================= */

const user = localStorage.getItem("user");
if (!user) window.location.href = "index.html";

document.getElementById("welcomeUser").textContent = "Connecté : " + user;

window.logout = function () {
    localStorage.removeItem("user");
    window.location.href = "index.html";
};

let currentColumn = null;
let editingTaskId = null;

/* ================= OUVERTURE MODAL ================= */

document.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", function () {
        currentColumn = this.closest(".day-column");
        editingTaskId = null;
        document.getElementById("taskModal").style.display = "flex";
    });
});

window.closeModal = function () {
    document.getElementById("taskModal").style.display = "none";
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskLocation").value = "";
    document.getElementById("taskTime").value = "";
    document.getElementById("taskMoney").value = "";
    document.getElementById("taskDesc").value = "";
};

/* ================= AJOUT / MODIFICATION ================= */

window.addTask = async function () {

    const title = document.getElementById("taskTitle").value;
    const location = document.getElementById("taskLocation").value;
    const time = document.getElementById("taskTime").value;
    const money = document.getElementById("taskMoney").value;
    const type = document.getElementById("taskType").value;
    const desc = document.getElementById("taskDesc").value;

    if (!title) return;

    const day = currentColumn.querySelector("h3").innerText;

    if (editingTaskId) {

        await updateDoc(doc(db, "audiences", editingTaskId), {
            title, location, time, money, type, desc
        });

    } else {

        await addDoc(collection(db, "audiences"), {
            day,
            title,
            location,
            time,
            money,
            type,
            desc,
            createdBy: user,
            assignedTo: ""
        });

    }

    closeModal();
};

/* ================= REALTIME LOAD ================= */

onSnapshot(collection(db, "audiences"), snapshot => {

    // reset affichage
    document.querySelectorAll(".tasks").forEach(el => el.innerHTML = "");
    document.querySelectorAll(".no-task").forEach(el => el.style.display = "block");

    snapshot.forEach(docSnap => {

        const data = docSnap.data();
        const id = docSnap.id;

        document.querySelectorAll(".day-column").forEach(column => {

            const dayTitle = column.querySelector("h3").innerText;

            if (dayTitle === data.day) {

                const taskDiv = document.createElement("div");
                taskDiv.classList.add("task-card");

                taskDiv.innerHTML = `
                    <div class="task-header">
                        <strong>${data.time}</strong>
                        <span class="badge ${data.type}">${data.type}</span>
                    </div>

                    <div>${data.title} - ${data.location}</div>

                    <div class="money">$ ${data.money}</div>

                    <div class="assigned">
                        ${data.assignedTo ? 
                            `Assigné à : ${data.assignedTo}` : 
                            `Créé par : ${data.createdBy}`}
                    </div>

                    <div class="task-buttons">
                        <button class="btn-edit">Modifier</button>
                        <button class="btn-delete">Supprimer</button>
                        <button class="btn-assign">S'assigner</button>
                    </div>
                `;

                column.querySelector(".tasks").appendChild(taskDiv);
                column.querySelector(".no-task").style.display = "none";

                attachTaskEvents(taskDiv, id, data);
            }

        });

    });

});

/* ================= EVENTS ================= */

function attachTaskEvents(taskDiv, id, data) {

    taskDiv.querySelector(".btn-delete").addEventListener("click", async function () {
        await deleteDoc(doc(db, "audiences", id));
    });

    taskDiv.querySelector(".btn-assign").addEventListener("click", async function () {
        await updateDoc(doc(db, "audiences", id), {
            assignedTo: user
        });
    });

    taskDiv.querySelector(".btn-edit").addEventListener("click", function () {

        editingTaskId = id;

        document.getElementById("taskModal").style.display = "flex";

        document.getElementById("taskTime").value = data.time;
        document.getElementById("taskTitle").value = data.title;
        document.getElementById("taskLocation").value = data.location;
        document.getElementById("taskMoney").value = data.money;
        document.getElementById("taskType").value = data.type;
        document.getElementById("taskDesc").value = data.desc;
    });
}
