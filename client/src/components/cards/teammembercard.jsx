import { FaLinkedin } from 'react-icons/fa';

const TeamMemberCard = ({ name, role, image, link }) => (
    <div className="relative block rounded-lg shadow-lg overflow-hidden group pt-[100%]">
        <div></div>
        <img
            src={image}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 flex flex-col justify-end p-4 group-hover:bg-opacity-50 transition-opacity duration-300 backdrop-filter-none">
            <h3 className="text-xl font-semibold text-white">{name}</h3>
            <p className="text-sm text-wxhite">{role}</p>
        </div>
        <a href={link}>
            <button className="absolute right-0 bottom-0 mb-2 mr-2 bg-blue-600 text-white p-3 rounded-full">
                <FaLinkedin className="w-5 h-5" />
            </button>
        </a>
    </div>
);

export default TeamMemberCard;
