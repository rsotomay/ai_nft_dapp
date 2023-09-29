import Form from "react-bootstrap/Form";

function ImageLoader({ setSelectedImageData, setSelectedImage }) {
  // Function for user to load an image
  const imageLoaderHandler = (e) => {
    const file = e.target.files[0]; // Get the first selected file

    if (file) {
      const reader = new FileReader();

      // Callback function when the file is loaded
      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        setSelectedImageData(arrayBuffer);

        // Create a Data URL from the ArrayBuffer
        const dataURL = arrayBufferToDataURL(arrayBuffer);
        setSelectedImage(dataURL);
      };

      // Read the selected file as ArrayBuffer
      reader.readAsArrayBuffer(file);
    }
  };

  // Helper function to convert ArrayBuffer to Data URL
  const arrayBufferToDataURL = (arrayBuffer) => {
    const blob = new Blob([arrayBuffer]);
    return URL.createObjectURL(blob);
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
