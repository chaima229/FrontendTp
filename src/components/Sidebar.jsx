import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="h-screen bg-gray-800 w-64">
      <div className="flex flex-col items-start py-4 m-8">
        <nav className="flex flex-col space-y-4 font-semibold">
          <Link to="/dashboard" className="text-gray-300 hover:text-white hover:font-bold">Dashboard</Link>
          <Link to="/home" className="text-gray-300 hover:text-white hover:font-bold">Home</Link>
          <Link to="/transactions" className="text-gray-300 hover:text-white hover:font-bold">PorteFolio</Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
