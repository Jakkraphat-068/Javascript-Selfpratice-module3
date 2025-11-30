///// Get Method
/// แบบ Async/Await
async function getTodos() {
  try {
    const res = await fetch('https://localhost:5000/todos'); 
    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

/// แบบ Promise.then()
fetch('https://localhost:5000/todos')
  .then((res) => res.json()) 
  .then((data) => console.log(data)) 
  .catch((error) => console.error('Error:', error)); 

/////////////////////////////////////////////////////////////////////////////////////

///// POST Method
/// แบบ Async/Await
async function createTodo() {
  try {
    const res = await fetch('https://localhost:5000/todos', { 
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify({ 
        category: 'Home',
        description: 'Buy milk',
      }),
    });
    const addedTodo = await res.json(); 
    console.log(addedTodo);
  } catch (error) {
    console.error('Error:', error);
  }
}

/// แบบ Promise.then()
fetch('https://localhost:5000/todos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    category: 'Home',
    description: 'Buy milk',
  }),
})
  .then((res) => res.json()) 
  .then((addedTodo) => {
    console.log('Added:', addedTodo); 
  })
  .catch((error) => console.error('Error:', error));

/////////////////////////////////////////////////////////////////////////////////////

///// DELETE Method
/// แบบ Async/Await
async function deleteTodo() {
  try {
    const res = await fetch('https://localhost:5000/todos/1', {
      method: 'DELETE',
    });
    if (res.status === 200) {
      console.log('Deleted successfully');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

/// แบบ Promise.then()
fetch('https://localhost:5000/todos/1', {
  method: 'DELETE',
})
  .then((res) => {
    if (res.status === 200) {
      console.log('Deleted successfully');
    }
  })
  .catch((error) => console.error('Error:', error));

/////////////////////////////////////////////////////////////////////////////////////

///// PUT Method
/// แบบ Async/
async function updateTodo() {
  try {
    const res = await fetch('https://localhost:5000/todos/1', {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: 'Work', 
        description: 'Prepare meeting notes',
      }),
    });
    const editedTodo = await res.json(); 
    console.log(editedTodo);
  } catch (error) {
    console.error('Error:', error);
  }
}

/// แบบ Promise.then()
fetch('https://localhost:5000/todos/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    category: 'Work',
    description: 'Prepare meeting notes',
  }),
})
  .then((res) => res.json()) 
  .then((editedTodo) => {
    console.log(editedTodo); 
  })
  .catch((error) => console.error('Error:', error));

/////////////////////////////////////////////////////////////////////////////////////

///// PATCH Method
/// แบบ Async/Await
async function patchTodo() {
  try {
    const res = await fetch('https://localhost:5000/todos/1', {
      method: 'PATCH', // 1. ใช้ PATCH
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: 'Prepare meeting notes and presentation',
      }),
    });
    const editedTodo = await res.json();
    console.log(editedTodo);
  } catch (error) {
    console.error('Error:', error);
  }
}

/// แบบ Promise.then()
fetch('https://localhost:5000/todos/1', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    description: 'Prepare meeting notes and presentation',
  }),
})
  .then((res) => res.json()) 
  .then((editedTodo) => {
    console.log(editedTodo); 
  })
  .catch((error) => console.error('Error:', error));