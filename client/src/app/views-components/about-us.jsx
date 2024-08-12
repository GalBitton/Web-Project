import TeamMemberCard from "@/components/cards/teammembercard";
import pkg from '../../../package.json'

const AboutUs = () => {
    const teamMembers = [
        {
            name: "Nadav Reubens",
            role: "Managing Director",
            image: "/assets/profiles/Nadav.jpg",
            link: "https://www.linkedin.com/in/nadav-reubens-a5957a314"
        },
        {
            name: "Ron Sisso",
            role: "Director",
            image: "/assets/profiles/Ron.jpeg",
            link: "https://www.linkedin.com/in/ronsisso"
        },
        {
            name: "Gal Bitton",
            role: "Creative Director",
            image: "/assets/profiles/Gal.jpeg",
            link: "https://www.linkedin.com/in/gal-bitton-7595b3239"
        },
        {
            name: "Adir David",
            role: "Creative Director",
            image: "/assets/profiles/Adir.jpeg",
            link: "https://i.imgur.com/F1IJpTO.png"
        },
        {
            name: "Eyal Maklada",
            role: "Creative Director",
            image: "/assets/profiles/Eyal.png",
            link: "https://www.linkedin.com/in/eyal-maklada"
        },
    ];

    return (
        <div className="mt-20 min-h-screen bg-indigo-100 dark:bg-slate-900 dark:from-gray-800 dark:via-gray-900 dark:to-black p-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 text-gradient bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                        Meet the Innovators Behind NeuroSync
                    </h1>
                </div>
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 lg:col-span-6 flex">
                        <div className="p-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg flex-grow">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
                                {teamMembers.map((member, index) => (
                                    <TeamMemberCard key={index} {...member} />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-span-12 lg:col-span-6 flex flex-col justify-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-lg flex-grow">
                        <div>
                            <h2 className="text-4xl font-semibold mb-6 text-black dark:text-white">About Us</h2>
                            <p className="text-lg text-gray-700 dark:text-gray-300">
                                We are a team of 5 students passionate about technology and innovation. Our mission is to create cutting-edge solutions that simplify your life. With <strong>{pkg.name}</strong>, our flagship web application, we aim to revolutionize the way you connect and monitor your smart devices.
                            </p>
                            <p className="text-lg text-gray-700 dark:text-gray-300">
                                From Apple Watch to Galaxy Watch and beyond, NeuroSync brings all your wearable devices together on one platform, making it easier than ever to stay in sync with your digital world.
                            </p>
                            <p className="text-lg text-gray-700 dark:text-gray-300">
                                Join us on this journey of innovation and convenience!
                            </p>
                            <p className="text-lg text-gray-700 dark:text-gray-300 mt-4">
                                Our application seamlessly integrates with your smartwatches, smart bands, and other wearable devices,
                                allowing you to track and manage all your smart devices from a single platform.
                            </p>
                        </div>
                        <div className="mt-12">
                            <img
                                src="/assets/dashboard-logo.jpg"
                                alt="Logo"
                                style={{ height: 'auto', width: 'auto' }}
                                className="flex object-cover mt-4 mx-auto"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
