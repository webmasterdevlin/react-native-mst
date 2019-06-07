import { types, flow, destroy } from "mobx-state-tree";
import { TodoType, TodoInitialState } from "../models/TodoType";
import {
  getTodos,
  postTodo,
  putTodo,
  deleteTodo
} from "../services/TodoService";

const TodoModel = types.model("TodoModel", TodoType);
const TodoStore = types
  .model("TodoStore", {
    todos: types.maybeNull(types.array(TodoModel)),
    todo: types.maybeNull(TodoModel),
    isFetching: types.boolean
  })
  .actions(self => ({
    loadTodos: flow(function*() {
      self.isFetching = true;
      try {
        self.todos = (yield getTodos()).data;
      } catch (error) {
        alert(error.message);
      }
      self.isFetching = false;
    }),
    createTodo: flow(function*(newTodo) {
      self.isFetching = true;
      try {
        const { data } = yield postTodo(newTodo);
        self.todos.unshift(data);
      } catch (error) {
        alert(error.message);
      }
      self.isFetching = false;
    }),
    strikethroughTodo: flow(function*(todo) {
      self.isFetching = true;
      try {
        todo.isDone = !todo.isDone;
        yield putTodo(todo);
        const index = self.todos.findIndex(t => t.id === todo.id);
        self.todos[index] = todo;
      } catch (error) {
        alert(error.message);
      }
      self.isFetching = false;
    }),
    removeTodo: flow(function*(todo) {
      self.isFetching = true;
      try {
        yield deleteTodo(todo);
        destroy(todo);
      } catch (error) {
        alert(error.message);
      }
      self.isFetching = false;
    })
  }))
  .views(self => ({
    get remainingTodos() {
      return (
        self.todos.length - self.todos.filter(t => t.isDone === true).length
      );
    }
  }))
  .create({
    todos: [],
    todo: TodoInitialState,
    isFetching: false
  });

export default TodoStore;
