import React, { useState } from "react";

const DynamicForm = () => {
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [submittedData, setSubmittedData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // New state for error handling

  const apiResponses = {
    "User Information": {
      fields: [
        { name: "firstName", type: "text", label: "First Name", required: true },
        { name: "lastName", type: "text", label: "Last Name", required: true },
        { name: "age", type: "number", label: "Age", required: false },
      ],
    },
    "Address Information": {
      fields: [
        { name: "street", type: "text", label: "Street", required: true },
        { name: "city", type: "text", label: "City", required: true },
        {
          name: "state",
          type: "dropdown",
          label: "State",
          options: ["California", "Texas", "New York"],
          required: true,
        },
        { name: "zipCode", type: "text", label: "Zip Code", required: false },
      ],
    },
    "Payment Information": {
      fields: [
        { name: "cardNumber", type: "text", label: "Card Number", required: true },
        { name: "expiryDate", type: "date", label: "Expiry Date", required: true },
        { name: "cvv", type: "password", label: "CVV", required: true },
        { name: "cardholderName", type: "text", label: "Cardholder Name", required: true },
      ],
    },
  };

  const handleDropdownChange = (e) => {
    const selectedOption = e.target.value;
    if (selectedOption) {
      const response = apiResponses[selectedOption];
      if (response) {
        setFormFields(response.fields);
        setFormData({});
        setProgress(0);
        setErrorMessage(""); // Clear any previous errors
      } else {
        setErrorMessage("Error loading form fields. Please try again.");
      }
    } else {
      setFormFields([]);
      setFormData({});
      setProgress(0);
      setErrorMessage("");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    const completedFields = Object.keys(updatedFormData).filter(
      (key) => updatedFormData[key] !== ""
    );
    const progressValue = (completedFields.length / formFields.length) * 100;
    setProgress(progressValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (formFields.every((field) => !field.required || formData[field.name])) {
        setSubmittedData([...submittedData, formData]);
        setFormData({});
        setFormFields([]);
        setProgress(0);
        setSuccessMessage("Form submitted successfully!");
        setErrorMessage("");
      } else {
        throw new Error("Please fill in all required fields.");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage("");
    }
  };

  const handleEdit = (index) => {
    setFormData(submittedData[index]);
    setFormFields(apiResponses["User Information"].fields); // Adjust based on your dropdown logic
    setSubmittedData(submittedData.filter((_, i) => i !== index));
  };

  const handleDelete = (index) => {
    const updatedData = submittedData.filter((_, i) => i !== index);
    setSubmittedData(updatedData);
    setSuccessMessage("Entry deleted successfully.");
    setErrorMessage("");
  };

  return (
    <div className="dynamic-form">
      <h1>Dynamic Form</h1>

      {/* Dropdown for Form Type */}
      <select onChange={handleDropdownChange}>
        <option value="">Select Form Type</option>
        {Object.keys(apiResponses).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>

      {/* Form Rendering */}
      <form onSubmit={handleSubmit}>
        {formFields.map((field) => (
          <div key={field.name} className="form-group">
            <label>{field.label}</label>
            {field.type === "dropdown" ? (
              <select
                name={field.name}
                required={field.required}
                onChange={handleInputChange}
                value={formData[field.name] || ""}
              >
                <option value="">Select</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                required={field.required}
                onChange={handleInputChange}
                value={formData[field.name] || ""}
              />
            )}
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>

      {/* Progress Bar */}
      <div className="progress-bar" style={{ width: `${progress}%` }}></div>

      {/* Success Message */}
      {successMessage && <p className="success-message">{successMessage}</p>}

      {/* Error Message */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Submitted Data Table */}
      <table>
        <thead>
          <tr>
            {formFields.map((field) => (
              <th key={field.name}>{field.label}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {submittedData.map((data, index) => (
            <tr key={index}>
              {formFields.map((field) => (
                <td key={field.name}>{data[field.name]}</td>
              ))}
              <td>
                <button onClick={() => handleEdit(index)}>Edit</button>
                <button onClick={() => handleDelete(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicForm;
