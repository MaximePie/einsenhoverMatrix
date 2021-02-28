# Application Eisenhower 


## Lancer l'application 

`yarn install && yarn start`

## Firebase 

This app uses a Firebase based authentication with [mail/password](https://firebase.google.com/docs/auth/web/password-auth) coupling


#### Prerequisites

1. Install `"firebase": "^8.2.7"` in the project (`package.json`).
2. Follow the instructions on [this link](https://firebase.google.com/docs/auth/web/password-auth)


### Login 
```js
  function login() {
    Firebase.auth().signInWithEmailAndPassword(mail, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
      });
  }
```

### Register 

```js
  function register() {
    Firebase.auth().createUserWithEmailAndPassword(mail, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // ..
      });
  }
```

### Edit tasks 

```js
    Firebase.database().ref('/tasks').set(updatedTasks).then(() => {
      fetchTasks();
      setNewTask('');
      setNewTaskImportance(false);
      setNewTaskEmergency(false);
    });
```


### Fetch tasks 

```js

    let ref = Firebase.database().ref('/tasks');
    ref.on('value', snapshot => {
      const state = snapshot.val();
      setTasks(state || []);
    });

```



## Deploy

The deployment uses the platform Netlify. 

To deploy, all you have to do is to add a new `commit`, and `push it`, the deployment will be available 
on the Netlify platform. 
