import './App.scss';
import Firebase from 'firebase';
import "firebase/auth";

import * as React from "react";
import {useState} from "react";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const config = {
  apiKey: "AIzaSyCCcCxVnSQj6XFbn_tI_tBYKbngIjhyvt0",
  authDomain: "test-d38d6.firebaseapp.com",
  projectId: "test-d38d6",
  storageBucket: "test-d38d6.appspot.com",
  messagingSenderId: "610344861797",
  appId: "1:610344861797:web:be2d07d73ef06ac32fc68c",
  measurementId: "G-12XDE49HSS",
  databaseURL: "https://test-d38d6-default-rtdb.europe-west1.firebasedatabase.app/",
};

function App() {
  React.useEffect(() => {
    Firebase.initializeApp(config);
    Firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        setUser(user);
      } else {
        // No user is signed in.
      }
    });
  }, []);

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isNewTaskImportant, setNewTaskImportance] = useState(false);
  const [isNewTaskUrgent, setNewTaskEmergency] = useState(false);
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(undefined);

  React.useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);



  return (
    <div className="App">
      {!user && (
        <div>
          <div>
            <p>Veuillez vous connecter pour continuer</p>
            <div>
              <input type="text" value={mail} onChange={(event) => setMail(event.target.value)}/>
              <input type="text" value={password} onChange={(event) => setPassword(event.target.value)}/>
              <button onClick={login}>Se connected</button>
            </div>
          </div>
          <div>
            <p>Ou bien vous inscrire ici</p>
            <input type="text" value={mail} onChange={(event) => setMail(event.target.value)}/>
            <input type="text" value={password} onChange={(event) => setPassword(event.target.value)}/>
            <button onClick={register}>S'inscrire</button>
          </div>
        </div>
      )}
      {user && (
        <>
          <div className="NewTask">
            <button onClick={logout} className={"Logout"}>X</button>
            <input
              type="text"
              placeholder={"Nouvelle tâche"}
              value={newTask}
              onChange={(event) => setNewTask(event.target.value)}
              className="NewTask__text"
            />
            <div className="NewTask__checkboxes">
              <label className="NewTask__checkbox">
                Important
                <input
                  type="checkbox"
                  onChange={() => setNewTaskImportance(!isNewTaskImportant)}
                  checked={isNewTaskImportant}
                />
              </label>
              <label className="NewTask__checkbox">
                Urgent
                <input
                  type="checkbox"
                  onChange={() => setNewTaskEmergency(!isNewTaskUrgent)}
                  checked={isNewTaskUrgent}
                />
              </label>
            </div>
            <div className="NewTask__action">
              <button className="PrimaryButton" onClick={addTask}>Enregistrer</button>
            </div>
          </div>
          <div className="Tasks">
            {tasks && displayTasks()}
          </div>
        </>
      )}
    </div>
  );

  function login() {
    Firebase.auth().signInWithEmailAndPassword(mail, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setUser(user);
      })
  }

  function register() {
    Firebase.auth().createUserWithEmailAndPassword(mail, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setUser(user);
        // ...
      })
  }

  function logout() {
    Firebase.auth().signOut().then(() => {
      setUser(undefined);
    }).catch(() => {
    });
  }

  function displayTasks() {
    const formatedTasks = [];
    formatedTasks.push({
      header: "Urgent et important",
      tasks: tasks.filter(task => task.isImportant && task.isUrgent)
    });
    formatedTasks.push({
      header: "Urgent et non important",
      tasks: tasks.filter(task => !task.isImportant && task.isUrgent)
    });
    formatedTasks.push({
      header: "Non urgent et important",
      tasks: tasks.filter(task => task.isImportant && !task.isUrgent)
    });
    formatedTasks.push({
      header: "Non urgent, non important",
      tasks: tasks.filter(task => !task.isImportant && !task.isUrgent)
    });

    return (
      <div className={"Tasks__categories"}>
        {
          formatedTasks.map((category, categoryIndex) => (
            <div className="Tasks__category" key={categoryIndex}>
              <h3>{category.header}</h3>
              {category.tasks.map((task, index) => (
                <div
                  onClick={() => removeTask(task)}
                  key={index}
                  className="Task__wording"
                >
                  {task.wording}
                </div>
              ))}
            </div>
          ))
        }
      </div>
    )
  }

  /**
   * Removes the tasks
   */
  function removeTask(removedTask) {
    const updatedTasks = [...tasks].filter(task => task !== removedTask);
    const userId = user.uid;
    Firebase.database().ref(`/users/${userId}/tasks`).set(updatedTasks).then(fetchTasks);
  }

  function addTask() {
    const userId = user.uid;

    const updatedTasks = [...tasks];
    updatedTasks.push({
      wording: newTask,
      isUrgent: isNewTaskUrgent,
      isImportant: isNewTaskImportant,
    });

    Firebase.database().ref(`users/${userId}/tasks`).set(updatedTasks).then(() => {
      fetchTasks();
      setNewTask('');
      setNewTaskImportance(false);
      setNewTaskEmergency(false);
    });
  }

  function fetchTasks() {
    const userId = user.uid;
    let ref = Firebase.database().ref(`users/${userId}/tasks`);
    ref.on('value', snapshot => {
      const state = snapshot.val();
      setTasks(state || []);
    });
  }
}

export default App;
