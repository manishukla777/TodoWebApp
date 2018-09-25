const axios = require('axios');
var token = '';


 var hitAPI = function(method, url, data, headers){
     
     console.log(method, url, data, headers);
     
     return axios({
         method,
         url,
         data,
         headers
     })
     .then((response) =>{
         return response;
     })
     .catch((error)=>{
         return Promise.reject(error);
     })
 }
 
var signupDOM = document.querySelector('.signup');
var loginDOM = document.querySelector('.login');
var submitBtnDOM = document.querySelector('.submit_btn');
var logoutBtnDOM = document.querySelector('.logout_btn');
var addTodoBtnDOM = document.querySelector('.add_todo_btn');
var todoOrderedList = document.querySelector('.todo_ordered_list');
var addTodoInput = document.querySelector('.add_todo_input');
var todoListDiv = document.querySelector('.todolist_div');
 
 if (signupDOM){
    signupDOM.addEventListener('click',() => {
      document.querySelector('.submit_btn').value = 'Signup';
    })
 }
 
 
if (loginDOM){
   loginDOM.addEventListener('click',() => {
      document.querySelector('.submit_btn').value = 'Login';
   }) 
}

if (submitBtnDOM){
  submitBtnDOM.addEventListener('click',() =>{
    if ( document.querySelector('.submit_btn').value === 'Signup') {
        hitAPI('post','https://tranquil-reef-12505.herokuapp.com/users',{
            email: document.querySelector('.email_textbox').value,
            password: document.querySelector('.password_textbox').value
        },{
            "Content-Type": 'application/json',
        }).then((response) => {
            console.log(response);
            token = response.headers['x-auth'];
            sessionStorage.setItem('token', token);
            window.location.href = 'todos.html';
        }).catch((error) => {
            alert('Enter Valid Email and Password');
            console.log(error);
        })
    } else{
        hitAPI('post','https://tranquil-reef-12505.herokuapp.com/users/login',{
            email: document.querySelector('.email_textbox').value,
            password: document.querySelector('.password_textbox').value
        },{
            "Content-Type": 'application/json'
        }).then((response) => {
            console.log(response);
            token = response.headers['x-auth'];
            sessionStorage.setItem('token', token);
            window.location.href = 'todos.html';
        }).catch((error) => {
            alert('Enter Valid Email and Password');
            console.log(error);
        })
    }
  });
}


if (logoutBtnDOM){
    logoutBtnDOM.addEventListener('click',() => {
        hitAPI('delete','https://tranquil-reef-12505.herokuapp.com/users/me/token',null, {
        'x-auth': sessionStorage.getItem('token')
      }).then((response) => {
        window.location.href = 'index.html';
        console.log(response);
      }).catch((error) => {
        alert('Enter Password');
        console.log(error);
      })
    
    });
}

if (addTodoBtnDOM) {
    getAllTodos();
    addTodoBtnDOM.addEventListener('click',() => {
        hitAPI('post','https://tranquil-reef-12505.herokuapp.com/todos',{
            text: addTodoInput.value,
        },{
            'Content-Type': 'application/json',
            'x-auth': sessionStorage.getItem('token') 
        }).then((response) => {
            console.log(response);
            let html = '<li class="todo_list" id="%id%"><div class="list_div"><button class="complete_status"><i class="ion-md-close-circle"></i></button> <div class="todo">%todoName%</div></div><div class="border_bottom_div"></div></li>'
            let newHtml = html.replace('%todoName%',response.data.todo.text);
            newHtml = newHtml.replace('%id%',response.data.todo._id);
            todoOrderedList.insertAdjacentHTML('beforeend',newHtml);
        }).catch((error) => {
            alert('Enter Valid Email and Password');
            console.log(error);
        })
    })
}

if (todoListDiv) {
    todoListDiv.addEventListener('click', (e) => {
        var todoId = e.target.parentNode.parentNode.parentNode.id;
        console.log('todoId',todoId);
        if (todoId) {
            hitAPI('delete',`https://tranquil-reef-12505.herokuapp.com/todos/${todoId}`, null, {
                  'x-auth': sessionStorage.getItem('token')
            }).then((response) => {
                console.log(response);
                var el = document.getElementById(todoId);
                el.parentNode.removeChild(el);
            }).catch((error) => {
                alert('Enter Valid Email and Password');
                console.log(error);
            })
        }
    })
}


function getAllTodos(){
    hitAPI('get','https://tranquil-reef-12505.herokuapp.com/todos', null, {
            'x-auth': sessionStorage.getItem('token') 
        }).then((response) => {
            console.log(response);
            let todosArr = response.data.todos;
            todosArr.forEach((todo) => {
                let html = '<li class="todo_list" id="%id%"><div class="list_div"><button class="complete_status"><i class="ion-md-close-circle"></i></button> <div class="todo">%todoName%</div></div><div class="border_bottom_div"></div></li>'
                let newHtml = html.replace('%todoName%',todo.text);
                newHtml = newHtml.replace('%id%',todo._id);
                todoOrderedList.insertAdjacentHTML('beforeend',newHtml);
            })
        }).catch((error) => {
            alert('Enter Valid Email and Password');
            console.log(error);
    })
}

                


//"Access-Control-Allow-Origin": '*',
//const res = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);