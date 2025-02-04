const createHandleNavigate = (setIsExiting, navigate) => (path) => {
 setIsExiting(true);
 setTimeout(() => {
  navigate(path);
  setIsExiting(false);
 }, 500);
};

export default createHandleNavigate;
