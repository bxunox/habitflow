const habits = JSON.parse(localStorage.getItem("habits")) || [];
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const heatmap = JSON.parse(localStorage.getItem("heatmap")) || {};

const habitList = document.getElementById("habit-list");
const taskList = document.getElementById("task-list");
const completedList = document.getElementById("completed-list");

function save(){
localStorage.setItem("habits",JSON.stringify(habits));
localStorage.setItem("tasks",JSON.stringify(tasks));
localStorage.setItem("heatmap",JSON.stringify(heatmap));
}

function today(){
return new Date().toISOString().slice(0,10);
}

function renderHabits(){

habitList.innerHTML="";

habits.forEach((h,i)=>{

const el=document.createElement("div");
el.className="habit-item";

el.innerHTML=`
<span>${h.name} 🔥${h.streak}</span>
<button>${h.done ? "✓":"Done"}</button>
`;

el.querySelector("button").onclick=()=>{
h.done=!h.done;

if(h.done){
h.streak++;
updateHeatmap();
}

save();
render();
};

habitList.appendChild(el);

});

}

function renderTasks(){

taskList.innerHTML="";
completedList.innerHTML="";

tasks.forEach((t,i)=>{

const el=document.createElement("div");
el.className="task-item";

el.innerHTML=`
<span>${t.name}</span>
<button>✓</button>
`;

el.querySelector("button").onclick=()=>{
t.done=true;
save();
render();
};

if(t.done){
completedList.appendChild(el);
}else{
taskList.appendChild(el);
}

});

}

function renderProgress(){

const doneHabits=habits.filter(h=>h.done).length;
const doneTasks=tasks.filter(t=>t.done).length;

document.getElementById("habits-progress").innerText=`${doneHabits} / ${habits.length}`;
document.getElementById("tasks-progress").innerText=`${doneTasks} / ${tasks.length}`;

let total=0;

if(habits.length+tasks.length>0){
total=Math.round(((doneHabits+doneTasks)/(habits.length+tasks.length))*100);
}

document.getElementById("total-progress").innerText=`${total}%`;

document.getElementById("habits-bar").style.width=`${habits.length?doneHabits/habits.length*100:0}%`;
document.getElementById("tasks-bar").style.width=`${tasks.length?doneTasks/tasks.length*100:0}%`;

}

function updateHeatmap(){

const day=today();

if(!heatmap[day]) heatmap[day]=0;

heatmap[day]++;

save();
renderHeatmap();

}

function renderHeatmap(){

const container=document.getElementById("heatmap");
container.innerHTML="";

const days=30;

for(let i=days;i>=0;i--){

const d=new Date();
d.setDate(d.getDate()-i);

const key=d.toISOString().slice(0,10);

const val=heatmap[key]||0;

const cell=document.createElement("div");

if(val==1)cell.classList.add("lvl1");
if(val==2)cell.classList.add("lvl2");
if(val>=3)cell.classList.add("lvl3");

container.appendChild(cell);

}

}

function render(){
renderHabits();
renderTasks();
renderProgress();
renderHeatmap();
}

render();

const fab=document.getElementById("fab");
const menu=document.getElementById("fab-menu");

fab.onclick=()=>{
menu.classList.toggle("hidden");
};

const modal=document.getElementById("modal");
const title=document.getElementById("modal-title");
const input=document.getElementById("input-name");
const saveBtn=document.getElementById("save-btn");

let mode="";

document.getElementById("add-habit").onclick=()=>{
mode="habit";
title.innerText="New Habit";
modal.classList.remove("hidden");
};

document.getElementById("add-task").onclick=()=>{
mode="task";
title.innerText="New Task";
modal.classList.remove("hidden");
};

saveBtn.onclick=()=>{

const name=input.value;

if(mode==="habit"){
habits.push({name,streak:0,done:false});
}

if(mode==="task"){
tasks.push({name,done:false});
}

input.value="";
modal.classList.add("hidden");

save();
render();

};

document.querySelectorAll(".bottom-nav button").forEach(btn=>{
btn.onclick=()=>{
document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
document.getElementById(btn.dataset.view).classList.add("active");
};
});

if("serviceWorker" in navigator){
navigator.serviceWorker.register("service-worker.js");
}