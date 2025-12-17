// import React from 'react';
// import { useEffect, useMemo, useState } from 'react';
// import { fetchMyTasks, updateTaskStatus, handleApiError } from '../api';
// import { useAuth } from '../auth.jsx';

// const columns = [
//   { key: 'todo', title: 'To Do', color: 'border-gray-300 bg-gray-50', headerColor: 'bg-gray-100 text-gray-700' },
//   { key: 'in_progress', title: 'In Progress', color: 'border-yellow-300 bg-yellow-50', headerColor: 'bg-yellow-100 text-yellow-700' },
//   { key: 'completed', title: 'Completed', color: 'border-green-300 bg-green-50', headerColor: 'bg-green-100 text-green-700' },
// ];

// export default function MyTasksPage() {
//   const { user } = useAuth();
//   const [tasks, setTasks] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchMyTasksData = async () => {
//       try {
//         // console.log(user.name.toUpperCase());
//         setIsLoading(true);
//         setError('');
//         const data = await fetchMyTasks();
//         setTasks(data);
//       } catch (error) {
//         console.error('Failed to fetch my tasks:', error);
//         setError(handleApiError(error));
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     fetchMyTasksData();
//   }, []);

//   const grouped = useMemo(() => {
//     return columns.map((c) => ({
//       key: c.key,
//       title: c.title,
//       color: c.color,
//       headerColor: c.headerColor,
//       items: tasks.filter(
//         (t) => t.status?.toString().toLowerCase() === c.key.toLowerCase()
//       ),
//     }));
//   }, [tasks]);
  

//   // Check if user is assigned to a task
//   const isUserAssignedToTask = (task) => {
//     if (!user || !task.assignees?.length) return false;
  
//     return task.assignees.some((assignee) => {
//       const assigneeId = assignee?._id?.toString()?.toUpperCase();
//       const userId = user._id?.toString()?.toUpperCase();
//       const assigneeName = assignee?.name?.toUpperCase();
//       const userName = user?.name?.toUpperCase();
  
//       return (assigneeId && userId && assigneeId === userId) ||
//              (assigneeName && userName && assigneeName === userName);
//     });
//   };
  
  


//   // Update task status
//   const handleStatusUpdate = async (task, newStatus) => {
//     if (!isUserAssignedToTask(task)) {
//       setError('You can only update tasks assigned to you');
//       return;
//     }
  
//     try {
//       const updated = await updateTaskStatus(task._id, newStatus);
  
//       // Update state immediately
//       setTasks((prevTasks) =>
//         prevTasks.map((t) =>
//           t._id === task._id ? { ...t, status: newStatus } : t
//         )
//       );
  
//       setError('');
//     } catch (error) {
//       console.error('Failed to update task status:', error);
//       setError(handleApiError(error));
//     }
//   };
  

//   const totalTasks = tasks.length;
//   const completedTasks = tasks.filter(t => t.status === 'completed').length;
//   const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-96">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading your tasks...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
//           <p className="text-gray-600 mt-2">Tasks assigned to you across all projects</p>
//           <p className="text-sm text-blue-600 mt-1">
//             💡 You can update the status of tasks assigned to you directly from this page
//           </p>
//         </div>
//         <div className="text-sm text-gray-500">
//           {totalTasks} {totalTasks === 1 ? 'task' : 'tasks'}
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600 mb-1">Total Tasks</p>
//               <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
//             </div>
//             <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//               <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//               </svg>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
//               <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
//             </div>
//             <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
//               <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600 mb-1">Completion Rate</p>
//               <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
//             </div>
//             <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//               <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//               </svg>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <div className="flex">
//             <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             <p className="text-red-700 text-sm">{error}</p>
//           </div>
//         </div>
//       )}

//       {/* Kanban Board */}
//       <div className="grid gap-6 lg:grid-cols-3">
//         {grouped.map((col) => (
//           <div key={col.key} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//             <div className={`px-6 py-4 ${col.headerColor}`}>
//               <div className="flex items-center justify-between">
//                 <h3 className="font-semibold text-sm uppercase tracking-wide">{col.title}</h3>
//                 <span className="px-2 py-1 bg-white bg-opacity-50 rounded-full text-xs font-medium">
//                   {col.items.length}
//                 </span>
//               </div>
//             </div>
            
