function ImageLoader({ setSelectedImage }) {
  // Function to handle when a user selects an image
  const imageLoaderHandler = (e) => {
    const file = e.target.files[0]; // Get the first selected file

    if (file) {
      const reader = new FileReader();

      // Callback function when the file is loaded
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
      };

      // Read the selected file as a Data URL
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="text-center">
      <h2>Upload Your Existing Image and Mint It</h2>
      <input
        className="mb-2"
        style={{ color: "blue" }}
        type="file"
        accept="image/*" // Specify that only image files are allowed
        onChange={imageLoaderHandler}
      />
    </div>
  );
}

export default ImageLoader;
