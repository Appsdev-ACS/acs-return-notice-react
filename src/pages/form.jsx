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

  useEffect(() => {
    axios
      .get("https://acs-return-notice-1086168806252.europe-west1.run.app/api/form-data", {
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
            DateOfReturn: res.data.formData.DateOfReturn || "",
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

    try {
      await axios.post(
        "https://acs-return-notice-1086168806252.europe-west1.run.app/api/return-notice",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Form submitted successfully.");
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
      <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem", textAlign: "left" }}>
            <label style={{ display: "block" }}>Household ID</label>
            <input
              type="text"
              name="HouseholdId"
              value={formData.HouseholdId}
              onChange={handleChange}
              className="form-control"
              readOnly
            />
          </div>

          <div style={{ marginBottom: "1rem", textAlign: "left" }}>
            <label>Household Name</label>
            <input
              type="text"
              name="HouseholdName"
              value={formData.HouseholdName}
              onChange={handleChange}
              className="form-control"
              readOnly
            />
          </div>

          <div style={{ marginBottom: "1rem", textAlign: "left" }}>
            <label>Person ID</label>
            <input
              type="text"
              name="PersonId"
              value={formData.PersonId}
              onChange={handleChange}
              className="form-control"
              readOnly
            />
          </div>

          <div style={{ marginBottom: "1rem", textAlign: "left" }}>
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

          <div style={{ marginBottom: "1rem", textAlign: "left" }}>
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

          <div style={{ marginBottom: "1rem", textAlign: "left" }}>
            <label>Who is completing the form?</label>
            <input
              type="text"
              name="Who_is_completing_the_form"
              value={formData.Who_is_completing_the_form}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div style={{ marginBottom: "1rem", textAlign: "left" }}>
            <label>Child Details</label>
            <textarea
              name="ChildDetails"
              value={formData.ChildDetails}
              onChange={handleChange}
              className="form-control"
              rows="6"
              readOnly
            />
          </div>

          <div style={{ marginBottom: "1rem", textAlign: "left" }}>
            <label>Date students returned to UAE</label>
            <input
              type="date"
              name="DateOfReturn"
              value={formData.DateOfReturn}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div style={{ marginBottom: "1rem", textAlign: "left" }}>
            <label>Comments</label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              className="form-control"
              rows="4"
              // required
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
// import { useState } from "react";
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

//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       const idToken = localStorage.getItem("idToken");

//       await axios.post(
//         "http://localhost:5000/api/return-notice",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${idToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       setSuccess("Form submitted successfully.");
//       setFormData({
//         HouseholdId: "",
//         HouseholdName: "",
//         PersonId: "",
//         Parent_1_Name_and_Email: "",
//         Parent_2_Name_and_Email: "",
//         Who_is_completing_the_form: "",
//         ChildDetails: "",
//         DateOfReturn: "",
//         comments: "",
//       });
//     } catch (err) {
//       console.error(err);
//       setError("Failed to submit form.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Layout>
//       <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
//         {/* <h3>Return Notice Form</h3> */}

//         <form onSubmit={handleSubmit}>
//           <div style={{ marginBottom: "1rem", textAlign: "left" }}>
//             <label style={{ display: "block", textAlign: "left" }}>Household ID</label>
//             <input
//               type="text"
//               name="HouseholdId"
//               value={formData.HouseholdId}
//               onChange={handleChange}
//               className="form-control"
//               placeholder=""
//               required
//             />
//           </div>

//           <div style={{ marginBottom: "1rem", textAlign: "left" }}>
//             <label>Household Name</label>
//             <input
//               type="text"
//               name="HouseholdName"
//               value={formData.HouseholdName}
//               onChange={handleChange}
//               className="form-control"
//               placeholder=""
//               required
//             />
//           </div>

//           <div style={{ marginBottom: "1rem", textAlign: "left" }}>
//             <label>Person ID</label>
//             <input
//               type="text"
//               name="PersonId"
//               value={formData.PersonId}
//               onChange={handleChange}
//               className="form-control"
//               placeholder=""
//               required
//             />
//           </div>

//           <div style={{ marginBottom: "1rem", textAlign: "left" }}>
//             <label>Parent 1 Name & Email</label>
//             <input
//               type="text"
//               name="Parent_1_Name_and_Email"
//               value={formData.Parent_1_Name_and_Email}
//               onChange={handleChange}
//               className="form-control"
//               placeholder=""
//             />
//           </div>
          
//           <div style={{ marginBottom: "1rem", textAlign: "left" }}>
//             <label>Parent 2 Name & Email</label>
//             <input
//               type="text"
//               name="Parent_2_Name_and_Email"
//               value={formData.Parent_2_Name_and_Email}
//               onChange={handleChange}
//               className="form-control"
//               placeholder=""
//             />
//           </div>  

//           <div style={{ marginBottom: "1rem", textAlign: "left" }}>
//             <label>Who is completing the form?</label>
//             <input
//               type="text"
//               name="Who_is_completing_the_form"
//               value={formData.Who_is_completing_the_form}
//               onChange={handleChange}
//               className="form-control"
//               placeholder=""
//             />
//           </div>          
          
//           <div style={{ marginBottom: "1rem", textAlign: "left" }}>
//             <label>Child Details</label>
//             <input
//               type="text"
//               name="ChildDetails"
//               value={formData.ChildDetails}
//               onChange={handleChange}
//               className="form-control"
//               placeholder=""
//             />
//           </div>          
          
//           <div style={{ marginBottom: "1rem", textAlign: "left" }}>
//             <label>Date students returned to UAE</label>
//             <input
//                 type="date"
//                 name="DateOfReturn"
//                 value={formData.DateOfReturn}
//                 onChange={handleChange}
//                 className="form-control"
//                 required
//             />
//           </div>

//           <div style={{ marginBottom: "1rem", textAlign: "left" }}>
//             <label>Comments</label>
//             <textarea
//               name="comments"
//               value={formData.comments}
//               onChange={handleChange}
//               className="form-control"
//               rows="4"
//               placeholder="Enter your comments"
//               required
//             />
//           </div>

//           <div className="row my-3">
//             <div className="col-md-12 d-flex justify-content-center">
//               <button type="submit" className="btn btn-theme" disabled={loading}>
//                 {loading ? "Submitting..." : "Submit"}{" "}
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

