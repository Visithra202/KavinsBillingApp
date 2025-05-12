
const Loader = ({ message = "Fetching Items...", size = "md", color = "primary" }) => {
    return (
      <div className="text-center my-4">
        <div className={`spinner-border text-${color} spinner-border-${size}`} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">{message}</p>
      </div>
    );
  };
  
  export default Loader;
  