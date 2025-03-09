import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaHandHoldingHeart, FaChartLine, FaSearch, FaUserShield, FaMobileAlt, FaUsers } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

const AboutPage = () => {
  // Animations for sections coming into view
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const staggerChildren = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const featureAnimation = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  // For triggering animations when elements come into view
  const controlsHero = useAnimation();
  const controlsMission = useAnimation();
  const controlsFeatures = useAnimation();
  const controlsHow = useAnimation();
  const controlsTech = useAnimation();

  const [refHero, inViewHero] = useInView({ threshold: 0.3, triggerOnce: true });
  const [refMission, inViewMission] = useInView({ threshold: 0.3, triggerOnce: true });
  const [refFeatures, inViewFeatures] = useInView({ threshold: 0.2, triggerOnce: true });
  const [refHow, inViewHow] = useInView({ threshold: 0.3, triggerOnce: true });
  const [refTech, inViewTech] = useInView({ threshold: 0.3, triggerOnce: true });

  useEffect(() => {
    if (inViewHero) controlsHero.start('visible');
    if (inViewMission) controlsMission.start('visible');
    if (inViewFeatures) controlsFeatures.start('visible');
    if (inViewHow) controlsHow.start('visible');
    if (inViewTech) controlsTech.start('visible');
  }, [controlsHero, controlsMission, controlsFeatures, controlsHow, controlsTech, inViewHero, inViewMission, inViewFeatures, inViewHow, inViewTech]);

  // Feature data
  const features = [
    {
      icon: <FaHandHoldingHeart size={32} />,
      title: "User-Friendly Fundraiser Creation",
      description: "Set up fundraisers quickly with a title, description, goal amount, and cover image."
    },
    {
      icon: <FaMobileAlt size={32} />,
      title: "UPI-Based Donations",
      description: "Supporters can contribute directly using Google Pay or PhonePe by scanning a QR code."
    },
    {
      icon: <FaChartLine size={32} />,
      title: "Real-Time Progress Tracking",
      description: "Watch your fundraiser grow with a progress bar showing real-time donations."
    },
    {
      icon: <FaUsers size={32} />,
      title: "Donor Recognition",
      description: "Showcase donors' names in a dedicated section, giving credit to contributors."
    },
    {
      icon: <FaSearch size={32} />,
      title: "Search & Category-Based Filtering",
      description: "Explore fundraisers by category or search for specific campaigns."
    },
    {
      icon: <MdDashboard size={32} />,
      title: "Personalized User Dashboard",
      description: "Track donations and manage the fundraisers you've created in one place."
    },
    {
      icon: <FaUserShield size={32} />,
      title: "Secure Authentication",
      description: "Register and log in securely to create fundraisers, donate, and track impact."
    }
  ];

  // Updated How it works steps
  const steps = [
    {
      number: "1",
      title: "Create a Fundraiser",
      description: "Sign up, fill in the fundraiser details, upload an image, and set a target amount."
    },
    {
      number: "2",
      title: "Generate Your QR Code",
      description: "Our platform creates a custom UPI QR code linked directly to your bank account."
    },
    {
      number: "3",
      title: "Receive Donations",
      description: "Supporters donate via UPI by scanning your QR code, and contributions are reflected in real-time."
    },
    {
      number: "4",
      title: "Track Your Impact",
      description: "Monitor your fundraiser's progress through your personalized dashboard as funds deposit directly to your account."
    }
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      {/* Hero Section */}
      <motion.section
        ref={refHero}
        initial="hidden"
        animate={controlsHero}
        variants={fadeIn}
        className="py-20 px-4 text-center"
      >
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-blue-600 mb-4">Empower Change Through Giving</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform connects generous hearts with meaningful causes, making fundraising accessible to everyone.
          </p>
          
          <motion.div 
            className="mt-12"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <img 
              src="/api/placeholder/800/400" 
              alt="Fundraising platform illustration" 
              className="rounded-lg shadow-2xl mx-auto"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        ref={refMission}
        initial="hidden"
        animate={controlsMission}
        variants={fadeIn}
        className="py-20 px-4 bg-blue-600 text-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Our Mission</h2>
          <p className="text-xl leading-relaxed">
            We're dedicated to empowering individuals and organizations to raise funds for causes that matter. Whether it's medical emergencies, education, disaster relief, community projects, or personal causes, our platform provides a seamless and transparent way to start and manage fundraisers.
          </p>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        ref={refFeatures}
        initial="hidden"
        animate={controlsFeatures}
        variants={staggerChildren}
        className="py-20 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-blue-600">Key Features</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={featureAnimation}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-blue-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        ref={refHow}
        initial="hidden"
        animate={controlsHow}
        variants={fadeIn}
        className="py-20 px-4 bg-gray-50"
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-blue-600">How It Works</h2>
          
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-blue-200 hidden md:block" 
                 style={{ transform: 'translateX(-0.5px)' }}></div>
            
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className={`flex flex-col md:flex-row items-center mb-12 last:mb-0 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className={`md:w-1/2 flex ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'} mb-6 md:mb-0`}>
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold z-10">
                    {step.number}
                  </div>
                </div>
                
                <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Technology Section */}
      <motion.section
        ref={refTech}
        initial="hidden"
        animate={controlsTech}
        variants={fadeIn}
        className="py-20 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-blue-600">Built With Modern Technology</h2>
          <p className="text-xl leading-relaxed text-gray-600 mb-12">
            Our platform is powered by a robust tech stack to ensure security, performance, and a seamless user experience.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h3 className="font-bold text-lg">React.js</h3>
              <p className="text-gray-600">Frontend</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h3 className="font-bold text-lg">Node.js</h3>
              <p className="text-gray-600">Backend</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h3 className="font-bold text-lg">MongoDB</h3>
              <p className="text-gray-600">Database</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h3 className="font-bold text-lg">Cloudinary</h3>
              <p className="text-gray-600">Image Storage</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="py-20 px-4 bg-blue-600 text-white text-center"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8">Join thousands of individuals and organizations who are already creating impact through our platform.</p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            <motion.button 
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-blue-50 transition-colors duration-300"
            >
              Start a Fundraiser
            </motion.button>
            
            <motion.button 
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-blue-600 transition-colors duration-300"
            >
              Explore Causes
            </motion.button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutPage;