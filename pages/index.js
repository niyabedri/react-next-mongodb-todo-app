import axios from "axios";
import { useState } from "react";
import styles from "../styles/Home.module.css";
const url = "http://localhost:3000/api/task";

export default function Home(props) {
  const [tasks, setTasks] = useState(props.tasks);
  const [task, setTask] = useState({ task: "" });

  const handleChange = ({ currentTarget: input }) => {
    input.value === ""
      ? setTask({ task: "" })
      : setTask((prev) => ({ ...prev, task: input.value }));
  };

  const editTask = (id) => {
    const currentTask = tasks.filter((task) => task._id === id);
    setTask(currentTask[0]);
  };

  const addTask = async (e) => {
    e.preventDefault();

    try {
      if (task._id) {
        const { data } = await axios.put(url + "/" + task._id, {
          task: task.task,
        });
        const originalTasks = [...tasks];
        const index = originalTasks.findIndex((t) => t._id === task._id);
        originalTasks[index] = data.data;
        setTasks(originalTasks);
        setTask({ task: "" });

        console.log(data.message);
      } else {
        const { data } = await axios.post(url + "/", task);
        setTasks((prev) => [...prev, data.data]);
        setTask({ task: "" });
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateTask = async (id) => {
    try {
      const originalTasks = [...tasks];
      const index = originalTasks.findIndex((t) => t._id === id);
      let f = originalTasks[index].completed;
      const { data } = await axios.put(url + "/" + id, {
        completed: !originalTasks[index].completed,
      });
      originalTasks[index] = data.data;
      setTasks(originalTasks);
      console.log(data.message);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteTask = async (id) => {
    try {
      const { data } = await axios.delete(url + "/" + id);
      setTasks((prev) => prev.filter((task) => task._id !== id));
      console.log(data.message);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.Head}>TO-DO</h1>
      <div className={styles.container}>
        <form onSubmit={addTask} className={styles.form_container}>
          <input
            type="text"
            className={styles.input}
            value={task.task}
            placeholder="Task to be done.."
            onChange={handleChange}
          />
          <button type="submit" className={styles.submit_btn}>
            {task._id ? "Update" : "Add"}
          </button>
        </form>
        {tasks.map((task) => (
          <div className={styles.task_container} key={task && task._id}>
            <input
              type="checkbox"
              className={styles.check_box}
              checked={task && task.completed ? task.completed : false}
              onChange={() => updateTask(task._id)}
            />
            <p
              className={
                task && task.completed
                  ? styles.task_text + " " + styles.line_through
                  : styles.task_text
              }
            >
              {task && task.task ? task.task : "9"}
              <button
                onClick={() => {
                  editTask(task._id);
                }}
                className={styles.edit_task}
              >
                &#9998;
              </button>
              <button
                onClick={() => {
                  deleteTask(task._id);
                }}
                className={styles.remove_task}
              >
                &#10006;
              </button>
            </p>
          </div>
        ))}
        {tasks.length === 0 && <h2 className={styles.no_task}> No tasks</h2>}
      </div>
    </main>
  );
}

export const getServerSideProps = async () => {
  const { data } = await axios.get(url);

  let t = data.data;

  return {
    props: {
      tasks: data.data,
    },
  };
};
