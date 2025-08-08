"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

const HomeBanner = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-12 py-8 md:py-16 bg-black text-white overflow-hidden">
      <motion.div
        className="w-full md:w-1/2 pr-0 md:pr-8 mb-8 md:mb-0 md:px-30 sm:px-10"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <motion.h1
          className="text-5xl sm:text-5xl md:text-5xl lg:text-7xl font-bold leading-tight"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2, ease: "easeOut" }}
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Collaborate, Learn, Succeed
          </motion.span>
          <br />
          <motion.span
            className="text-cyan-400"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: 0.2, ease: "easeOut" }}
          >
            Together
          </motion.span>
        </motion.h1>
        <motion.p
          className="text-gray-300 mt-4 md:mt-6 text-base md:text-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        >
          The all-in-one platform for student collaborate on study sessions,
          share whiteboards, and code in real-time
        </motion.p>

        <motion.div
          className="mt-6 md:mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1, ease: "easeOut" }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href="/dashboard"
              className="inline-block bg-teal-800 hover:bg-teal-700 text-white font-semibold px-6 md:px-8 py-3 rounded-full transition-colors duration-300"
            >
              Try Dashboard
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="w-full md:w-1/2 md:pe-20"
        initial={{ opacity: 0, x: 100, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      >
        <motion.div
          className="rounded-3xl overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <Image
              src="/banner.jpg"
              alt="Student in online collaboration"
              width={600}
              height={400}
              layout="responsive"
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomeBanner;
