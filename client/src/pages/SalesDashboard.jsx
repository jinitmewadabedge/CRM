import React, { useEffect, useState } from 'react'
import axios from 'axios'

const SalesDashboard = () => {

  const [leads, setLeads] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedMember, setSelectedMember] = useState("");
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchUnassignedLeads = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/leads/unassigned`);
      console.log("Unassigned leads response:", res.data);
      setLeads(res.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const fetchTeamMember = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/auth/users`);
      console.log("Team members response:", res.data);
      setTeamMembers(res.data);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  useEffect(() => {
    fetchUnassignedLeads();
    fetchTeamMember();
  }, []);

  const handleAssign = async () => {

    if (!selectedLead || !selectedMember) return;

    console.log("Selected Lead ID:", selectedLead, "Selected Member ID:", selectedMember);

    try {
      await axios.post(`${BASE_URL}/api/leads/assign/${selectedLead}`,
        { teamMemberId: selectedMember },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      alert("Lead assigned successfully!");

      setSelectedLead(null);
      setSelectedMember("");
      fetchUnassignedLeads();
    } catch (error) {
      console.error("Error assigning lead:", error);
      alert("Failed to assign lead. Check console for more details")
    }
  };

  return (
    <div>
      <h2>Unassigned Leads</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id}>
              <td>{lead.candidate_name}</td>
              <td>{lead.candidate_email}</td>
              <td>{lead.candidate_phone_no}</td>
              <td>
                <button onClick={() => setSelectedLead(lead._id)}>
                  Assign
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedLead && (
        <div style={{ border: "1px solid black", padding: "10px", marginTop: "20px" }}>
          <h3>Assign Lead</h3>
          <select
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
          >
            <option value="">Select Team Member</option>
            {teamMembers
              .filter((member) => member.role?.name === "Sales")
              .map((member) => (
                <option key={member._id} value={member._id}>{member.name}</option>
              ))}
          </select>
          <button onClick={handleAssign} disabled={!selectedMember}>Confirm Assign</button>
          <button onClick={() => setSelectedLead(null)}>Cancel</button>
        </div>
      )}
    </div>
  )
}

export default SalesDashboard