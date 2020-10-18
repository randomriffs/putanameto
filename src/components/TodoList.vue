<template>
  <div class="todo-list">
    <!-- Loads when the task list is empty  -->
    <div v-if="!todoLists.length" class="empty-list">
      <i class="fa fa-calendar-check-o"></i>
      <h1>Add your first todo</h1>
      <h3>What do you want to get done today ?</h3>
    </div>
    <!-- Loades when task list available -->
    <div v-else>
      <ul>
        <li v-for="todo in todoLists" :key="todo.id">
          <div class="list-check-container">
            <!-- Task list mode -->
            <div
              class="list-check"
              v-bind:class="{ lineThrough: todo.isCompleted }"
              v-if="todo.edit"
            >
              <!-- -->
              <label class="container">
                <input
                  type="checkbox"
                  id="checkbox"
                  v-model="todo.isCompleted"
                  @click="taskCompleted(todo)"
                  class="task-checkbox checkbox-primary"
                  :checked="todo.isCompleted"
                />
                <span class="checkmark"></span>
              </label>
              <span @click="handleEdit(todo)">{{todo.task}} <span class="time">{{todo.time}}</span></span>
            </div>
            <!-- Task edit mode (onclicking on top of the item list) -->
            <div v-else class="list-check-update">
              <input
                :ref="todo.id"
                type="text"
                v-focus
                @blur="updateTask(todo)"
                v-model="todo.task"
                @keyup.enter="updateTask(todo)"
              />
            </div>
            <!-- Deleted span -->
            <span @click="deleteTask(todo.id)" class="delete-list">x</span>
          </div>
        </li>
      </ul>
    </div>
    <!-- Add new input container. New task is added, when the input filed is out of focus or blur.
    And when user hit enter. No button action integrated-->
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
export default {
  name: "TodoList",
  props: {
    todoLists: Array
  },
  data: function() {
    return {
      task: "",
      placeHolder: "+ List Item" // Initial place holder
    };
  },
  directives: {
    focus: {
      inserted: function(el) {
        el.focus();
      }
    }
  },
  methods: {
    // Event triggers from child to parent for passing data
    addTask: function() {
      this.placeHolder = "+ List Item";
      if (this.task) {
        this.$emit("clicked", this.task);
        this.task = "";
      }
    },
    deleteTask: function(id) {
      this.$emit("delete-task", id);
    },
    taskCompleted: function(id) {
      this.$emit("completed-task", id);
    },
    handleEdit: function(todo) {
      this.$emit("edit-task", todo);
    },
    updateTask: function(todo) {
      this.$emit("update-task", todo);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.lineThrough {
  text-decoration: line-through;
}
ul {
  list-style-type: none;
  padding-left: 10px !important;
  margin-top: 0;
  margin-bottom: 20px;
}
.list-check {
  font-size: 2.5em;
  font-weight: 700;
  width: 42vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}
.task-checkbox {
  transform: scale(2);
  margin-right: 30px;
  vertical-align: middle;
  margin-bottom: 5px;
}
.list-check-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.delete-list {
  transform: scale(2);
  margin-right: 2.7vw;
  cursor: pointer;
  font-size: 2em;
  font-weight: 600;
}
.add-new-input input {
  border-right: none;
  border-left: none;
  border-top: 10px solid #2d3e50;
  border-bottom: 10px solid #2d3e50;
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
}
.list-check-update input {
  color: black;
  border-top: none;
  border-bottom: none;
  border-right: none;
  border-left: none;
  border-width: 100%;
  width: 100%;
  font-size: 2.41em !important;
  font-weight: 800 !important;
  outline: none;
  border-radius: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
.todo-list {
  margin-top: 45px;
}
li {
  margin-bottom: 15px;
}
.empty-list {
  text-align: center;
  margin: 4em 0;
}
.fa-calendar-check-o {
  font-size: 8em;
}
/* checkbox styling */
.container {
  /* display: block; */
  position: relative;
  padding-left: 35px;
  margin-bottom: 44px;
  margin-right: 10px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.container span {
  width: 100%;
    display: flex;
    justify-content: space-between;
}
.time{
  font-size: .3em;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
/* Hide the browser's default checkbox */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 30px;
  width: 30px;
  background-color: black;
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: black;
}

/* When the checkbox is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color: black;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
  left: 9px;
  top: 2px;
  width: 8px;
  height: 17px;
  border: solid white;
  border-width: 0 4px 4px 0;
  transform: rotate(45deg);
}

/* Media query for screen less than 700px */
@media only screen and (max-device-width: 700px) and (-webkit-min-device-pixel-ratio: 2) {
  .list-check {
    font-size: 6vw;
  }
  .delete-list {
    font-size: 6vw;
  }
  .task-checkbox {
    height: 3vw;
    margin-right: 10px;
  }
  .addNewInput input {
    font-size: 6vw;
  }
  .fa-calendar-check-o {
    font-size: 30vw;
  }
  .empty-list h1 {
    font-size: 9vw;
  }
  .empty-list h3 {
    font-size: 5vw;
  }
  .list-check-update input {
    font-size: 5vw;
    padding-left: 50px;
    padding-bottom: 0px;
  }
  .checkmark {
    height: 25px;
    width: 25px;
  }
}
</style>
