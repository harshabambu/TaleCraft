import React, { useState } from 'react';

function ImageUploader() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

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

  const handleUrlSubmit = () => {
    if (imageUrl) {
      setSelectedImage(null);
      setPreview(imageUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedImage) {
      const formData = new FormData();
      formData.append('image', selectedImage);
      console.log('Form submitted with image file:', selectedImage);
    } else if (imageUrl) {
      console.log('Form submitted with image URL:', imageUrl);
    } else {
      alert('Please select an image or provide a URL before submitting!');
    }
  };

  return (
    <div className="container">
      <h1 className="title">Image Uploader</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="file-input"
        style={{textAlign: 'center' }}
      />
     <p>---or---</p>
      <div className="url-input-container">
        <input
          type="text"
          placeholder="Enter image URL"
          value={imageUrl}
          onChange={handleUrlChange}
          className="url-input"
          style={{maxWidth: '400px', height: '30px', borderRadius: '10px', textAlign: 'center'}}
        />
        <button onClick={handleUrlSubmit} className="url-submit-button">
          Load URL
        </button>
      </div>
      {preview && <img src={preview} alt="Selected" className="image-preview" />}
      <button onClick={handleSubmit} className="submit-button">
        Submit
      </button>
    </div>
  );
}

export default ImageUploader;
