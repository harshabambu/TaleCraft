import { useState } from "react";
import "./App.css";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleUrlChange = (event) => {
    setImageUrl(event.target.value);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedImage) {
      console.log("Form submitted with image file:", selectedImage);
    } else if (imageUrl) {
      console.log("Form submitted with image URL:", imageUrl);
      setPreview(imageUrl);
    } else {
      alert("Please select an image or provide a URL before submitting!");
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", fontSize: "4rem" }}>Tale Craft</h1>
      <p style={{ textAlign: "center" }}>A storytelling platform</p>
      <form className="form" onSubmit={handleSubmit}>
        <span className="form-title">Upload your file</span>
        <p className="form-paragraph">File should be an image</p>
        <div
          className="drop-container"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <span className="drop-title">Drop files here</span>
          or
          <input
            type="file"
            accept="image/*"
            id="file-input"
            onChange={handleImageChange}
          />
        </div>
        <p>or</p>
        <input
          type="url"
          name="url"
          id="url"
          className="url"
          onChange={handleUrlChange}
          placeholder="Enter image URL"
        />
        {preview && <img src={preview} alt="Preview" className="preview" />}
        <button type="submit" className="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default App;
