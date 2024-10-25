'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import { Sun, Moon, LogIn, LogOut, CreditCard, Repeat, Shield, Zap, Globe, BarChart2, Users, Smartphone, Menu, X, DollarSign, Wallet, PiggyBank } from 'lucide-react'
import WalletButton from "@/components/wallet-button"

const useScrollAnimation = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  
  return { ref, isInView }
}

export default function ExtendedHomePage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true'
    setIsDarkMode(isDark)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
    localStorage.setItem('darkMode', isDarkMode.toString())
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navItems = [
    { name: 'Home', href: '#' },
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Download', href: '#download' },
  ]

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0px 0px 8px rgb(59, 130, 246)" },
    tap: { scale: 0.95 }
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-500 z-50"
        style={{ scaleX }}
      />
      <header className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.h1 
            className="text-2xl font-bold text-blue-600 dark:text-blue-400"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            PayEase
          </motion.h1>
          <nav className="hidden md:flex space-x-4">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {item.name}
              </motion.a>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              <motion.div animate={{ rotate: isDarkMode ? 180 : 0 }} transition={{ duration: 0.5 }}>
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </motion.div>
            </motion.button>
            <AnimatePresence mode="wait">
              {isLoggedIn ? (
                <motion.button
                  key="logout"
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </motion.button>
              ) : (
                <motion.button
                  key="login"
                  onClick={handleLogin}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <LogIn size={20} />
                  <span>Login</span>
                </motion.button>
              )}
            </AnimatePresence>
            <WalletButton />
            <motion.button
              className="md:hidden p-2"
              onClick={toggleMenu}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              className="md:hidden bg-white dark:bg-gray-800 shadow-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </motion.a>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className="pt-20">
        <section className="hero bg-blue-50 dark:bg-gray-800 py-20 transition-colors duration-300 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <motion.div 
                className="md:w-1/2 mb-10 md:mb-0"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Simplify Your Payments with PayEase</h2>
                <p className="text-xl mb-8">Fast, secure, and easy-to-use payment solutions for everyone.</p>
                <motion.button 
                  className="px-6 py-3 bg-blue-500 text-white rounded-full text-lg font-semibold hover:bg-blue-600 transition-colors duration-300"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Get Started
                </motion.button>
              </motion.div>
              <motion.div 
                className="md:w-1/2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <img src="/placeholder.svg?height=400&width=600" alt="PayEase App Interface" className="rounded-lg shadow-xl" />
              </motion.div>
            </div>
          </div>
          <motion.div
            className="absolute top-1/4 left-1/4 text-blue-500 opacity-50"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, 0],
              transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <DollarSign size={48} />
          </motion.div>
          <motion.div
            className="absolute bottom-1/4 right-1/4 text-green-500 opacity-50"
            animate={{
              y: [0, 20, 0],
              rotate: [0, -10, 0],
              transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <Wallet size={48} />
          </motion.div>
        </section>

        <section id="features" className="features py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose PayEase?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: <CreditCard size={40} />, title: "Easy Transactions", description: "Send and receive money with just a few taps." },
                { icon: <Shield size={40} />, title: "Secure Payments", description: "Bank-level encryption keeps your money safe." },
                { icon: <Repeat size={40} />, title: "Instant Transfers", description: "Transfer funds in real-time, 24/7." },
                { icon: <Globe size={40} />, title: "Global Reach", description: "Send money to over 200 countries worldwide." },
                { icon: <BarChart2 size={40} />, title: "Financial Insights", description: "Track your spending and manage your budget effortlessly." },
                { icon: <Zap size={40} />, title: "Lightning Fast", description: "Experience the fastest payment processing in the industry." },
              ].map((feature, index) => {
                const { ref, isInView } = useScrollAnimation()
                return (
                  <motion.div 
                    key={index}
                    ref={ref}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300"
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <motion.div 
                      className="text-blue-500 dark:text-blue-400 mb-4"
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : { scale: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p>{feature.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="how-it-works bg-gray-50 dark:bg-gray-800 py-20 transition-colors duration-300 relative">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How PayEase Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: 1, title: "Create an Account", description: "Sign up for free in minutes and verify your identity." },
                { step: 2, title: "Add Funds", description: "Link your bank account or add money via credit/debit card." },
                { step: 3, title: "Start Transacting", description: "Send money, pay bills, or shop online with ease." },
              ].map((item, index) => {
                const { ref, isInView } = useScrollAnimation()
                return (
                  <motion.div 
                    key={index}
                    ref={ref}
                    className="flex flex-col items-center text-center"
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    
                    <motion.div 
                      className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4"
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : { scale: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 + 0.2 }}
                    >
                      {item.step}
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p>{item.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500 opacity-10"
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
              transition: { duration: 20, repeat: Infinity, ease: "linear" }
            }}
          >
            <PiggyBank size={200} />
          </motion.div>
        </section>

        <section id="testimonials" className="testimonials py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "John Doe", role: "Small Business Owner", quote: "PayEase has revolutionized how I manage my business finances. It's incredibly user-friendly and secure." },
                { name: "Jane Smith", role: "Freelancer", quote: "As a freelancer, getting paid used to be a hassle. With PayEase, I receive payments instantly from clients worldwide." },
                { name: "Alex Johnson", role: "Student", quote: "PayEase makes splitting bills with roommates so easy. No more awkward conversations about who owes what!" },
              ].map((testimonial, index) => {
                const { ref, isInView } = useScrollAnimation()
                return (
                  <motion.div 
                    key={index}
                    ref={ref}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-300"
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <p className="mb-4 italic">"{testimonial.quote}"</p>
                    <div className="flex items-center">
                      <motion.div 
                        className="w-12 h-12 bg-gray-300 rounded-full mr-4"
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : { scale: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                      ></motion.div>
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        <section id="download" className="app-showcase bg-blue-50 dark:bg-gray-800 py-20 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <motion.div 
                className="md:w-1/2 mb-10 md:mb-0"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience PayEase on the Go</h2>
                <p className="text-xl mb-8">Download our mobile app and take control of your finances anytime, anywhere.</p>
                <div className="flex space-x-4">
                  <motion.button 
                    className="px-6 py-3 bg-black text-white rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors duration-300 flex items-center"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                    App Store
                  </motion.button>
                  <motion.button 
                    className="px-6 py-3 bg-black text-white rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors duration-300 flex items-center"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-1.392 0 .988.988 0 0 1 0-1.39L10.61 12 2.218 3.203a.988.988 0 0 1 0-1.389.996.996 0 0 1 1.39 0zm6.174 0L20 12 9.783 22.186a.996.996 0 0 1-1.391 0 .988.988 0 0 1 0-1.39L17.61 12 8.392 3.203a.988.988 0 0 1 0-1.389.996.996 0 0 1 1.39 0z"/></svg>
                    Google Play
                  </motion.button>
                </div>
              </motion.div>
              <motion.div 
                className="md:w-1/2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(59, 130, 246, 0.5)" }}
              >
                <img src="/placeholder.svg?height=600&width=300" alt="PayEase Mobile App" className="mx-auto rounded-3xl shadow-2xl" />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="cta bg-blue-500 dark:bg-blue-600 text-white py-20 transition-colors duration-300">
          <div className="container mx-auto px-4 text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Ready to Simplify Your Payments?
            </motion.h2>
            <motion.p 
              className="text-xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Join thousands of satisfied users and experience the future of payments today.
            </motion.p>
            <motion.button 
              className="px-8 py-4 bg-white text-blue-500 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Sign Up Now
            </motion.button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-200 dark:bg-gray-800 py-12 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About PayEase</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">Our Story</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">Careers</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Products</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">Personal</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">Business</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">Partners</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">Help Center</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">Blog</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">Developers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">Twitter</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">Facebook</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-300 dark:border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
                © 2023 PayEase. All rights reserved.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">Terms of Service</a>
                <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">Privacy Policy</a>
                <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}