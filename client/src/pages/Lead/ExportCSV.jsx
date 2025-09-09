import { CSVLink } from "react-csv";

const headers = [
    { label: "Name", key: "Name" },
    { label: "Email", key: "Email" },
    { label: "Lead Type", key: "Lead Type" },
    { label: "Phone No.", key: "Phone No." },
    { label: "URL", key: "URL" },
    { label: "Technology", key: "Technology" },
    { label: "Visa", key: "Visa" },
    { label: "Preferred Time", key: "Preferred Time" },
    { label: "Status", key: "Status" },
    { label: "Created At", key: "Created At" },
    { label: "Updated At", key: "Updated At" },
];

const ExportCSV = ({ data }) => {
    return (
        <CSVLink
            data={data}
            headers={headers}
            filename={"leads_export.csv"}
            className="btn btn-primary"
            target="_blank"
        >
            Export Leads to CSV
        </CSVLink>
    );
};

export default ExportCSV;