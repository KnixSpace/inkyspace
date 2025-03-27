"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { forwardRef, type Ref } from "react";

type BlogCardProps = {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  delay: number;
};

const BlogCard = ({
  title,
  excerpt,
  author,
  date,
  image,
  delay,
}: BlogCardProps) => {
  return (
    <motion.div
      className="flex flex-col bg-white rounded-lg overflow-hidden border-2 border-dashed border-gray-300"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.1 }}
      whileHover={{ y: -6, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="relative h-48 w-full">
        <Image
          src={"/sketch-bg.png"}
          alt={title}
          fill
          className="object-cover h-full w-full"
        />
      </div>
      <div className="p-6 flex flex-col justify-end">
        <h3 className="text-2xl font-semibold mb-2 truncate">{title}</h3>
        <p className="text-gray-600 mb-4 truncate">{excerpt}</p>
        <div className="flex justify-between items-center gap-4 text-gray-500">
          <span className="text-rose-500 w-32 truncate">{author}</span>
          <span>{date}</span>
        </div>
        <motion.div
          className="mt-4"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="#"
            className="inline-block px-4 py-1 text-purple-500 border border-purple-500 rounded hover:bg-purple-50"
          >
            Read More
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

type Props = {};
const FeaturedBlogs = (props: Props, ref: Ref<HTMLDivElement>) => {
  const blogs = [
    {
      title: "The Art of Creative Writing",
      excerpt:
        "Discover techniques to unlock your creative potential and write compelling stories.",
      author: "Emma Johnson",
      date: "May 15, 2023",
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      title: "Building a Personal Brand",
      excerpt:
        "Learn how to establish yourself as an authority in your niche through consistent blogging.",
      author: "Michael Chen",
      date: "June 2, 2023",
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      title: "The Future of Digital Publishing",
      excerpt:
        "Exploring emerging trends and technologies shaping the future of online content creation.",
      author: "Sarah Williams",
      date: "June 18, 2023",
      image: "/placeholder.svg?height=300&width=500",
    },
  ];

  return (
    <section
      ref={ref}
      className="py-20 px-6 mb-20 rounded-2xl border-2 border-gray-300 border-dashed"
    >
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
          <span className="underline decoration-purple-500 underline-offset-8 decoration-2">
            Featured
          </span>{" "}
          Threads
        </motion.h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover inspiring content from our community of writers
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.map((blog, index) => (
          <BlogCard
            key={index}
            title={blog.title}
            excerpt={blog.excerpt}
            author={blog.author}
            date={blog.date}
            image={blog.image}
            delay={index}
          />
        ))}
      </div>

      <motion.div
        className="text-center mt-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        viewport={{ once: true }}
      >
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <Link
            href="#"
            className="px-8 py-2 text-xl bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            Explore All Blogs
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

FeaturedBlogs.displayName = "FeaturedBlogs";

export default forwardRef(FeaturedBlogs);
