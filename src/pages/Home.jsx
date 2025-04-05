import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div
      className="hero-section min-h-[80vh] flex items-center justify-center text-white bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/background.png')",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backgroundBlendMode: "multiply",
      }}
    >
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-poppins mb-6">
          A farmer's true partner from soil to sale.
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Built for farmers, by those who care — BeejSeBazaar blends trust,
          technology, and tradition to grow smarter futures
        </p>
        <Link
          to="/services"
          className="inline-block px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 hover:bg-blue-600"
        >
          <span className="transition-opacity duration-500 group-hover:opacity-0">
            Get Started
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Home;
