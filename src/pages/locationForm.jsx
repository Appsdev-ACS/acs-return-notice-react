import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import axios from "axios";
import { getNames } from "country-list";

function LocationForm() {
  const [formData, setFormData] = useState({
    HouseholdId: "",
    HouseholdName: "",
    PersonId: "",
    Parent_1_Name_and_Email: "",
    Parent_2_Name_and_Email: "",
    Who_is_completing_the_form: "",
    Country: "",
    City: "",
    Comments: "",
    Child1LearningMode: "",
    Child2LearningMode: "",
    Child3LearningMode: "",
    Child4LearningMode: "",
    Child5LearningMode: "",
    children: [],
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const countries = getNames().sort();

  const learningOptions = [
    "Attending online classes in person (Synchronous)",
    "Unable to attend online classes in person and requiring offline resources for learning (Asynchronous)",
    "Doing a mixture of in person and offline",
    "Enrolling in local school for now",
  ];

  useEffect(() => {
    axios
      .get("https://acs-return-notice-1086168806252.europe-west1.run.app/api/location-form-data", {
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
            Country: res.data.formData.Country || "",
            City: res.data.formData.City || "",
            Comments: res.data.formData.Comments || "",
            Child1LearningMode: res.data.formData.Child1LearningMode || "",
            Child2LearningMode: res.data.formData.Child2LearningMode || "",
            Child3LearningMode: res.data.formData.Child3LearningMode || "",
            Child4LearningMode: res.data.formData.Child4LearningMode || "",
            Child5LearningMode: res.data.formData.Child5LearningMode || "",
            children: res.data.formData.children || [],
          });
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load location form data.");
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

  const getLearningModeFieldName = (studentNumber) => {
    return `Child${studentNumber}LearningMode`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(
        "https://acs-return-notice-1086168806252.europe-west1.run.app/api/location-notice",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Location form submitted successfully.");
      alert("Location form submitted successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to submit location form.");
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
      <div style={{ maxWidth: "800px", margin: "1.5rem auto" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "0.75rem", textAlign: "left" }}>
            <label>Household ID</label>
            <input
              type="text"
              name="HouseholdId"
              value={formData.HouseholdId}
              className="form-control"
              readOnly
            />
          </div>

          <div style={{ marginBottom: "0.75rem", textAlign: "left" }}>
            <label>Household Name</label>
            <input
              type="text"
              name="HouseholdName"
              value={formData.HouseholdName}
              className="form-control"
              readOnly
            />
          </div>

          <div style={{ marginBottom: "0.75rem", textAlign: "left" }}>
            <label>Person ID</label>
            <input
              type="text"
              name="PersonId"
              value={formData.PersonId}
              className="form-control"
              readOnly
            />
          </div>

          <div style={{ marginBottom: "0.75rem", textAlign: "left" }}>
            <label>Parent 1 Name & Email</label>
            <input
              type="text"
              name="Parent_1_Name_and_Email"
              value={formData.Parent_1_Name_and_Email}
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
              required
            />
          </div>

          <div style={{ marginBottom: "0.75rem", textAlign: "left" }}>
            <label>What Country are you in?</label>
            <select
                name="Country"
                value={formData.Country}
                onChange={handleChange}
                className="form-control"
                required
            >
                <option value="">Select country</option>
                {countries.map((country) => (
                <option key={country} value={country}>
                    {country}
                </option>
                ))}
            </select>
            </div>

          <div style={{ marginBottom: "0.75rem", textAlign: "left" }}>
            <label>What City are you in?</label>
            <input
              type="text"
              name="City"
              value={formData.City}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div style={{ marginTop: "1.5rem", marginBottom: "1rem" }}>
            <h4>Children</h4>
          </div>

          {formData.children.length > 0 ? (
            formData.children.map((child) => {
              const fieldName = getLearningModeFieldName(child.studentNumber);

              return (
                <div
                  key={child.studentNumber}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "1rem",
                    marginBottom: "1rem",
                    textAlign: "left",
                  }}
                >
                  <div style={{ marginBottom: "0.75rem" }}>
                    <label className="font-bold">{`Child ${child.studentNumber} Details:`}</label>
                    <textarea
                      className="form-control"
                      rows="1"
                      readOnly
                    //   value={`${child.personId || ""} - ${child.fullName || ""} - ${child.grade || ""} - ${child.homeroom || ""}`}
                      value={`${child.fullName || ""} - ${child.grade || ""}`}
                    
                    />
                  </div>

                  <div style={{ marginBottom: "0.75rem" }}>
                    <label>{`Child ${child.studentNumber} Learning Mode`}</label>
                    <select
                      name={fieldName}
                      value={formData[fieldName] || ""}
                      onChange={handleChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select learning mode</option>
                      {learningOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No child records found.</p>
          )}

          <div style={{ marginBottom: "0.75rem", textAlign: "left" }}>
            <label>Comments</label>
            <textarea
              name="Comments"
              value={formData.Comments}
              onChange={handleChange}
              className="form-control"
              rows="4"
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

export default LocationForm;