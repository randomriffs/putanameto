<template>
  <div v-if="isLoading" class="loader">
    <img src="../assets/loader.gif" />
  </div>
  <div v-else class="todo-container">
    <div class="top-sticky">
    <div class="header">
      <h1 class="title-header"><span>T</span><span>&#9673;</span><span>D</span><span>&#9673;</span></h1>
      <h2 class="sort-header" @click="sort">&#9650;</h2>
    </div>
        <div class="divider"></div>
    <div class="divider-two"></div>
    </div>
    <TodoList
      :todoLists="data"
      @clicked="addTaskData"
      @delete-task="deteleTaskFirestore"
      @completed-task="completeTaskFirestore"
      @edit-task="editTaskFirestore"
      @update-task="updateFirestore"
    />
        <span class="add-new-input">
      <input
        type="text"
        v-model="task"
        @blur="addTask()"
        @keyup.enter="addTask()"
        :placeholder="placeHolder"
        @focus="placeHolder=''"
      />
    </span>
  </div>
</template>

<script>
import TodoList from "./TodoList";
import firebase from "../firestore";
import { uuid } from "vue-uuid";

const db = firebase.firestore();
export default {
  name: "TodoComponent",
  props: {},
  components: {
    TodoList
  },
  data: function() {
    return {
      data: [],
      isLoading: true,
       placeHolder: "+ List Item" // Initial place holder
    };
  },
  methods: {
    addTaskData: function(value) {
      var newTaskSchema = {
        id: uuid.v1(),
        // task: value.charAt(0).toUpperCase() + value.slice(1),
        task: value,
        isCompleted: false,
        edit: true,
        time: new Date().toLocaleString()
      };
      // window.scrollTo(0,document.getElementById('toto-list').scrollHeight);
      // Adding new task to local state
      this.data.push(newTaskSchema);

      // Adding new task to Firestore collection "to-do"
      db.collection("to-do")
        .doc(newTaskSchema.id)
        .set({
          data: newTaskSchema
        })
        .then(function() {
          console.log("Document successfully written!");
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });
    },
     addTask: function() {
      this.placeHolder = "+ List Item";
      if (this.task) {
        this.addTaskData(this.task)
        this.task = "";
      }
    },
    getTaskFromFirestore: function() {
      // Getting task list from firestore collection "to-do"
      const collection = db.collection("to-do");
      collection.get().then(snapshot => {
        var firestoreTaskList = [];
        snapshot.forEach(doc => {
          firestoreTaskList.push(doc.data().data);
        });
        this.data = firestoreTaskList;
        this.isLoading = false;
        this.sort(); // Initial sorting alphabetical
        this.sortIsCompleted(); // Initial sorting based on task completed
      });
    },
    deteleTaskFirestore: function(id) {
      var filteredAry = this.data.filter(e => e.id !== id);
      this.data = filteredAry; // Deletes the task from local state
      var dbQuery = db.collection("to-do").where("data.id", "==", id);
      dbQuery.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          doc.ref.delete(); // Deletes the task from firestore
        });
      });
    },
    completeTaskFirestore: function(todo) {
      // Updating the object
      var updateValue = {
        ...todo,
        isCompleted: !todo.isCompleted
      };
      // Updating local state
      var completedIndex = this.data.findIndex(obj => obj.id == todo.id);
      this.data[completedIndex].isCompleted = !todo.isCompleted;
       // Updating firestore collection
      var docRef = db.collection("to-do").doc(todo.id);
      return docRef
        .update({
          data: updateValue
        })
        .then(function() {
          console.log("Document successfully updated!");
        })
        .catch(function(error) {
          console.error("Error updating document: ", error);
        });
    },
    editTaskFirestore: function(todo) {
      var updateValue = {
        ...todo,
        edit: !todo.isCompleted
      };
      // Updating local state
      var editIndex = this.data.findIndex(obj => obj.id == todo.id);
      this.data[editIndex].edit = !todo.edit;
      // Updating firestore collection
      var docRef = db.collection("to-do").doc(todo.id);
      return docRef
        .update({
          data: updateValue
        })
        .then(function() {
          console.log("Document successfully updated!");
        })
        .catch(function(error) {
          console.error("Error updating document: ", error);
        });
    },
    updateFirestore: function(todo) {
      var updateValue = {
        ...todo,
        task: todo.task,
        edit: true
      };
       // Updating local state
      var updateIndex = this.data.findIndex(obj => obj.id == todo.id);
      this.data[updateIndex].task = todo.task;
      this.data[updateIndex].edit = true;
       // Updating firestore collection
      var docRef = db.collection("to-do").doc(todo.id);
      return docRef
        .update({
          data: updateValue
        })
        .then(function() {
          console.log("Document successfully updated!");
        })
        .catch(function(error) {
          console.error("Error updating document: ", error);
        });
    },
    sortIsCompleted: function() {
      // Sorting on isCompleted
      this.data.sort(function(x, y) {
        return x.isCompleted === y.isCompleted ? 0 : !x.isCompleted ? -1 : 1;
      });
    },
    sort: function() {
      // Sorting on task alphabetically
      this.data.sort(function(a, b) {
        if (a.task < b.task) {
          return -1;
        }
        if (a.task > b.task) {
          return 1;
        }
        return 0;
      });
    }
  },
  created() {
    this.getTaskFromFirestore();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.todo-container {
  width: 55%;
  min-width: 50%;
  color: #dddddd

}
.title-header > span:nth-child(1){
  color:#ea5455
}
.title-header > span:nth-child(2){
  color:#158467
}
.title-header > span:nth-child(3){
  color:#07689f
}
.title-header > span:nth-child(4){
  color:#f0a500
}
.header {
  display: flex;
  justify-content: flex-end;
}
.title-header {
  position: absolute;
  left:17vw
}
.sort-header {
  cursor: pointer;
  font-size: 4em;
  margin: 0;
  margin-right: 1vw;
  margin-top: 15px;
  color: #07689f;
}
.header h1 {
  /* transform: scale(1.2); */
  font-size: 2.5em;
}
.loader {
  /* position: absolute;
  /* top: 50%;
  left: 50%; */
  /* transform: translate(-50%, -50%);  */
  background-color: white;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

}
.loader img {
  width: 12em;
  height: 12em;
}
.divider {
  border-top: 1px solid #f0a500;
  border-bottom: 1px solid #f0a500;
  height: 10px;
  width: 90%;
  position: absolute;
  left: 0;
}
::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: #dddddd;
  /* opacity: 1; Firefox */
}
.divider-two {
  border-top: 1px solid #f0a500;
  border-bottom: 1px solid #f0a500;
  height: 10px;
  width: 80vw;
  transform: rotate(90deg);
  position: absolute;
  right: -10vw;
}

.add-new-input input {
  border-right: none;
  border-left: none;
  border-top: 10px solid #f0a500;
  border-bottom: 10px solid #f0a500;
  border-width: 100%;
  width: 100%;
  height: 50px;
  font-size: 19px;
  margin-top: 15px;
  font-size: 1.5em;
  font-weight: 700;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  outline: none;
  border-radius: 0;
  color: white
}
/* Media query for screen less than 700px */
@media only screen and (max-device-width: 700px) and (-webkit-min-device-pixel-ratio: 2) {
  .todo-container {
    width: 90%;
    min-width: 70%;
  }
  .header h1 {
    font-size: 10vw;
    margin-bottom: 0px;
    margin-top: 0px;
  }
  .sort-header {
    font-size: 12vw !important;
    margin: 0;
    /* margin-top: 20px; */
  }
  .divider {
    width: 100%;
  }
  .divider-two{
    display: none;
    right: -24vw;
  }
  .title-header {
    left: 8vw;
  }
}
</style>
