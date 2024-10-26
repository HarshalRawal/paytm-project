'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const testimonials = [
    { name: "John Doe", role: "Small Business Owner", quote: "PayEase has revolutionized how I manage my business finances. It's incredibly user-friendly and secure." },
    { name: "Jane Smith", role: "Freelancer", quote: "As a freelancer, getting paid used to be a hassle. With PayEase, I receive payments instantly from clients worldwide." },
    { name: "Alex Johnson", role: "Student", quote: "PayEase makes splitting bills with roommates so easy. No more awkward conversations about who owes what!" },
  ]

  return (
    <section id="testimonials" className="testimonials py-20 bg-gradient-to-b from-white to-indigo-50 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">What Our Users Say</h2>
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl border border-indigo-100 dark:border-gray-700"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <p className="mb-4 italic text-gray-600 dark:text-gray-300">&quot;{testimonial.quote}&quot;</p>
              <div className="flex items-center">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-4"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1, rotateY: 360 } : { scale: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                ></motion.div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}