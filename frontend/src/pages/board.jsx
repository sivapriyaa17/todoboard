import React, { useEffect, useState } from 'react';
import API from '../api';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:5000');
const columns = ['Todo', 'In Progress', 'Done'];

export default function Board() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, []);

  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium', status: 'Todo' });
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchData();
    socket.on('task_created', fetchData);
    socket.on('task_updated', fetchData);
    socket.on('task_deleted', fetchData);
  }, []);

  const fetchData = async () => {
    const [taskRes, logRes] = await Promise.all([
      API.get('/tasks'),
      API.get('/logs')
    ]);
    setTasks(taskRes.data);
    setLogs(logRes.data);
  };

  const handleAddTask = async () => {
    try {
      await API.post('/tasks', newTask);
      setNewTask({ title: '', description: '', priority: 'Medium', status: 'Todo' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add task');
    }
  };

  const handleEdit = (task) => setEditingTask(task);

  const submitEdit = async () => {
    try {
      await API.put(`/tasks/${editingTask._id}`, {
        ...editingTask,
        updatedAt: editingTask.updatedAt
      });
      setEditingTask(null);
      fetchData();
    } catch (err) {
      alert("Failed to update task: " + err.response?.data?.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      fetchData();
    } catch (err) {
      alert("Delete failed: " + err.response?.data?.message || err.message);
    }
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const task = tasks.find(t => t._id === draggableId);
    const updatedTask = { ...task, status: destination.droppableId, updatedAt: task.updatedAt };

    try {
      await API.put(`/tasks/${draggableId}`, updatedTask);
    } catch (err) {
      if (err.response?.status === 409) {
        const current = err.response.data.current;
        if (window.confirm("Conflict detected. Overwrite server version?")) {
          await API.put(`/tasks/${draggableId}`, { ...updatedTask, updatedAt: current.updatedAt });
        }
      }
    }
  };

  const grouped = columns.map(col => ({
    title: col,
    tasks: tasks.filter(t => t.status === col)
  }));

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Task Board</h1>

      {/* Task Form */}
      <div className="bg-white p-4 rounded shadow max-w-lg mx-auto mb-6 space-y-3">
        <h2 className="text-xl font-semibold">Add Task</h2>
        <input
          className="w-full p-2 border rounded"
          value={newTask.title}
          onChange={e => setNewTask({ ...newTask, title: e.target.value })}
          placeholder="Title"
        />
        <input
          className="w-full p-2 border rounded"
          value={newTask.description}
          onChange={e => setNewTask({ ...newTask, description: e.target.value })}
          placeholder="Description"
        />
        <select
          className="w-full p-2 border rounded"
          value={newTask.priority}
          onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <select
          className="w-full p-2 border rounded"
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
        >
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          onClick={handleAddTask}
        >
          Smart Assign
        </button>
      </div>

      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full space-y-2">
            <h2 className="text-lg font-semibold">Edit Task</h2>
            <input
              className="w-full p-2 border rounded"
              value={editingTask.title}
              onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
            />
            <textarea
              className="w-full p-2 border rounded"
              value={editingTask.description}
              onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
            />
            <select
              className="w-full p-2 border rounded"
              value={editingTask.priority}
              onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <select
              className="w-full p-2 border rounded"
              value={editingTask.status}
              onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <div className="flex justify-end gap-2 pt-2">
              <button className="bg-gray-300 px-3 py-1 rounded" onClick={() => setEditingTask(null)}>Cancel</button>
              <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={submitEdit}>Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Columns */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex flex-col sm:flex-row gap-4 overflow-x-auto">
          {grouped.map(group => (
            <Droppable droppableId={group.title} key={group.title}>
              {(provided) => (
                <div
                  className="flex-1 min-w-[250px] bg-gray-100 p-4 rounded shadow"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <h2 className="text-lg font-bold mb-3 text-center">{group.title}</h2>
                  {group.tasks.map((task, index) => (
                    <Draggable draggableId={task._id} index={index} key={task._id}>
                      {(provided, snapshot) => (
                        <div
                          className={`bg-white p-3 mb-3 rounded shadow-sm ${
                            snapshot.isDragging ? 'bg-blue-100' : ''
                          }`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <h4 className="font-semibold">{task.title}</h4>
                          <p className="text-sm">{task.description}</p>
                          <small className="text-gray-500 block">Assigned to: {task.assignedTo?.email}</small>
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => handleEdit(task)} className="text-blue-600 text-sm">Edit</button>
                            <button onClick={() => handleDelete(task._id)} className="text-red-600 text-sm">Delete</button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Activity Log */}
      <div className="mt-10 max-w-3xl mx-auto">
        <h3 className="text-xl font-semibold mb-2">Activity Log</h3>
        {logs.map(log => (
          <div className="border-b py-2 text-sm" key={log._id}>
            {log.user?.email} — {log.action} — {new Date(log.timestamp).toLocaleString()}
          </div>
        ))}
      </div>
    </div>
  );
}









