import React, {useState} from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your form submission logic here
        alert(`Thank you for your message, ${formData.name}! We will get back to you soon.`);
        // Clear form after submission
        setFormData({
            name: '',
            email: '',
            message: ''
        });
    };

    return (
        <div className="mt-20 min-h-screen bg-indigo-100 dark:bg-slate-900 dark:from-gray-800 dark:via-gray-900 dark:to-black p-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 text-gradient bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                        Get in Touch with Us
                    </h1>
                </div>

                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 lg:col-span-6 flex flex-col justify-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg flex-grow">
                        <div>
                            <h2 className="text-4xl font-semibold mb-6 text-black dark:text-white">Contact Information</h2>
                            <p className="text-lg text-gray-700 dark:text-gray-300">
                                Have any questions or need assistance? We are here to help! Feel free to reach out to us through any of the contact methods below.
                            </p>
                        </div>
                        <div className="mt-8 space-y-6">
                            <div className="flex items-center text-lg text-gray-700 dark:text-gray-300">
                                <FaEnvelope className="text-blue-600 mr-3" />
                                <a href="mailto:support@neurosync.com" className="hover:underline">support@neurosync.com</a>
                            </div>
                            <div className="flex items-center text-lg text-gray-700 dark:text-gray-300">
                                <FaPhone className="text-blue-600 mr-3" />
                                <a href="tel:+1234567890" className="hover:underline">+1 (234) 567-890</a>
                            </div>
                            <div className="flex items-center text-lg text-gray-700 dark:text-gray-300">
                                <FaMapMarkerAlt className="text-blue-600 mr-3" />
                                <span>Snunit 51, P.O. Box 113, Snunit 51, Karmiel, 2161002, Israel</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-12 lg:col-span-6 p-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg flex-grow">
                        <h2 className="text-4xl font-semibold mb-6 text-black dark:text-white">Send Us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-lg text-gray-700 dark:text-gray-300">Your Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="mt-2 p-3 w-full border rounded-lg bg-gray-100 dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-lg text-gray-700 dark:text-gray-300">Your Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="mt-2 p-3 w-full border rounded-lg bg-gray-100 dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-lg text-gray-700 dark:text-gray-300">Your Message</label>
                                <textarea
                                    id="message"
                                    rows="6"
                                    className="mt-2 p-3 w-full border rounded-lg bg-gray-100 dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    placeholder="Type your message here..."
                                    value={formData.message}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
                                >
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;