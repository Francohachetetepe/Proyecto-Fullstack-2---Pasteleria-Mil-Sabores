<<<<<<< Updated upstream
const Button = ({ children, type = "submit", ...props }) => (
    <button type={type} {...props} className="btn btn-primary">
      {children}
    </button>
  );
  export default Button;  
=======
const Button = ({ children, ...props}) => (
    <button {...props}>{children}</button>
);
export default Button;
>>>>>>> Stashed changes
