import React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  createTask,
  fetchProjects,
  fetchTasks,
  updateTaskStatus,
  handleApiError,
} from "../api";
import { useAuth } from "../auth.jsx";

const columns = [
  {
    key: "todo",
    title: "To Do",
    color: "border-gray-300 bg-gray-50",
    headerColor: "bg-gray-100 text-gray-700",
  },
  {
    key: "in_progress",
    title: "In Progress",
    color: "border-yellow-300 bg-yellow-50",
    headerColor: "bg-yellow-100 text-yellow-700",
  },
  {
    key: "completed",
    title: "Completed",
    color: "border-green-300 bg-green-50",
    headerColor: "bg-green-100 text-green-700",
  },
];

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [usersInProject, setUsersInProject] = useState([]);
  const [title, setTitle] = useState("");
  const [project, setProject] = useState("");
  const [assignees, setAssignees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedCols, setExpandedCols] = useState({});

  function toggleExpand(colKey) {
    setExpandedCols((prev) => ({ ...prev, [colKey]: !prev[colKey] }));
  }
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const [tasksData, projectsData] = await Promise.all([
          fetchTasks(),
          fetchProjects(),
        ]);
        setTasks(tasksData);
        setProjects(projectsData);
        if (projectsData[0]) setProject(projectsData[0]._id);
      } catch (error) {
        console.error("Failed to load data:", error);
        setError(handleApiError(error));
      }
    };
    loadData();
  }, []);

  // When project changes, derive members from populated projects API
  useEffect(() => {
    const selected = projects.find((pr) => pr._id === project);
    const members = selected?.team?.members || [];
    setUsersInProject(members);
    // Reset assignees that are not in current project
    setAssignees((prev) =>
      prev.filter((id) => members.some((m) => m._id === id))
    );
  }, [project, projects]);

  const grouped = useMemo(() => {
    return columns.map((c) => ({
      key: c.key,
      title: c.title,
      color: c.color,
      headerColor: c.headerColor,
      items: tasks.filter((t) => t.status === c.key),
    }));
  }, [tasks]);

  async function onCreate(e) {
  e.preventDefault();
  if (!title.trim()) {
    setError("Task title is required");
    return;
  }

  setIsLoading(true);
  setError("");

  try {
    // Create the task
    await createTask({ title, project, assignees });

    // Re-fetch tasks to refresh the board
    const tasksData = await fetchTasks();
    setTasks(tasksData);

    // Reset input fields
    setTitle("");
    setAssignees([]);
  } catch (error) {
    console.error("Failed to create task:", error);
    setError(handleApiError(error));
  } finally {
    setIsLoading(false);
  }
}


  function handleAssigneeChange(userId, checked) {
    if (checked) {
      setAssignees((prev) => [...prev, userId]);
    } else {
      setAssignees((prev) => prev.filter((id) => id !== userId));
    }
  }

  async function moveTask(task, status) {
    try {
      const updated = await updateTaskStatus(task._id, status);
      setTasks((prev) =>
        prev.map((x) => (x._id === updated._id ? updated : x))
      );
    } catch (error) {
      console.error("Failed to update task:", error);
      setError(handleApiError(error));
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Board</h1>
          <p className="text-gray-600 mt-2">
            Manage and track your project tasks
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
        </div>
      </div>

      {/* Create Task Form - Only for Admin and Project Manager */}
      {(user?.role === "admin" || user?.role === "project_manager") && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Create New Task
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={onCreate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="task-title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Task Title
                </label>
                <input
                  id="task-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Enter task title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="task-project"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Project
                </label>
                <select
                  id="task-project"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </div>
                  ) : (
                    "Create Task"
                  )}
                </button>
              </div>
            </div>

            {/* Assign Members */}
            {usersInProject.filter((u) => u.role === "team_member").length >
              0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Assign to Team Members
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {usersInProject
                    .filter((u) => u.role === "team_member")
                    .map((user) => (
                      <label
                        key={user._id}
                        className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={assignees.includes(user._id)}
                          onChange={(e) =>
                            handleAssigneeChange(user._id, e.target.checked)
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {user.name
                                ? user.name.charAt(0).toUpperCase()
                                : "?"}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {user.name || "Unknown"}
                          </span>
                        </div>
                      </label>
                    ))}
                </div>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Message for Team Members */}
      {user?.role === "team_member" && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center">
            <svg
              className="w-6 h-6 text-blue-600 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="text-lg font-medium text-blue-900">
                View-Only Access
              </h3>
              <p className="text-blue-700 mt-1">
                You can view all tasks here. To update task status, go to{" "}
                <strong>"My Tasks"</strong> page. Contact your project manager
                to create new tasks.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="grid gap-6 lg:grid-cols-3">
        {grouped.map((col) => (
          <div
            key={col.key}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className={`px-6 py-4 ${col.headerColor}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm uppercase tracking-wide">
                  {col.title}
                </h3>
                <span className="px-2 py-1 bg-white bg-opacity-50 rounded-full text-xs font-medium">
                  {col.items.length}
                </span>
              </div>
            </div>

            <div className="p-6 min-h-96">
              <div className="space-y-4">
                {col.items.map((task) => (
                  <div
                    key={task._id}
                    className={`p-4 rounded-lg border-2 ${col.color} hover:shadow-md transition-shadow cursor-pointer`}
                  >
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {task.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Project: {task.project?.name || "No project"}
                      </p>
                      {task.assignees && task.assignees.length > 0 && (
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-xs text-gray-500">
                            Assigned to:
                          </span>
                          <div className="flex -space-x-2">
                            {task.assignees.slice(0, 3).map((assignee) => (
                              <div
                                key={assignee._id}
                                className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center border-2 border-white"
                              >
                                <span className="text-blue-600 font-semibold text-xs">
                                  {assignee.name
                                    ? assignee.name.charAt(0).toUpperCase()
                                    : "?"}
                                </span>
                              </div>
                            ))}
                            {task.assignees.length > 3 && (
                              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white">
                                <span className="text-gray-600 font-semibold text-xs">
                                  +{task.assignees.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Only show status change buttons for Admin and Project Manager */}
                    {(user?.role === "admin" ||
                      user?.role === "project_manager") && (
                      <div className="flex flex-wrap gap-2">
                        {columns
                          .filter((c) => c.key !== task.status)
                          .map((c) => (
                            <button
                              key={c.key}
                              onClick={() => moveTask(task, c.key)}
                              className="px-3 py-1 bg-white bg-opacity-70 text-xs font-medium rounded-full hover:bg-opacity-100 transition-colors border border-gray-200"
                            >
                              Move to {c.title}
                            </button>
                          ))}
                      </div>
                    )}

                    {/* Show message for team members */}
                    {user?.role === "team_member" && (
                      <div className="text-xs text-gray-500 italic">
                        Go to "My Tasks" to update status
                      </div>
                    )}
                  </div>
                ))}

                {col.items.length === 0 && (
                  <div className="text-center py-8">
                    <svg
                      className="w-12 h-12 text-gray-400 mx-auto mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <p className="text-sm text-gray-500">
                      No tasks in this column
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
