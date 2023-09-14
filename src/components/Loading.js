import Spinner from "react-bootstrap/Spinner";

const Loading = ({ message }) => {
  return (
    <div className="text-center my-5">
      <Spinner animation="grow" />
      <p className="my-2">{message}</p>
    </div>
  );
};

export default Loading;
