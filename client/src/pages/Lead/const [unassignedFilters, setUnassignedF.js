const [unassignedFilters, setUnassignedFilters] = useState({
    search: "",
    sortByDate: "desc"
});

const filteredUnassignedLeads = useMemo(() => {
    const searchTerm = unassignedFilters.search.toLowerCase().trim();
    // if (!searchTerm) return unassignedLeads;

    let results = unassignedLeads.filter((lead) => {
        const n = normalizeLead(lead);
        if (!searchTerm) return true;

        return (
            n.name.toLowerCase().includes(searchTerm) ||
            n.email.toLowerCase().includes(searchTerm) ||
            n.phone.toLowerCase().includes(searchTerm)
        );
    });

    results.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);

        return unassignedFilters.sortByDate === "desc"
            ? dateB - dateA
            : dateA - dateB;
    });

    return results;
}, [unassignedLeads, unassignedFilters.search, unassignedFilters.sortByDate]);

const indexOfLastUnassignedLeads = currentUnassignedPage * leadsPerPage;
const indexOfFirstUnassignedLeads = indexOfLastUnassignedLeads - leadsPerPage;
const currentUnassignedLeads = filteredUnassignedLeads.slice(indexOfFirstUnassignedLeads, indexOfLastUnassignedLeads);

{
    user.role !== "Resume" && user.role !== "Sales" && (
        <div className="col-12 col-md-8 col-lg-12 mt-2">
            <div className="rounded-4 bg-white shadow-sm p-4 table-responsive h-100">
                <div className="d-flex justify-content-between align-items-center px-3 mt-2 mb-3">
                    <div>
                        <h5 className="text-left leadManagementTitle mt-4">All Unassigned Leads({counts.unassigned})</h5>
                        <h6 className="leadManagementSubtitle mb-3">Active Leads</h6>
                    </div>
                    <div className="d-flex justify-content-between align-items-center gap-4 px-3 mt-2 mb-3">
                        <div className="input-group input-group-sm w-auto search">
                            <span className="input-group-text bg-white border-end-0">
                                <i className="bi bi-search"></i>
                            </span>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="form-control form-control-sm border-start-0"
                                value={unassignedFilters.search}
                                onChange={(e) =>
                                    setUnassignedFilters({ ...unassignedFilters, search: e.target.value })
                                }
                            />
                        </div>
                        <select
                            className="form-select form-select-sm selectFont sortSelect"
                            value={unassignedFilters.sortByDate}
                            onChange={(e) => setUnassignedFilters({ ...unassignedFilters, sortByDate: e.target.value })}>
                            <option value="">----Sort By Order----</option>
                            <option value="desc">Newest to Oldest</option>
                            <option value="asc">Oldest to Newest</option>
                        </select>
                    </div>

                </div>

                {/* <div>
              <button className="btn btn-primary btn-sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <i className="bi bi-funnel-fill me-2"></i>
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div> */}


                {selectedUnassignedLeads.length > 0 && (
                    <div className="d-flex justify-content-between align-items-center mb-3 mx-3">
                        <h6 className="tableHeader">Selected Leads : {selectedUnassignedLeads.length}</h6>

                        <div className="d-flex align-items-center gap-2">
                            <select
                                className="form-select form-select-sm selectFont"
                                value={selectedMember}
                                onChange={(e) => setSelectedMember(e.target.value)}
                                style={{ width: "200px" }}>
                                <option value="">Select Team Member</option>
                                {teamMembers.map((user) => (
                                    <option value={user._id} key={user._id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>

                            <button
                                className="btn btn-primary btn-sm"
                                onClick={handleBulkAssign}
                                disabled={!selectedMember || selectedUnassignedLeads.length === 0}>
                                Assign Selected ({selectedUnassignedLeads.length})
                            </button>
                        </div>
                    </div>
                )}

                {loading ? (
                    <MyLoader
                        rowHeight={40}
                        rowCount={5}
                        columnWidths={["90", "140", "110", "110", "200", "130", "130", "110", "130"]} />
                ) : (
                    <div className="table-container">
                        <table className="table table-hover table-responsive align-middle rounded-5 mb-0 bg-white">
                            <thead className="bg-light">
                                <tr>
                                    <th className="text-left tableHeader">
                                        <div className="d-flex align-items-start justify-content-center flex-column">
                                            <label htmlFor="selectAllCheckbox" className="form-label">
                                                Select All
                                            </label>
                                            <input
                                                type="checkbox"
                                                checked={selectAllUnassigned}
                                                onChange={(e) => handleSelectAllUnassigned(e, "unassigned")}
                                            />
                                        </div>
                                    </th>
                                    <th className="text-left tableHeader">Name</th>
                                    <th className="text-left tableHeader">Email</th>
                                    <th className="text-left tableHeader">Phone No</th>
                                    <th className="text-left tableHeader">Status</th>
                                    <th className="text-left tableHeader">Actions</th>
                                    {/* <th className="text-left tableHeader">Lead Type</th> */}
                                    {/* <th className="text-left tableHeader">URL</th> */}
                                    {/* <th className="text-left tableHeader">University</th> */}
                                    {/* <th className="text-left tableHeader">Technology</th> */}
                                    {/* <th className="text-left tableHeader">Visa</th> */}
                                    {/* <th className="text-left tableHeader">Preferred Time</th> */}
                                    {/* <th className="text-left tableHeader">Source</th> */}
                                    {/* <th className="text-left tableHeader">Created At</th> */}
                                    {/* <th className="text-left tableHeader">Updated At</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {currentUnassignedLeads.length > 0 ? (
                                    currentUnassignedLeads.map((a) => (
                                        <tr key={a._id} onClick={() => handleRowClick(a, "unassigned")} style={{ cursor: "pointer" }}>
                                            <td>
                                                <input type="checkbox"
                                                    checked={selectedUnassignedLeads.includes(a._id)}
                                                    onChange={() => toggleLeadSelection(a._id, "unassigned")}
                                                />
                                            </td>
                                            <td>
                                                <p className="mb-0 text-left tableData">{a.candidate_name || a.name}</p>
                                            </td>
                                            <td>
                                                <p className="mb-0 text-left tableData">{a.candidate_email || a.email}</p>
                                            </td>
                                            <td>
                                                <p className="mb-0 text-left tableData">{a.candidate_phone_no || a.phone}</p>
                                            </td>
                                            <td className="text-center">
                                                <span
                                                    className="badge px-2 d-flex align-items-center justify-content-center gap-2"
                                                    style={{
                                                        backgroundColor: statusColors[a.status] || "#d1d5db",
                                                        color: "white",
                                                        borderRadius: "12px",
                                                        fontSize: "12px",
                                                        fontWeight: "normal",
                                                        textTransform: "capitalize",
                                                    }}
                                                >

                                                    {a.status === "New" && <FaLink />}
                                                    {a.status === "Connected" && <FaCheckCircle />}
                                                    {a.status === "In Progress" && <FaHourglassHalf />}
                                                    {a.status === "Shortlisted" && <FaStar />}
                                                    {a.status === "Rejected" && <FaTimesCircle />}
                                                    {a.status === "Assigned" && <FaCheckCircle />}
                                                    {a.status === "Converted" && <FaUserCheck />}
                                                    {a.status === "Interested" && <FaThumbsUp />}
                                                    {a.status === "Enrolled" && <FaGraduationCap />}
                                                    {a.status === "Not Interested" && <FaThumbsDown />}
                                                    {a.status === "Follow-up" && <FaRedo />}
                                                    {a.status === "In Discussion" && <FaComments />}
                                                    {a.status === "reverted" && <FaBackward />}

                                                    {a.status}
                                                </span>
                                            </td>
                                            <td>
                                                {permissions?.lead?.assignToSales && (
                                                    <button
                                                        id="assign"
                                                        className="btn btn-sm btn-success"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedLead(a._id)
                                                        }}
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#assignLeadModal">
                                                        Assign
                                                    </button>
                                                )}

                                                {user.role === "Marketing" &&
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#revertModal"
                                                        onClick={() => {
                                                            console.log("Open Modal Clicked");
                                                            // handleMoveBackToResume(a._id)
                                                            setSelectedRevertLead(a._id);
                                                        }}>
                                                        Back To Resume <FaUndo className="ms-1" />
                                                    </button>
                                                }

                                                {user.role === "Marketing" &&
                                                    <button
                                                        className="btn btn-sm btn-success ms-2"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowRecruiterModal(true);
                                                            setSelectedCandidate(a);
                                                        }}>
                                                        Assign To Recruiter <FaUser size={14} />
                                                    </button>
                                                }

                                                {user.role === "Recruiter" &&
                                                    <button
                                                        className="btn btn-sm btn-warning text-white ms-2 dailyReport"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#reportModal"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedCandidate(a);
                                                            setSelectedLeadName(a.name || a.candidate_name);
                                                            // setShowReportModal(true);
                                                        }}>
                                                        Daily Report <FaFile />
                                                    </button>
                                                }

                                                {user.role === "Recruiter" &&
                                                    <button
                                                        className="btn btn-sm btn-warning text-white ms-2 history"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#historyModal"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedCandidate(a);
                                                            setSelectedLeadName(a.name);
                                                            fetchReportHistory(a._id);
                                                        }}>
                                                        Daily History <FaHistory color="rgba(255, 255, 255, 1)" />
                                                    </button>
                                                }

                                                {user.role === "Recruiter" &&
                                                    <button
                                                        className="btn btn-sm btn-dark text-white ms-2 interviewReport"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedInterviewLead(a);
                                                            setShowInterviewModal(true);
                                                        }}>
                                                        Response Report <FaUser /> <FaFileExcel />
                                                    </button>
                                                }

                                                {user.role === "Recruiter" &&
                                                    <button
                                                        className="btn btn-sm btn-dark text-white ms-2 history"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#responseReportHistoryModal"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedCandidate(a);
                                                            setSelectedLeadName(a.name);
                                                            fetchResponseReportHistory(a._id);
                                                        }}>
                                                        Response Report History <FaHistory color="rgba(255, 255, 255, 1)" />
                                                    </button>
                                                }

                                                <button
                                                    id="viewLead"
                                                    className="btn btn-sm btn-success ms-2 viewLead"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#myLeadModal"
                                                    onClick={(e) => {
                                                        setTimeout(() => {
                                                            e.stopPropagation();
                                                            console.log("Selected Lead in modal", a);
                                                            setSelectedLead(a);
                                                            setModalSource("unassigned");
                                                        }, 600);
                                                    }}>
                                                    View Lead
                                                </button>
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="11" className="mb-0 text-center tableData">
                                            No unassigned candidates found...
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {
                            finalLead && (
                                <div style={{ border: "1px solid black", padding: "10px", marginTop: "20px" }}>
                                    <h3>Assign Lead</h3>
                                    <select
                                        value={selectedMember}
                                        onChange={(e) => setSelectedMember(e.target.value)}
                                    >
                                        <option value="">Select Team Member</option>
                                        {teamMembers
                                            .filter((member) => {

                                                const roleName = JSON.parse(sessionStorage.getItem("user"))?.role?.name;

                                                console.log("Member:", member.name, "Role:", member.role?.name);

                                                if (!member.role?.name) return false;

                                                if (roleName === "Lead_Gen_Manager") {
                                                    return member.role?.name === "Sales_Manager";
                                                }
                                                if (roleName === "Sales_Manager") {
                                                    return member.role?.name === "Sales";
                                                }
                                                return false;
                                            })
                                            .map((member) => (
                                                <option key={member._id} value={member._id}>{member.name}</option>
                                            ))}

                                    </select>
                                    <button onClick={handleAssign} disabled={!selectedMember}>Confirm Assign</button>
                                    <button onClick={() => setFinalLead(null)}>Cancel</button>
                                </div>
                            )
                        }
                    </div >
                )}
                <div className="d-flex justify-content-end align-items-center mt-3 mb-3 p-2">
                    <button
                        className="btn btn-sm btn-outline-primary me-2"
                        disabled={currentUnassignedPage === 1}
                        onClick={() => setCurrentUnassignedPage(currentUnassignedPage - 1)}
                    >
                        Previous
                    </button>

                    {[...Array(totalUnassignedPages)].map((_, index) => (
                        <button
                            key={index}
                            className={`btn btn-sm me-1 ${currentUnassignedPage === index + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setCurrentUnassignedPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        className="btn btn-sm btn-outline-primary ms-2"
                        disabled={currentUnassignedPage === totalUnassignedPages}
                        onClick={() => setCurrentUnassignedPage(currentUnassignedPage + 1)}
                    >
                        Next
                    </button>
                </div>
            </div >
        </div>
    )
}