import { useEffect, useState } from "react";
import axios from "axios";

const RolePermission = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/roles`);
      setRoles(res.data);
    } catch (err) {
      console.error("Error fetching roles:", err);
    } finally {
      setLoading(false);
    }
  };


  const handlePermissionChange = async (roleId, section, key, value) => {
    try {
      const updatedRoles = roles.map(r =>
        r._id === roleId
          ? {
            ...r,
            permissions: {
              ...r.permissions,
              [section]: {
                ...r.permissions[section],
                [key]: value,
              },
            },
          }
          : r
      );

      setRoles(updatedRoles);

      const updatedRole = updatedRoles.find(r => r._id === roleId);

      await axios.put(`${BASE_URL}/api/roles/${roleId}`, {
        permissions: updatedRole.permissions,
      });
    } catch (err) {
      console.error("Failed to update permission", err);
    }
  };


  return (
    <div className="container mt-4">
      <h4 className="mb-3">Roles & Permissions</h4>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered align-middle text-center">
          <thead className="table-light">
            <tr>
              <th>Role Name</th>
              <th>Create Scope</th>
              <th>Read Scope</th>
              <th>Update Scope</th>
              <th>Delete Scope</th>
              <th>Assign To Sales</th>
              <th>Bulk Add</th>
              <th>Export</th>
            </tr>
          </thead>
          <tbody>
            {roles.map(role => (
              <tr key={role._id}>
                <td className="fw-bold">{role.name}</td>

                <td>
                  <select
                    className="form-select form-select-sm"
                    value={role.permissions?.lead?.createScope || "own"}
                    onChange={e =>
                      handlePermissionChange(
                        role._id,
                        "lead",
                        "createScope",
                        e.target.value
                      )
                    }
                  >
                    <option value="own">Own</option>
                    <option value="dept">Dept</option>
                    <option value="team+dept">Team+Dept</option>
                    <option value="all">All</option>
                  </select>
                </td>

                <td>
                  <select
                    className="form-select form-select-sm"
                    value={role.permissions?.lead?.readScope || "own"}
                    onChange={e =>
                      handlePermissionChange(
                        role._id,
                        "lead",
                        "readScope",
                        e.target.value
                      )
                    }
                  >
                    <option value="own">Own</option>
                    <option value="dept">Dept</option>
                    <option value="team+dept">Team+Dept</option>
                    <option value="all">All</option>
                  </select>
                </td>

                <td>
                  <select
                    className="form-select form-select-sm"
                    value={role.permissions?.lead?.updateScope || "own"}
                    onChange={e =>
                      handlePermissionChange(
                        role._id,
                        "lead",
                        "updateScope",
                        e.target.value
                      )
                    }
                  >
                    <option value="own">Own</option>
                    <option value="dept">Dept</option>
                    <option value="team+dept">Team+Dept</option>
                    <option value="all">All</option>
                  </select>
                </td>

                <td>
                  <select
                    className="form-select form-select-sm"
                    value={role.permissions?.lead?.deleteScope || "none"}
                    onChange={e =>
                      handlePermissionChange(
                        role._id,
                        "lead",
                        "deleteScope",
                        e.target.value
                      )
                    }
                  >
                    <option value="none">None</option>
                    <option value="own">Own</option>
                    <option value="dept">Dept</option>
                    <option value="team+dept">Team+Dept</option>
                    <option value="all">All</option>
                  </select>
                </td>

                <td>
                  <input
                    type="checkbox"
                    checked={role.permissions?.lead?.assignToSales || false}
                    onChange={e =>
                      handlePermissionChange(
                        role._id,
                        "lead",
                        "assignToSales",
                        e.target.checked
                      )
                    }
                  />
                </td>

                <td>
                  <input
                    type="checkbox"
                    checked={role.permissions?.lead?.bulkAdd || false}
                    onChange={e =>
                      handlePermissionChange(
                        role._id,
                        "lead",
                        "bulkAdd",
                        e.target.checked
                      )
                    }
                  />
                </td>

                <td>
                  <input
                    type="checkbox"
                    checked={role.permissions?.lead?.export || false}
                    onChange={e =>
                      handlePermissionChange(
                        role._id,
                        "lead",
                        "export",
                        e.target.checked
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RolePermission;
