import { cardio } from 'ldrs';
// Register the cardio component
cardio.register();

/**
 * Displays a loading animation centered on the screen.
 * 
 * @returns {JSX.Element} The rendered loading animation component.
 */
const LoadingAnimation = () => (
    <div
        id="loading-animation"
        style={{

            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999, // Ensure it overlays on top
            pointerEvents: 'none', // Prevents interaction, click-through
            display: 'flex', // Flexbox to center the content
            justifyContent: 'center',
            alignItems: 'center',
            width: '450px', // Adjust the width and height as needed
            height: '450px',
            borderRadius: '50%', // Make the background circular
            background: 'linear-gradient(to right, #6b46c1, #5a67d8, #2b6cb0)',
            opacity:'0.4',

        }}
        >

        <l-cardio
            size="400"
            stroke="20"
            speed="2"
            color="#fef2f2"
        ></l-cardio>

    </div>
);

export default LoadingAnimation;
