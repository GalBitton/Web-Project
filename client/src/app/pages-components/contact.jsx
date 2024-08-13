import React, {useState} from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import InputField from "@/components/form/inputfield";

/**
 * ContactUs component for displaying contact information and a contact form.
 * @component
 */
const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    /**
     * Handles input changes for the form fields.
     * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - The input change event.
     */
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    /**
     * Handles form submission.
     * @param {React.FormEvent<HTMLFormElement>} e - The form submit event.
     */
    const handleSubmit = (e) => {
        e.preventDefault();
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
                            <InputField
                                label="Your Name"
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="John Doe"
                            />
                            <InputField
                                label="Your Email"
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="you@example.com"
                            />
                            <InputField
                                label="Your Message"
                                id="message"
                                type="textarea"
                                value={formData.message}
                                onChange={handleInputChange}
                                placeholder="Type your message here..."
                            />
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
