import Image from "next/image";
import Link from "next/link";

const HomeBanner = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-12 py-8 md:py-16 bg-black text-white">
      <div className="w-full md:w-1/2 pr-0 md:pr-8 mb-8 md:mb-0  md:px-30 sm:px-10 ">
        <h1 className="text-5xl sm:text-5xl md:text-5xl lg:text-7xl  font-bold leading-tight">
          Collaborate, Learn, Succeed <br />
          <span className="text-cyan-400">Together</span>
        </h1>

        <p className="text-gray-300 mt-4 md:mt-6 text-base md:text-lg">
          The all-in-one platform for student collaboratre on study sessions,
          share whiteboards, and code in real-time
        </p>

        <div className="mt-6 md:mt-8">
          <Link
            href="/dashboard"
            className="inline-block bg-teal-800 hover:bg-teal-700 text-white font-semibold px-6 md:px-8 py-3 rounded-full"
          >
            Try Dashboard
          </Link>
        </div>
      </div>

      <div className="w-full md:w-1/2 md:pe-20">
        <div className="rounded-3xl overflow-hidden ">
          <Image
            src="/banner.jpg"
            alt="Student in online collaboration"
            width={600}
            height={400}
            layout="responsive"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
