import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-emerald-700 text-white">
      <h1 className="text-8xl font-bold mb-2 animate-bounce">404</h1>
      <h2 className="text-4xl font-bold mb-4">Oops! Page Not Found</h2>
      <p className="text-sm mb-4">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/login"
        className="px-6 py-3 bg-white text-green-700 font-semibold rounded-full hover:bg-gray-200 transition duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
