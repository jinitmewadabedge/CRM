import axios from '../../..//services/axiosInstance';
import { ENDPOINTS } from '../../../services/endpoints';

export const fetchLeads = () => axios.get(ENDPOINTS.leads);
export const fetchLeadsStats = () => axios.get(ENDPOINTS.leadsStats);
export const fetchAllLeadIds = () => axios.get(ENDPOINTS.leadsIds);
export const fetchUsers = () => axios.get(ENDPOINTS.users);
export const fetchRoles = () => axios.get(ENDPOINTS.roles);
export const fetchCandidates = () => axios.get(ENDPOINTS.candidates);
export const markTouched = (id, payload) => axios.put(ENDPOINTS.markTouched(id), payload);
export const markCompleted = (id) => axios.put(ENDPOINTS.markCompleted(id));
export const startWork = (id) => axios.put(ENDPOINTS.startWork(id));
export const bulkAssign = (payload) => axios.put(ENDPOINTS.bulkAssign, payload);
export const bulkDelete = (payload) => axios.post(ENDPOINTS.bulkDelete, payload);
export const getResumeSet = async () => {
const [untouched, touched, completed] = await Promise.all([
axios.get(ENDPOINTS.resumeUntouched),
axios.get(ENDPOINTS.resumeTouched),
axios.get(ENDPOINTS.resumeCompleted),
]);
return { untouched: untouched.data, touched: touched.data, completed: completed.data };
};