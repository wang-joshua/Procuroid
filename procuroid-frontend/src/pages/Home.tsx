import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/videos/bg-video.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      <nav className="absolute top-0 left-0 w-full flex justify-between items-center px-8 py-4 z-10 text-white">
        <h1 className="text-2xl font-semibold">Procuroid</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/signin')}
            className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg hover:bg-white/30 transition"
          >
            Log In
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
          >
            Sign Up
          </button>
        </div>
      </nav>

      <div className="relative z-10 flex flex-col justify-center items-start h-full px-12 text-white max-w-2xl">
        <h2 className="text-5xl font-bold mb-4">Simplify Your Procurement Workflow</h2>
        <p className="text-lg mb-6">
          Automate, manage, and track procurement operations seamlessly with Procuroid.
        </p>
        <button
          onClick={() => navigate('/signin')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg transition"
        >
          Get Started
        </button>
      </div>

      <footer className="absolute bottom-0 w-full text-center text-white/80 py-4 text-sm">
        © {new Date().getFullYear()} Procuroid. All rights reserved.
      </footer>
    </div>
  );
}
