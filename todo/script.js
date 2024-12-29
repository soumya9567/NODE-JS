async function handleSubmit(event) {
  event.preventDefault();

  const todo = document.getElementById("todo").value;
  console.log(todo, "from the form");

  try {
    const response = await fetch("http://localhost:3000/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({todo}),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    } else {
      const data = await response.json();
      console.log(data,"Response after adding");

      document.getElementById("todo").value = "";

      fetchData();
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchData() {
  const response = await fetch("http://localhost:3000/getTodos", {
    method: "GET",
  });

  if (!response.ok) {
    console.log("Error");
  } else {
    const todoData = await response.json();
    console.log(todoData, "todoData");

    let listContent = document.getElementById('listContent');
    
    listContent.innerHTML= "";
    todoData.map((data,index)=>{
        const dataTodo = data.todo;
        console.log(dataTodo, "data.todo")
        const idTodo = data.id;
        console.log(idTodo,"data.id")
        const listItems = document.createElement('li');
        const listSpan = document.createElement('span');
        const listPara = document.createElement('p');

        
        listSpan.textContent = `todo: ${dataTodo}`;
        listItems.appendChild(listSpan);
        if(idTodo!== undefined){
          listPara.textContent = `ID: ${idTodo}`;
          listItems.appendChild(listPara);
        }
        listContent.appendChild(listItems);
    })
  }
}

document.addEventListener("DOMContentLoaded", fetchData);
