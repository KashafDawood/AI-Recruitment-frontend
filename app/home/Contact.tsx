import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <section className="bg-gray-100 py-12 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
        <p className="text-gray-300 mb-8">Have a question or want to work together? Feel free to contact me.</p>

        <div className="flex flex-col md:flex-row justify-between items-center bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="text-orange-500 w-6 h-6" />
              <a href="mailto:your.email@example.com" className="text-gray-300 hover:text-white">
                your.email@example.com
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="text-orange-400 w-6 h-6" />
              <span className="text-gray-300">+123 456 7890</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="text-orange-400 w-6 h-6" />
              <span className="text-gray-300">Your City, Country</span>
            </div>
          </div>

          <form className="mt-6 md:mt-0 md:w-1/2">
            <input type="text" placeholder="Your Name" className="w-full bg-blackcolor border border-gray-700 text-white p-3 rounded-lg mb-3" />
            <input type="email" placeholder="Your Email" className="w-full bg-blackcolor border border-gray-700 text-white p-3 rounded-lg mb-3" />
            <textarea placeholder="Your Message" rows={4} className="w-full bg-blackcolor border border-gray-700 text-white p-3 rounded-lg mb-3"></textarea>
            <button className="bg-orange-500 text-black font-bold py-3 px-6 rounded-lg w-full hover:bg-orange-500 transition">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
