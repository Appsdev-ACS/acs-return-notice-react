import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import axios from "axios";
import { getNames } from "country-list";

function LocationForm() {
  const getSupportedTimeZones = () => {
    if (typeof Intl !== "undefined" && typeof Intl.supportedValuesOf === "function") {
      return Intl.supportedValuesOf("timeZone");
    }

    return [
      "UTC",
      "Africa/Cairo",
      "Africa/Johannesburg",
      "America/Chicago",
      "America/Denver",
      "America/Los_Angeles",
      "America/New_York",
      "America/Toronto",
      "Asia/Dubai",
      "Asia/Hong_Kong",
      "Asia/Karachi",
      "Asia/Kolkata",
      "Asia/Riyadh",
      "Asia/Singapore",
      "Asia/Tokyo",
      "Australia/Melbourne",
      "Australia/Perth",
      "Australia/Sydney",
      "Europe/Berlin",
      "Europe/Istanbul",
      "Europe/London",
      "Europe/Paris",
      "Pacific/Auckland",
    ];
  };

  const formatTimeZoneLabel = (timeZone) => {
    try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone,
        timeZoneName: "shortOffset",
      });

      const parts = formatter.formatToParts(now);
      const offsetPart = parts.find((part) => part.type === "timeZoneName");
      const offset = offsetPart ? offsetPart.value.replace("GMT", "UTC") : "UTC";

      return `(${offset}) ${timeZone.replace(/_/g, " ")}`;
    } catch {
      return timeZone.replace(/_/g, " ");
    }
  };

  const [formData, setFormData] = useState({
    HouseholdId: "",
    HouseholdName: "",
    PersonId: "",
    Parent_1_Name_and_Email: "",
    Parent_2_Name_and_Email: "",
    Who_is_completing_the_form: "",
    Country: "",
    City: "",
    TimeZone: "",
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
  const timeZones = getSupportedTimeZones();

  const learningOptions = [
    "Attending online classes in person (Synchronous)",
    "Unable to attend online classes in person; working asynchronously",
    "Attending some classes in person and working asynchronously in others",
    "Enrolling in local school for now",
  ];

  useEffect(() => {
    axios
      .get("https://acs-return-notice-1086168806252.europe-west1.run.app/api/location-form-data", {
        withCredentials: true,
      })
      .then((res) => {
        const detectedTimeZoneRaw =
          typeof Intl !== "undefined"
            ? Intl.DateTimeFormat().resolvedOptions().timeZone || ""
            : "";

        const detectedTimeZone = detectedTimeZoneRaw
          ? formatTimeZoneLabel(detectedTimeZoneRaw)
          : "";

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
            TimeZone: res.data.formData.TimeZone || detectedTimeZone || "",
            Comments: res.data.formData.Comments || "",
            Child1LearningMode: res.data.formData.Child1LearningMode || "",
            Child2LearningMode: res.data.formData.Child2LearningMode || "",
            Child3LearningMode: res.data.formData.Child3LearningMode || "",
            Child4LearningMode: res.data.formData.Child4LearningMode || "",
            Child5LearningMode: res.data.formData.Child5LearningMode || "",
            children: res.data.formData.children || [],
          });
        } else {
          setFormData((prev) => ({
            ...prev,
            TimeZone: detectedTimeZone || "",
          }));
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
          {/* <div style={{ marginBottom: "0.75rem", textAlign: "left" }}>
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
          </div> */}

          <input type="hidden" name="HouseholdId" value={formData.HouseholdId} />
          <input type="hidden" name="HouseholdName" value={formData.HouseholdName} />
          <input type="hidden" name="PersonId" value={formData.PersonId} />

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
            <label>What country are you in?</label>
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
            <label>What city are you in?</label>
            <input
              type="text"
              name="City"
              value={formData.City}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          

          <div style={{ marginBottom: "0.75rem", textAlign: "left" }}>
            <label>Time Zone</label>
            <select
              name="TimeZone"
              value={formData.TimeZone}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select time zone</option>
              {timeZones.map((tz) => {
                const label = formatTimeZoneLabel(tz);
                return (
                  <option key={tz} value={label}>
                    {label}
                  </option>
                );
              })}
            </select>
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

