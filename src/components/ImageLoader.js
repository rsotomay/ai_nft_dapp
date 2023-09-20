import Form from "react-bootstrap/Form";

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
      <h2 style={{ color: "silver" }}>Upload An Image And Mint It</h2>
      <Form.Group
        controlId="formFileLg"
        className="mb-1"
        style={{ width: "28rem", margin: "auto" }}
      >
        <Form.Control
          type="file"
          size="lg"
          style={{ color: "blue" }}
          accept="image/*" // Specify that only image files are allowed
          onChange={imageLoaderHandler}
        />
      </Form.Group>
    </div>
  );
}

export default ImageLoader;
