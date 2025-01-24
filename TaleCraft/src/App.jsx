import { useState } from "react";
import "./App.css";
function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (event) => {
    setImageUrl(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedImage) {
      const formData = new FormData();
      formData.append("image", selectedImage);
      console.log("Form submitted with image file:", selectedImage);
    } else if (imageUrl) {
      console.log("Form submitted with image URL:", imageUrl);
      setSelectedImage(null);
      setPreview(imageUrl);
    } else {
      alert("Please select an image or provide a URL before submitting!");
    }
  };
  return (
    <>
      <h1 style={{ textAlign: "center", fontSize: "4rem" }}>Tale Craft</h1>
      <p style={{ textAlign: "center" }}>A storytelling platform</p>
      <form class="form" onSubmit={handleSubmit}>
        <span class="form-title">Upload your file</span>
        <p class="form-paragraph">File should be an image</p>
        <label for="file-input" class="drop-container">
          <span class="drop-title">Drop files here</span>
          or
          <input type="file" accept="image/*" required="" id="file-input" onChange={handleImageChange}/>
          or
          <input type="url" name="url" id="url" className="url" onChange={handleUrlChange} placeholder="Enter image url"/>
        </label>
        {preview && <img src={preview} alt="Preview" className="preview"/>}
        <button type="submit" className="submit">Submit</button>
      </form>
    </>
  );
}

export default App;
