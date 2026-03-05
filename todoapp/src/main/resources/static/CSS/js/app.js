const listEl = document.getElementById("todoList");
const formEl = document.getElementById("addForm");
const inputEl = document.getElementById("titleInput");
const reloadBtn = document.getElementById("reloadBtn");
const totalPill = document.getElementById("totalPill");
const leftPill = document.getElementById("leftPill");
const toast = document.getElementById("toast");
const chips = document.querySelectorAll(".chip");

let todos = [];
let filter = "all";

function showToast(msg){
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 900);
}

function escapeHtml(s){
  return s.replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}

function updateStats(){
  totalPill.textContent = `${todos.length} Total`;
  const left = todos.filter(t => !t.completed).length;
  leftPill.textContent = `${left} Left`;
}

function pass(t){
  if (filter === "active") return !t.completed;
  if (filter === "done") return t.completed;
  return true;
}

function render(){
  const show = todos.filter(pass);

  if (show.length === 0){
    listEl.innerHTML = `<li class="empty">Nothing here 👀</li>`;
    updateStats();
    return;
  }

  listEl.innerHTML = show.map(t => `
    <li class="item" data-id="${t.id}">
      <button class="check ${t.completed ? "on" : ""}" type="button"></button>
      <span class="text ${t.completed ? "done" : ""}">${escapeHtml(t.title)}</span>
      <button class="del" type="button">Delete</button>
    </li>
  `).join("");

  updateStats();
}

async function load(){
  const res = await fetch("/api/todos");
  todos = await res.json();
  render();
}

async function addTodo(title){
  const res = await fetch("/api/todos", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ title })
  });
  if (!res.ok) return;
  const created = await res.json();
  todos.unshift(created);
  render();
  showToast("Added ✅");
}

async function toggleTodo(id){
  const res = await fetch(`/api/todos/${id}/toggle`, { method:"PATCH" });
  if (!res.ok) return;
  const updated = await res.json();
  todos = todos.map(t => t.id === updated.id ? updated : t);

  // active first, newest first
  todos.sort((a,b) => (a.completed - b.completed) || (b.id - a.id));

  render();
  showToast(updated.completed ? "Done 🎉" : "Undo ↩️");
}

async function deleteTodo(id){
  const res = await fetch(`/api/todos/${id}`, { method:"DELETE" });
  if (!res.ok) return;
  todos = todos.filter(t => t.id !== id);
  render();
  showToast("Deleted 🗑️");
}

// Events
formEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = inputEl.value.trim();
  if (!title) return;
  await addTodo(title);
  inputEl.value = "";
  inputEl.focus();
});

reloadBtn.addEventListener("click", load);

listEl.addEventListener("click", async (e) => {
  const li = e.target.closest(".item");
  if (!li) return;
  const id = Number(li.dataset.id);

  if (e.target.classList.contains("check")) await toggleTodo(id);
  if (e.target.classList.contains("del")) await deleteTodo(id);
});

chips.forEach(c => {
  c.addEventListener("click", () => {
    chips.forEach(x => x.classList.remove("active"));
    c.classList.add("active");
    filter = c.dataset.filter;
    render();
  });
});

// Start
load();