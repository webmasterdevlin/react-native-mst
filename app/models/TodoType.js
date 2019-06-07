import { types } from "mobx-state-tree";

export const TodoType = {
  id: types.optional(types.identifier, ""),
  isDone: false
  // and the rest...
};

export const TodoInitialState = {};
