import { useState, useEffect } from "react";

// Auth
import AuthForm from "./components/AuthForm";
import AuthModal from "./components/AuthModal";

// Layout
import Header from "./components/Header";
import FilterBar from "./components/FilterBar";

// Tasks
import AddTaskForm from "./components/AddTaskForm";
import TaskList from "./components/TaskList";
import EditModal from "./components/EditModal";

// Pages
import NotFound from "./components/NotFound";

function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem("token"));
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editingTask, setEditingTask] = useState(null);

  // Load tasks (later replace with API)
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tasks") || "[]");
    setTasks(saved);
  }, []);

  // Save tasks
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Auth screen
  if (!auth) {
    return (
      <AuthModal>
        <AuthForm setAuth={setAuth} />
      </AuthModal>
    );
  }

  // Add task
  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  // Delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // Update task
  const updateTask = (updatedTask) => {
    setTasks(
      tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    setEditingTask(null);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <div className="app-root">
      <Header setAuth={setAuth} />

      <main className="app-main">
        <AddTaskForm addTask={addTask} />
        <FilterBar filter={filter} setFilter={setFilter} />

        <TaskList
          tasks={filteredTasks}
          onDelete={deleteTask}
          onEdit={setEditingTask}
        />
      </main>

      {editingTask && (
        <EditModal
          task={editingTask}
          onUpdate={updateTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}

export default App;
