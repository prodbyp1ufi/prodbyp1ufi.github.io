import Task from "../models/task";
import { db } from "../firebase-config";
import {
  query,
  collection,
  where,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";

export default class TaskListAction {
  static async getTaskList(cardId, setTaskList) {
    onSnapshot(
      query(collection(db, "taskList"), where("card", "==", cardId)),
      (docs) => {
        let taskList = [];
        docs.forEach((doc) => {
          const taskData = doc.data();
          const task = new Task(
            doc.id,
            taskData.task,
            taskData.card,
            taskData.sortIndex,
            taskData.isComplete
          );
          taskList.push(task);
        });
        taskList.sort((a, b) => {
          return a.sortIndex - b.sortIndex;
        });
        setTaskList(taskList);
      }
    );
  }
  static async getCardTaskList(cardId){
    const taskList = []
    await getDocs(query(collection(db, 'taskList'), where('card', '==', cardId))).then(
      taskListDocs=>{
        taskListDocs.forEach(doc=>{
          const taskData = doc.data();
          const task = new Task(
            doc.id,
            taskData.task,
            taskData.card,
            taskData.sortIndex,
            taskData.isComplete
          );
          taskList.push(task);
        })
      }
    )
    taskList.sort((a, b) => {
      return a.sortIndex - b.sortIndex;
    });
    return taskList
  }
  static async updateTaskCaption(taskId, newTaskCaption) {
    await updateDoc(doc(collection(db, "taskList"), taskId), {
      task: newTaskCaption,
    });
  }
  static async updateTaskComplete(taskId, isComplete) {
    await updateDoc(doc(collection(db, "taskList"), taskId), {
      isComplete: isComplete,
    });
  }
  static async updateTaskSortIndex(taskId, sortIndex) {
    await updateDoc(doc(collection(db, "taskList"), taskId), {
      sortIndex: sortIndex,
    });
  }
  static async addTask(task) {
    await addDoc(collection(db, "taskList"), {
      task: task.task,
      card: task.card,
      sortIndex: task.sortIndex,
      isComplete: task.isComplete,
    });
  }
  static async deleteCardTasks(tasks) {
    for (let index = 0; index < tasks.length; index++) {
      await deleteDoc(doc(collection(db, "taskList"), tasks[index].id));
    }
  }
  static async deleteTask(task) {
    await deleteDoc(doc(collection(db, "taskList"), task.id));
  }
}
