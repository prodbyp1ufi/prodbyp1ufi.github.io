import "./tasklist.css";
import removeImg from "../../resources/remove.png";
import { useState } from "react";
import TaskListAction from "../../actions/taskListAction";
import Task from "../../models/task";
export default function TaskList({ tasks, cardId }) {
  const [edit, setEdit] = useState("");
  const [currentTask, setCurrentTask] = useState(null);
  const [newTaskCaption, setNewTaskCaption] = useState("");

  function resizeTextArea(e) {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  }
  async function updateTaskCaption(e, oldCaption) {
    const newCaption = e.target.value;
    if (newCaption !== oldCaption) {
      await TaskListAction.updateTaskCaption(edit, newCaption);
    }
    setEdit("");
  }
  async function updateTaskComplete(e, taskId) {
    await TaskListAction.updateTaskComplete(taskId, e.target.checked);
  }
  async function dropOnTask(e, task) {
    e.preventDefault();
    await TaskListAction.updateTaskSortIndex(task.id, currentTask.sortIndex);
    await TaskListAction.updateTaskSortIndex(currentTask.id, task.sortIndex);
    setCurrentTask(null);
  }
  function dragStartTask(e, task) {
    if (e.target.className === "task") {
      e.target.style.backgroundColor = "#ebda88";
      setCurrentTask(task);
    }
  }
  function dragEndTask(e) {
    if (e.target.className === "task") {
      e.target.style.backgroundColor = "#091e420a";
    }
  }
  async function addNewTask() {
    if (newTaskCaption !== "") {
      const sortIndex =
        tasks.length > 0 ? tasks[tasks.length - 1].sortIndex + 1 : 1;
      const newTask = new Task("", newTaskCaption, cardId, sortIndex, false);
      await TaskListAction.addTask(newTask).then((result) => {
        const newCommentArea = document.getElementById('add-new-task-area')
        newCommentArea.style.height = '30px'
        setNewTaskCaption("");
      });
    }
  }
  async function removeTask(task) {
    await TaskListAction.deleteTask(task);
  }
  return (
    <div className="task-list-container">
      {tasks.map((t) => {
        return (
          <div
            draggable={edit === ""}
            onDrop={(e) => {
              dropOnTask(e, t);
            }}
            onDragStart={(e) => {
              dragStartTask(e, t);
            }}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDragEnd={(e) => {
              dragEndTask(e);
            }}
            key={t.id}
            onChange={(e) => {
              updateTaskComplete(e, t.id);
            }}
            className="task"
          >
            <div className="task__text" draggable={false}>
              <input type="checkbox" defaultChecked={t.isComplete} />
              {edit === t.id ? (
                <textarea
                  draggable={false}
                  onBlur={(e) => {
                    updateTaskCaption(e, t.task);
                  }}
                  onChange={(e) => {
                    resizeTextArea(e);
                  }}
                  className="edit-task"
                  autoFocus
                  onFocus={(e) => {
                    e.target.setSelectionRange(0, 512);
                  }}
                  defaultValue={t.task}
                />
              ) : (
                <div
                  style={t.isComplete ? { textDecoration: "line-through" } : {}}
                  onClick={() => setEdit(t.id)}
                  className="task-caption"
                >
                  {t.task}
                </div>
              )}
            </div>
            <img
              className="task__img"
              src={removeImg}
              onClick={() => removeTask(t)}
            ></img>
          </div>
        );
      })}
      <div className="add-new-task">
        <textarea
          id="add-new-task-area"
          value={newTaskCaption}
          onChange={(e) => {
            resizeTextArea(e);
            setNewTaskCaption(e.target.value);
          }}
        />
        <input
          type="button"
          value="Добавить"
          onClick={() => {
            addNewTask();
          }}
        />
      </div>
    </div>
  );
}