//             <div className="p-6 min-h-96">
//               <div className="space-y-4">
//                 {col.items.map((task) => (
//                   <div key={task._id} className={`p-4 rounded-lg border-2 ${col.color} hover:shadow-md transition-shadow`}>
//                     <div className="mb-3">
//                       <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
//                       <div className="space-y-1 text-sm text-gray-600">
//                         <div className="flex items-center">
//                           <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//                           </svg>
//                           Project: {task.project?.name || 'No project'}
//                         </div>
//                         <div className="flex items-center">
//                           <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//                           </svg>
//                           Team: {task.project?.team?.name || 'No team'}
//                         </div>
//                         {task.createdAt && (
//                           <div className="flex items-center">
//                             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                             </svg>
//                             Created: {new Date(task.createdAt).toLocaleDateString()}
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Status Update Buttons - Only for assigned tasks */}
//                     {isUserAssignedToTask(task) && (
//                       <div className="flex flex-wrap gap-2">
//                         {columns
//                           .filter((c) => c.key !== task.status)
//                           .map((c) => (
//                             <button
//                               key={c.key}
//                               onClick={() => handleStatusUpdate(task, c.key)}
//                               className="px-3 py-1 bg-white bg-opacity-70 text-xs font-medium rounded-full hover:bg-opacity-100 transition-colors border border-gray-200"
//                             >
//                               Move to {c.title}
//                             </button>
//                           ))}
//                       </div>
//                     )}

//                     {/* Show if user is not assigned */}
//                     {!isUserAssignedToTask(task) && (
//                       <div className="text-xs text-gray-500 italic">
//                         You are not assigned to this task
//                       </div>
//                     )}
//                   </div>
//                 ))}
                
//                 {col.items.length === 0 && (
//                   <div className="text-center py-8">
//                     <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                     </svg>
//                     <p className="text-sm text-gray-500">No tasks in this column</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Empty State */}
//       {totalTasks === 0 && !error && (
//         <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
//           <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//           </svg>
//           <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks assigned to you</h3>
//           <p className="text-gray-500 mb-4">You don't have any tasks assigned yet. Check back later or ask your team lead to assign you some tasks.</p>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useEffect, useMemo, useState } from 'react';
import { fetchMyTasks, updateTaskStatus, handleApiError } from '../api';
import { useAuth } from '../auth.jsx';

const columns = [
  { key: 'todo', title: 'To Do', color: 'border-gray-300 bg-gray-50', headerColor: 'bg-gray-100 text-gray-700' },
  { key: 'in_progress', title: 'In Progress', color: 'border-yellow-300 bg-yellow-50', headerColor: 'bg-yellow-100 text-yellow-700' },
  { key: 'completed', title: 'Completed', color: 'border-green-300 bg-green-50', headerColor: 'bg-green-100 text-green-700' },
];

export default function MyTasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyTasksData = async () => {
      try {
        setIsLoading(true);
        setError('');
        const data = await fetchMyTasks();
        setTasks(data);
      } catch (error) {
        console.error('Failed to fetch my tasks:', error);
        setError(handleApiError(error));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMyTasksData();
  }, []);

  const grouped = useMemo(() => {
    return columns.map((c) => ({
      key: c.key,
      title: c.title,
      color: c.color,
      headerColor: c.headerColor,
      items: tasks.filter(
        (t) => t.status?.toString().toLowerCase() === c.key.toLowerCase()
      ),
    }));
  }, [tasks]);

  // Update task status
  const handleStatusUpdate = async (task, newStatus) => {
    try {
      await updateTaskStatus(task._id, newStatus);

      // Update state immediately
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t._id === task._id ? { ...t, status: newStatus } : t
        )
      );

      setError('');
    } catch (error) {
      console.error('Failed to update task status:', error);
      setError(handleApiError(error));
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-600 mt-2">Tasks assigned to you across all projects</p>
          <p className="text-sm text-blue-600 mt-1">
            💡 You can update the status of tasks directly from this page
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {totalTasks} {totalTasks === 1 ? 'task' : 'tasks'}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="grid gap-6 lg:grid-cols-3">
        {grouped.map((col) => (
          <div key={col.key} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className={`px-6 py-4 ${col.headerColor}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm uppercase tracking-wide">{col.title}</h3>
                <span className="px-2 py-1 bg-white bg-opacity-50 rounded-full text-xs font-medium">
                  {col.items.length}
                </span>
              </div>
            </div>
            
            <div className="p-6 min-h-96">
              <div className="space-y-4">
                {col.items.map((task) => (
                  <div key={task._id} className={`p-4 rounded-lg border-2 ${col.color} hover:shadow-md transition-shadow`}>
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          Project: {task.project?.name || 'No project'}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Team: {task.project?.team?.name || 'No team'}
                        </div>
                        {task.createdAt && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Created: {new Date(task.createdAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Update Buttons - Always visible */}
                    <div className="flex flex-wrap gap-2">
                      {columns
                        .filter((c) => c.key !== task.status)
                        .map((c) => (
                          <button
                            key={c.key}
                            onClick={() => handleStatusUpdate(task, c.key)}
                            className="px-3 py-1 bg-white bg-opacity-70 text-xs font-medium rounded-full hover:bg-opacity-100 transition-colors border border-gray-200"
                          >
                            Move to {c.title}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
                
                {col.items.length === 0 && (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-sm text-gray-500">No tasks in this column</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {totalTasks === 0 && !error && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks available</h3>
          <p className="text-gray-500 mb-4">There are no tasks yet. Check back later or ask your team lead to assign some tasks.</p>
        </div>
      )}
    </div>
  );
}


