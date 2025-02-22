const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 text-center">
      <div className="container mx-auto px-4">
        <p className="text-gray-400">Contact us:</p>
        <div className="mt-2 space-y-2">
          <a href="mailto:contributor1.email@example.com" className="block text-gray-300 hover:text-white">
            ✉️ contributor1.email@example.com
          </a>
          <a href="mailto:contributor2.email@example.com" className="block text-gray-300 hover:text-white">
            ✉️ contributor2.email@example.com
          </a>
          <a
            href="https://www.linkedin.com/in/contributor1-profile"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-gray-300 hover:text-white"
          >
            🔗 Contributor 1 LinkedIn
          </a>
          <a
            href="https://www.linkedin.com/in/contributor2-profile"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-gray-300 hover:text-white"
          >
            🔗 Contributor 2 LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
