import serviceData from "../../../package.json";
import React,{useEffect} from "react";

const teamMembers = [
    {
        name: "Marcus Brennand",
        role: "Managing Director",
        image: "/assets/profiles/Gal.jpeg", // Replace with actual paths
        link: "https://www.linkedin.com/in/nadav-reubens-a5957a314" // Link to the profile or relevant page
    },
    {
        name: "Tony Brennand",
        role: "Director",
        image: "/assets/profiles/Ron.jpeg",
        link: "https://www.linkedin.com/in/nadav-reubens-a5957a314"
    },
    {
        name: "Jeremy Jones",
        role: "Creative Director",
        image: "/assets/profiles/Adir.jpeg",
        link: "https://www.linkedin.com/in/nadav-reubens-a5957a314"
    },
    {
        name: "Jeremy Jones",
        role: "Creative Director",
        image: "/assets/profiles/Adir.jpeg",
        link: "https://www.linkedin.com/in/nadav-reubens-a5957a314"
    },
    {
        name: "Jeremy Jones",
        role: "Creative Director",
        image: "/assets/profiles/Adir.jpeg",
        link: "https://www.linkedin.com/in/nadav-reubens-a5957a314"
    },
    // Add more team members as needed
];



const AboutUs = () => {
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollFraction = scrollPosition / documentHeight;

            // Adjust these colors to match your gradient
            const startColor = [75, 85, 190];  // RGB for indigo-500
            const endColor = [219, 39, 119];   // RGB for pink-500

            const newColor = startColor.map((start, index) => {
                const end = endColor[index];
                return Math.round(start + (end - start) * scrollFraction);
            });

            document.body.style.backgroundColor = `rgb(${newColor.join(",")})`;
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className="mt-20 min-h-screen bg-indigo-100 dark:bg-slate-800 dark:from-gray-800 dark:via-gray-900 dark:to-black p-8">
        <div className="max-w-7xl mx-auto">
            <div className="text-center">
                <h1 className="text-5xl md:text-7xl font-bold mb-12 text-black dark:text-white">
                    Meet Our Team
                </h1>
            </div>

            
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6 ">
                    <div className=" p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
                            {teamMembers.map((member, index) => (
                                <a
                                    key={index}
                                    href={member.link}
                                    className="relative block rounded-lg shadow-lg overflow-hidden group pt-[100%]"
                                >
                                    <div></div>
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 flex flex-col justify-end p-4 group-hover:bg-opacity-50 transition-opacity duration-300">
                                        <h3 className="text-xl font-semibold text-white"
                                            style={{
                                                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8), -2px -2px 4px rgba(0, 0, 0, 0.8)" // Adding outline effect
                                            }}>
                                            {member.name}
                                        </h3>
                                        <p className="text-sm text-white"
                                            style={{
                                                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8), -2px -2px 4px rgba(0, 0, 0, 0.8)" // Adding outline effect
                                            }}>
                                            {member.role}
                                        </p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    

    );
};

export default AboutUs;
