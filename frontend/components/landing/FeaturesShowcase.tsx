"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGroup,
  faWindowRestore,
  faListCheck,
  faCode,
  faDesktop,
  faUserLock,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "motion/react";

const FeatureCard = (props: {
  icon: any;
  title: string;
  description: string;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { duration: 0.3 }
      }}
      whileHover={{ 
        scale: 1.05,
          transition: { duration: 0.2 }
      }}
      viewport={{ once: true, margin: "-50px" }}
      className="cursor-pointer"
    >
      <div className="flex flex-col items-center text-center mb-12">
        <motion.div 
          className="bg-gray-900 rounded-full w-24 h-24 flex items-center justify-center mb-6"
          whileHover={{ 
            scale: 1.1,
            transition: { duration: 0.3 }
          }}
        >
          <FontAwesomeIcon
            icon={props.icon}
            className="text-cyan-400 text-3xl"
          />
        </motion.div>

        <motion.h3 
          className="text-xl font-bold mb-3"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ 
            opacity: 1, 
            x: 0,
            transition: { delay: props.index * 0.1 + 0.2, duration: 0.5 }
          }}
          viewport={{ once: true }}
        >
          {props.title}
        </motion.h3>

        
        <motion.p 
          className="text-gray-400 max-w-xs"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ 
            opacity: 1, 
            y: 0,
            transition: { delay: props.index * 0.1 + 0.3, duration: 0.5 }
          }}
          viewport={{ once: true }}
        >
          {props.description}
        </motion.p>
      </div>
    </motion.div>
  );
};

const FeaturesShowcase = () => {
  const features = [
    {
      icon: faUserGroup,
      title: "Collaborative Sessions",
      description: "Create and join study sessions with peers in real-time",
    },
    {
      icon: faWindowRestore,
      title: "Shared Resources",
      description:
        "Access whiteboards, PDF notes, and code editors all in one place",
    },
    {
      icon: faListCheck,
      title: "Track Progress",
      description: "Monitor your study sessions and academic improve",
    },
    {
      icon: faCode,
      title: "Code Together",
      description: "Collaborate on coding problems with real-time editing",
    },
    {
      icon: faDesktop,
      title: "Cross-Platform",
      description: "Access from any device, anywhere, anytime",
    },
    {
      icon: faUserLock,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security",
    },
  ];

  return (
    <section className="py-16 px-4 bg-customGrey">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent"
            whileInView={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Why Choose Brain Sync?
          </motion.h2>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesShowcase;