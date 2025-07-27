import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full p-5">
      <div className="w-full bg-second h-2 py-8 px-4 ">
        <h2 className="text-2xl md:text-4xl font-bold text-center text-second">
          Ready To Improve Your Study Sessions?
        </h2>
      </div>

      {/* Footer Content */}
      <div className="w-full bg-black text-white py-6 px-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          {/* Copyright */}
          <div className="mb-4 md:mb-0">
            <p className="text-lg font-semibold">BrainSync© 2024</p>
          </div>

          {/* Footer Links */}
          <div className=" md:flex items-center space-x-4 lg:space-x-8">
            <Link href="/terms" className="hover:text-gray-300">
              Terms & Conditions
            </Link>
            <Link href="/faq" className="hover:text-gray-300">
              FAQ
            </Link>
            <Link href="/privacy" className="hover:text-gray-300">
              Privacy & Policy
            </Link>
            <Link href="/help" className="hover:text-gray-300">
              Help
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
