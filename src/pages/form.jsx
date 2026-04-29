import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import axios from "axios";

function ReturnForm() {
  const [formData, setFormData] = useState({
    HouseholdId: "",
    HouseholdName: "",
    PersonId: "",
    Parent_1_Name_and_Email: "",
    Parent_2_Name_and_Email: "",
    Who_is_completing_the_form: "",
    ChildDetails: "",
    DateOfReturn: "",
    comments: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  function toInputDate(dateStr) {
    if (!dateStr) return "";

    if (dateStr.includes("/")) {
      const parts = dateStr.split("/");
      if (parts.length === 3) {
        const [month, day, year] = parts;
        return `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }
    }

    return dateStr;
  }

  function toMMDDYYYY(dateStr) {
    if (!dateStr) return "";

    const [year, month, day] = dateStr.split("-");
    return `${month}/${day}/${year}`;
  }

  useEffect(() => {
    axios
      .get("/api/form-data", {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data?.formData) {
          setFormData({
            HouseholdId: res.data.formData.HouseholdId || "",
            HouseholdName: res.data.formData.HouseholdName || "",
            PersonId: res.data.formData.PersonId || "",
            Parent_1_Name_and_Email: res.data.formData.Parent_1_Name_and_Email || "",
            Parent_2_Name_and_Email: res.data.formData.Parent_2_Name_and_Email || "",
            Who_is_completing_the_form: res.data.formData.Who_is_completing_the_form || "",
            ChildDetails: res.data.formData.ChildDetails || "",
            DateOfReturn: toInputDate(res.data.formData.DateOfReturn || ""),
            comments: res.data.formData.comments || "",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load form data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "DateOfReturn" && value > today) {
      alert("Future dates are not allowed.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    if (formData.DateOfReturn > today) {
      setError("Future dates are not allowed.");
      setSubmitting(false);
      return;
    }

    const payload = {
      ...formData,
      DateOfReturn: toMMDDYYYY(formData.DateOfReturn),
    };

    try {
      await axios.post("/api/return-notice", payload, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      setSuccess("Form submitted successfully.");
      alert("Form submitted successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to submit form.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ padding: "2rem" }}>Loading form...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ maxWidth: "700px", margin: "1.5rem auto" }}>
        <form onSubmit={handleSubmit}>
          <h4 style={{ color: "red" }}>Please only complete this form when you have already return to the UAE. This form does not accept dates in the future.</h4>
          <div style={{ marginBottom: "0.75rem", textAlign: "left" }}>
            <label>Parent 1 Name & Email</label>
            <input
              type="text"
              name="Parent_1_Name_and_Email"
              value={formData.Parent_1_Name_and_Email}
              onChange={handleChange}
              className="form-control"
              readOnly
            />
          </div>

          {formData.Parent_2_Name_and_Email && (
            <div style={{ marginBottom: "0.75rem", textAlign: "left" }}>
              <label>Parent 2 Name & Email</label>
              <input
                type="text"
                name="Parent_2_Name_and_Email"
                value={formData.Parent_2_Name_and_Email}
                onChange={handleChange}
                className="form-control"
                readOnly
              />
            </div>
          )}

          <div style={{ marginBottom: "0.75rem", textAlign: "left" }}>
            <label>Who is completing the form?</label>
            <input
              type="text"
              name="Who_is_completing_the_form"
              value={formData.Who_is_completing_the_form}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div style={{ marginBottom: "0.75rem", textAlign: "left" }}>
            <label>Child Details</label>
            <textarea
              name="ChildDetails"
              value={formData.ChildDetails}
              onChange={handleChange}
              className="form-control"
              rows="5"
              readOnly
            />
          </div>

          <div style={{ marginBottom: "0.75rem", textAlign: "left" }}>
            <label>Date students returned to UAE</label>
            <input
              type="date"
              name="DateOfReturn"
              value={formData.DateOfReturn}
              onChange={handleChange}
              className="form-control"
              required
              max={today}
            />
          </div>

          <div style={{ marginBottom: "0.75rem", textAlign: "left" }}>
            <label>Comments</label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              className="form-control"
              rows="3"
            />
          </div>

          <div className="row my-3">
            <div className="col-md-12 d-flex justify-content-center">
              <button type="submit" className="btn btn-theme" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit"}{" "}
                <i className="fa fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </form>

        {success && <p style={{ color: "green" }}>{success}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </Layout>
  );
}

export default ReturnForm;


// import Layout from "../components/Layout";
// import { useState, useEffect } from "react";
// import axios from "axios";

// function ReturnForm() {
//   const [formData, setFormData] = useState({
//     HouseholdId: "",
//     HouseholdName: "",
//     PersonId: "",
//     Parent_1_Name_and_Email: "",
//     Parent_2_Name_and_Email: "",
//     Who_is_completing_the_form: "",
//     ChildDetails: "",
//     DateOfReturn: "",
//     comments: "",
//   });

//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");

//   const today = new Date().toISOString().split("T")[0];

//   useEffect(() => {
//     // axios
//     //   .get("https://acs-return-notice-1086168806252.europe-west1.run.app/api/form-data", {
//     //     withCredentials: true,
//     //   })
//     axios.get("/api/form-data", {
//         withCredentials: true,
//       })
//       .then((res) => {
//         if (res.data?.formData) {
//           setFormData({
//             HouseholdId: res.data.formData.HouseholdId || "",
//             HouseholdName: res.data.formData.HouseholdName || "",
//             PersonId: res.data.formData.PersonId || "",
//             Parent_1_Name_and_Email: res.data.formData.Parent_1_Name_and_Email || "",
//             Parent_2_Name_and_Email: res.data.formData.Parent_2_Name_and_Email || "",
//             Who_is_completing_the_form: res.data.formData.Who_is_completing_the_form || "",
//             ChildDetails: res.data.formData.ChildDetails || "",
//             DateOfReturn: res.data.formData.DateOfReturn || "",
//             comments: res.data.formData.comments || "",
//           });
//         }
//       })
//       .catch((err) => {
//         console.error(err);
//         setError("Failed to load form data.");
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "DateOfReturn" && value > today) {
//       alert("Future dates are not allowed.");
//       return;
//     }

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     setError("");
//     setSuccess("");

//     if (formData.DateOfReturn > today) {
//       setError("Future dates are not allowed.");
//       setSubmitting(false);
//       return;
//     }

//     try {

//             await axios.post(
//         "https://acs-return-notice-1086168806252.europe-west1.run.app/api/return-notice",
//         formData,
//         {
//           withCredentials: true,
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       setSuccess("Form submitted successfully.");
//       alert("Form submitted successfully.");
//     } catch (err) {
//       console.error(err);
//       setError("Failed to submit form.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <Layout>
//         <div style={{ padding: "2rem" }}>Loading form...</div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div style={{ maxWidth: "700px", margin: "1.5rem auto" }}>
//         <form onSubmit={handleSubmit}>
//           <div style={{ marginBottom: "0.75rem", textAlign: "left" }}>
//             <label>Parent 1 Name & Email</label>
//             <input
//               type="text"
//               name="Parent_1_Name_and_Email"
//               value={formData.Parent_1_Name_and_Email}
//               onChange={handleChange}
//               className="form-control"
//               readOnly
//             />
//           </div>

//           {formData.Parent_2_Name_and_Email && (
//             <div style={{ marginBottom: "0.75rem", textAlign: "left" }}>
//               <label>Parent 2 Name & Email</label>
//               <input
//                 type="text"
//                 name="Parent_2_Name_and_Email"
//                 value={formData.Parent_2_Name_and_Email}
//                 onChange={handleChange}
//                 className="form-control"
//                 readOnly
//               />
//             </div>
//           )}

//           <div style={{ marginBottom: "0.75rem", textAlign: "left" }}>
//             <label>Who is completing the form?</label>
//             <input
//               type="text"
//               name="Who_is_completing_the_form"
//               value={formData.Who_is_completing_the_form}
//               onChange={handleChange}
//               className="form-control"
//             />
//           </div>

//           <div style={{ marginBottom: "0.75rem", textAlign: "left" }}>
//             <label>Child Details</label>
//             <textarea
//               name="ChildDetails"
//               value={formData.ChildDetails}
//               onChange={handleChange}
//               className="form-control"
//               rows="5"
//               readOnly
//             />
//           </div>

//           <div style={{ marginBottom: "0.75rem", textAlign: "left" }}>
//             <label>Date students returned to UAE</label>
//             <input
//               type="date"
//               name="DateOfReturn"
//               value={formData.DateOfReturn}
//               onChange={handleChange}
//               className="form-control"
//               required
//               max={today}
//             />
//           </div>

//           <div style={{ marginBottom: "0.75rem", textAlign: "left" }}>
//             <label>Comments</label>
//             <textarea
//               name="comments"
//               value={formData.comments}
//               onChange={handleChange}
//               className="form-control"
//               rows="3"
//             />
//           </div>

//           <div className="row my-3">
//             <div className="col-md-12 d-flex justify-content-center">
//               <button type="submit" className="btn btn-theme" disabled={submitting}>
//                 {submitting ? "Submitting..." : "Submit"}{" "}
//                 <i className="fa fa-arrow-right"></i>
//               </button>
//             </div>
//           </div>
//         </form>

//         {success && <p style={{ color: "green" }}>{success}</p>}
//         {error && <p style={{ color: "red" }}>{error}</p>}
//       </div>
//     </Layout>
//   );
// }

// export default ReturnForm;

