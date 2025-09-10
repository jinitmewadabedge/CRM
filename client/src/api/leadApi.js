import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const getLeads = () => axios.get(`${BASE_URL}/api/leads`);
export const getLeadById = (id) => axios.get(`${BASE_URL}/api/leads/${id}`);
export const createLead = (data) => axios.post(`${BASE_URL}/api/leads/`, data);
export const updateLead = (id, data) => axios.put(`${BASE_URL}/api/leads/${id}`, data);
export const deleteLead = (id) => axios.delete(`${BASE_URL}/api/leads/${id}`);