import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";

function ImageLoader({ selectedImage, setSelectedImage }) {
  // Function to handle when a user selects an image
  const handleImageChange = (e) => {
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
      <h2>Load your image</h2>
      <input
        className="mb-2"
        style={{ color: "blue" }}
        type="file"
        accept="image/*" // Specify that only image files are allowed
        onChange={handleImageChange}
      />
    </div>
  );
}

export default ImageLoader;
