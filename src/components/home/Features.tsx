"use client";

import type React from "react";
import { motion } from "framer-motion";
import { Feather, BookOpen, Send, Users } from "lucide-react";

type FeatureProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const FeatureCard = ({ icon, title, description }: FeatureProps) => {
  return (
    <motion.div
      className="w-full h-full flex flex-col items-center p-6 rounded-lg border-2 border-dashed border-gray-300"
      whileHover={{ y: -6, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <motion.div
        className="text-4xl mb-4 text-purple-500"
        whileHover={{ rotate: 5, scale: 1.1 }}
      >
        {icon}
      </motion.div>
      <h3 className="text-2xl text-center font-semibold mb-2">{title}</h3>
      <p className="text-center text-gray-600">{description}</p>
    </motion.div>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Feather />,
      title: "Easy Writing",
      description:
        "Intuitive editor with markdown support for effortless content creation.",
    },
    {
      icon: <BookOpen />,
      title: "Beautiful Blogs",
      description:
        "Professionally designed templates that make your content shine.",
    },
    {
      icon: <Send />,
      title: "Newsletter Integration",
      description:
        "Seamlessly send your posts as newsletters to your subscribers.",
    },
    {
      icon: <Users />,
      title: "Community Building",
      description:
        "Grow your audience with built-in social features and analytics.",
    },
  ];

  return (
    <section className="py-20 mb-20">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.h2
          className="text-5xl font-bold mb-4"
          initial={{ y: 50 }}
          whileInView={{ y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="underline decoration-rose-400 underline-offset-8 decoration-2">
            Features
          </span>{" "}
          you'll love
        </motion.h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Everything you need to create, publish, and grow your blog
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
};

export default Features;
