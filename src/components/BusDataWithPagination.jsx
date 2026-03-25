import React, { useMemo, useState, useEffect } from "react";

export default function BusDataWithPagination({ busData = [], initialPageSize = 10 }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalItems = busData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  // ✅ Sort by Homeroom Teacher before slicing
  // const sortedData = useMemo(() => {
  //   return [...busData].sort((a, b) => {
  //     const teacherA = (a["Homeroom Teacher"] || "").toLowerCase();
  //     const teacherB = (b["Homeroom Teacher"] || "").toLowerCase();
  //     return teacherA.localeCompare(teacherB);
  //   });
  // }, [busData]);
// ✅ Sort by Grade Level: Elementary → MS → HS
const sortedData = useMemo(() => {
  const gradeOrder = (grade) => {
    if (!grade) return 999; // missing grades → bottom
    const g = grade.toString().toLowerCase().trim();

    if (g.startsWith("kindergarten")) {
      const num = parseInt(g.replace("kindergarten", "").trim(), 10);
      return num ? num / 10 : 0; // Kindergarten 1 → 0.1, Kindergarten 2 → 0.2
    }

    if (g.startsWith("grade")) {
      const num = parseInt(g.replace("grade", "").trim(), 10);
      return isNaN(num) ? 999 : num; // Grade 1 → 1, Grade 2 → 2, etc.
    }

    return 999; // unknown grades → bottom
  };

  const levelRank = (grade) => {
    const g = gradeOrder(grade);
    if (g < 6) return 1; // Elementary (KG1–Grade5)
    if (g < 9) return 2; // Middle School (Grade6–8)
    return 3; // High School (Grade9–12)
  };

  return [...busData].sort((a, b) => {
    const levelDiff = levelRank(a["Grade Level"]) - levelRank(b["Grade Level"]);
    if (levelDiff !== 0) return levelDiff;

    // Within same level, sort by numeric gradeOrder
    return gradeOrder(a["Grade Level"]) - gradeOrder(b["Grade Level"]);
  });
}, [busData]);







  const currentSlice = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  if (!busData || busData.length === 0) return null;

  return (
    <div style={{ marginTop: "1rem", background: "#f9f9f9", padding: "1rem", borderRadius: "8px" }}>
      <h3 style={{ marginBottom: "1rem", color: "#004c3a" }}>Bus Data</h3>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#004c3a", textAlign: "left" }}>
            {["Student ID", "First Name", "Last Name", "Grade Level", "Homeroom Teacher", "Bus"].map((header) => (
              <th key={header} style={{ padding: "4px", border: "1px solid #ccc", color: "#ffffff" }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentSlice.map((student, index) => (
            <tr key={index}>
              <td style={{ padding: "4px 8px", border: "1px solid #ccc" }}>{student["Student Id"]}</td>
              <td style={{ padding: "4px 8px", border: "1px solid #ccc" }}>{student["First Name"]}</td>
              <td style={{ padding: "4px 8px", border: "1px solid #ccc" }}>{student["Last Name"]}</td>
              <td style={{ padding: "4px 8px", border: "1px solid #ccc" }}>{student["Grade Level"]}</td>
              <td style={{ padding: "4px 8px", border: "1px solid #ccc" }}>{student["Homeroom Teacher"]}</td>
              <td style={{ padding: "4px 8px", border: "1px solid #ccc" }}>{student["Bus"]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
        <div>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{ marginRight: "0.5rem" }}
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>

        <div>
          Page {page} of {totalPages} ({currentSlice.length} of {totalItems} rows)
        </div>

        <div>
          <label style={{ marginRight: "0.5rem" }}>Rows per page:</label>
          <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
            {[5, 10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
