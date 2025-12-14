import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of your account',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      logout();
      await Swal.fire({
        icon: 'success',
        title: 'Logged out!',
        text: 'You have been successfully logged out.',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Social Network
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-50"
                >
                  Home
                </Link>
                <Link
                  to={`/profile/${user?._id}`}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-50"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

