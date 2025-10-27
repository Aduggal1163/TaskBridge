import React, { useEffect, useState } from 'react';
import { createTeam, fetchTeams, fetchUsers, addTeamMember, handleApiError } from '../api';
import { useAuth } from '../auth.jsx';

export default function TeamsPage() {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedUser, setSelectedUser] = useState('');
  const [viewingTeam, setViewingTeam] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setError('');
        
        // Always fetch teams
        const teamsData = await fetchTeams();
        setTeams(teamsData);
        
        // Only fetch users if user has admin or project_manager role
        if (user?.role === 'admin' || user?.role === 'project_manager') {
          try {
            const usersData = await fetchUsers();
            setUsers(usersData);
          } catch (userError) {
            console.warn('Failed to fetch users (permission issue):', userError);
            // Don't set error for users fetch failure, just log it
            // This allows teams to still work even if user doesn't have permission
          }
        }
      } catch (error) {
        console.error('Failed to load teams:', error);
        setError(handleApiError(error));
      }
    };
    loadData();
  }, [user]);

  async function onCreate(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Team name is required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const newTeam = await createTeam({ name });
      setTeams((prev) => [newTeam, ...prev]);
      setName('');
    } catch (error) {
      console.error('Failed to create team:', error);
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  }

  async function handleAddMember() {
    if (!selectedTeam || !selectedUser) return;
    
    try {
      await addTeamMember(selectedTeam, selectedUser);
      // Refresh teams to get updated member list
      const updatedTeams = await fetchTeams();
      setTeams(updatedTeams);
      setSelectedUser('');
    } catch (error) {
      console.error('Failed to add member:', error);
      setError(handleApiError(error));
    }
  }

  // Filter out admin and already-added members
  const getAvailableUsers = () => {
    if (!selectedTeam) return [];
    const currentTeam = teams.find((t) => t._id === selectedTeam);
    const memberIds = currentTeam?.members?.map((m) => m._id) || [];
    return users.filter(
      (user) => user.role !== 'admin' && !memberIds.includes(user._id)
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
          <p className="text-gray-600 mt-2">Organize your team members and manage collaboration</p>
          {user?.role === 'team_member' && (
            <p className="text-sm text-blue-600 mt-1">
              You can view teams and members. Contact your project manager to add members.
            </p>
          )}
        </div>
        <div className="text-sm text-gray-500">
          {teams.length} {teams.length === 1 ? 'team' : 'teams'}
        </div>
      </div>

      <div className={`grid gap-8 ${(user?.role === 'admin' || user?.role === 'project_manager') ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
        {/* Create Team Section - Only for Admin and Project Manager */}
        {(user?.role === 'admin' || user?.role === 'project_manager') && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Team</h2>
              
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={onCreate} className="space-y-4">
                <div>
                  <label htmlFor="team-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Team Name
                  </label>
                  <input
                    id="team-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter team name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </div>
                  ) : (
                    'Create Team'
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Teams Section */}
        <div className={`${(user?.role === 'admin' || user?.role === 'project_manager') ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">All Teams</h2>
            </div>
            
            <div className="p-6">
              {teams.length > 0 ? (
                <div className="space-y-4">
                  {teams.map((team) => (
                    <div key={team._id} className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{team.name}</h3>
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {team.members?.length || 0} members
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {(user?.role === 'admin' || user?.role === 'project_manager') && (
                            <button
                              onClick={() => setSelectedTeam(team._id)}
                              className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors"
                            >
                              Add Members
                            </button>
                          )}
                          <button
                            onClick={() =>
                              setViewingTeam(viewingTeam === team._id ? null : team._id)
                            }
                            className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200 transition-colors"
                          >
                            {viewingTeam === team._id ? 'Hide Members' : 'View Members'}
                          </button>
                        </div>
                      </div>

                      {/* Members List */}
                      {viewingTeam === team._id && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="text-sm font-medium text-gray-700 mb-3">Team Members</h4>
                          {team.members?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {team.members.map((member) => (
                                <div key={member._id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-semibold text-sm">
                                      {member.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                                    <p className="text-xs text-gray-500">
                                      {member.role ? member.role.replace('_', ' ').toUpperCase() : 'TEAM_MEMBER'}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                              </svg>
                              <p className="text-sm text-gray-500">No members yet</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No teams yet</h3>
                  <p className="text-gray-500 mb-4">Get started by creating your first team</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Members Section */}
      {selectedTeam && (user?.role === 'admin' || user?.role === 'project_manager') && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Add Members to Team</h2>
            <button
              onClick={() => setSelectedTeam(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {users.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="user-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Select User
                </label>
                <select
                  id="user-select"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="">Choose a user to add...</option>
                  {getAvailableUsers().map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.role.replace('_', ' ').toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end space-x-2">
                <button
                  onClick={handleAddMember}
                  disabled={!selectedUser}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Member
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-700 text-sm">
                Unable to load users. You may not have permission to manage team members.
              </p>
            </div>
          )}
          
          {users.length > 0 && getAvailableUsers().length === 0 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-700 text-sm">
                All available users are already members of this team.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
