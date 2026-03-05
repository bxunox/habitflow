document.addEventListener("DOMContentLoaded", () => {

  const habits = JSON.parse(localStorage.getItem("habits")) || [];
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const habitList = document.getElementById("habit-list");
  const taskList = document.getElementById("task-list");
  const completedList = document.getElementById("completed-list");

  const modal = document.getElementById("modal");
  const input = document.getElementById("input-name");
  const saveBtn = document.getElementById("save-btn");
  const cancelBtn = document.getElementById("cancel-btn");

  const fab = document.getElementById("fab");
  const menu = document.getElementById("fab-menu");

  let mode = "";

  // Save data
  function saveData(){
    localStorage.setItem("habits", JSON.stringify(habits));
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderProgress();
  }

  // Render Habits
  function renderHabits(){
    habitList.innerHTML="";
    habits.forEach((habit,index)=>{
      const div = document.createElement("div");
      div.className="habit-item";
      div.innerHTML=`<span>${habit.name} 🔥${habit.streak || 0}</span>
                     <button>${habit.done ? "✓":"Done"}</button>`;
      div.querySelector("button").onclick=()=>{
        habit.done = !habit.done;
        if(habit.done) habit.streak = (habit.streak||0)+1;
        saveData();
        renderHabits();
      };
      habitList.appendChild(div);
    });
  }

  // Render Tasks
  function renderTasks(){
    taskList.innerHTML="";
    completedList.innerHTML="";
    tasks.forEach((task,index)=>{
      const div = document.createElement("div");
      div.className="task-item";
      div.innerHTML=`<span>${task.name}</span>
                     <button>✓</button>`;
      div.querySelector("button").onclick=()=>{
        task.done = true;
        saveData();
        renderTasks();
      };
      if(task.done) completedList.appendChild(div);
      else taskList.appendChild(div);
    });
  }

  // Render progress on Dashboard
  function renderProgress(){
    const doneHabits = habits.filter(h=>h.done).length;
    const doneTasks = tasks.filter(t=>t.done).length;
    document.getElementById("habits-progress").innerText = `${doneHabits} / ${habits.length}`;
    document.getElementById("tasks-progress").innerText = `${doneTasks} / ${tasks.length}`;
  }

  // Initial render
  renderHabits();
  renderTasks();
  renderProgress();

  // Floating + menu toggle
  fab.addEventListener("click", ()=>{ menu.classList.toggle("hidden"); });

  // Open modal
  document.getElementById("add-habit").addEventListener("click", ()=>{
    mode="habit";
    document.getElementById("modal-title").innerText="New Habit";
    modal.classList.remove("hidden");
  });

  document.getElementById("add-task").addEventListener("click", ()=>{
    mode="task";
    document.getElementById("modal-title").innerText="New Task";
    modal.classList.remove("hidden");
  });

  // Save modal
  saveBtn.addEventListener("click", ()=>{
    const name=input.value.trim();
    if(name==="") return;
    if(mode==="habit") habits.push({name, streak:0, done:false});
    if(mode==="task") tasks.push({name, done:false});
    input.value="";
    modal.classList.add("hidden");
    saveData();
    renderHabits();
    renderTasks();
  });

  // Cancel modal
  cancelBtn.addEventListener("click", ()=>{
    input.value="";
    modal.classList.add("hidden");
  });

  // Bottom nav
  document.querySelectorAll(".bottom-nav button").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
      document.getElementById(btn.dataset.view).classList.add("active");
    });
  });

});