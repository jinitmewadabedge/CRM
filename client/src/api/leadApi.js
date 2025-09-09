import axios from "axios";

export const getLeads = () => axios.get('http://localhost:5000/api/leads');
export const getLeadById = (id) => axios.get(`http://localhost:5000/api/leads/${id}`);
export const createLead = (data) => axios.post(`http://localhost:5000/api/leads/`, data);
export const updateLead = (id, data) => axios.put(`http://localhost:5000/api/leads/${id}`, data);
export const deleteLead = (id) => axios.delete(`http://localhost:5000/api/leads/${id}`);