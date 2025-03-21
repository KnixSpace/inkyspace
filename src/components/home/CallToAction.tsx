"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const CallToAction = () => {
  return (
    <section className="py-20 mb-20">
      <motion.div
        className="max-w-5xl mx-auto bg-gradient-to-r from-rose-400/20 to-purple-500/20 rounded-2xl p-12 border-2 border-dashed border-gray-300 relative overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="absolute -top-20 -right-20 w-64 h-64 bg-purple-400 rounded-full opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-rose-400 rounded-full opacity-20"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        <div className="relative z-10">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 text-center"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to share your ideas with the world?
          </motion.h2>

          <motion.p
            className="text-xl text-gray-700 mb-8 text-center max-w-2xl mx-auto"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join thousands of writers who have found their voice on InkySpace.
            Start your blog today and connect with readers who care about what
            you have to say.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/signup"
                className="inline-block px-8 py-3 bg-black text-white rounded-lg text-lg font-medium hover:text-rose-400  transition-all ease-in-out duration-500"
              >
                Create Your Blog
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/pricing"
                className="inline-block px-8 py-3 bg-white border border-black rounded-lg text-lg font-medium hover:text-purple-500 transition-all ease-in-out duration-500"
              >
                View Pricing
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default CallToAction;
