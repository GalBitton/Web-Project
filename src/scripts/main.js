document.addEventListener('DOMContentLoaded', function() {
// Header Section
// Define menu items
const menuItems = [
    { name: 'Best Products', href: '#' },
    { name: 'Reviews', href: '#' },
    { name: 'Analysis', href: '#' },
    { name: 'About Us', href: '#' },
    { name: 'Contact', href: '#' }
];

// Create header menu
const headerMenu = document.getElementById('header-menu');
const menuList = document.createElement('ul');
menuList.className = 'flex space-x-4';

menuItems.forEach(item => {
    const menuItem = document.createElement('li');
    const menuLink = document.createElement('a');
    menuLink.href = item.href;
    menuLink.textContent = item.name;
    menuLink.className = 'hover:underline';
    menuItem.appendChild(menuLink);
    menuList.appendChild(menuItem);
});

const authButtons = document.createElement('div');
authButtons.className = 'flex space-x-4';

const signupButton = document.createElement('button');
signupButton.textContent = 'Signup';
signupButton.className = 'hover:underline';

const loginButton = document.createElement('button');
loginButton.textContent = 'Login';
loginButton.className = 'hover:underline';

const themeToggle = document.createElement('button');
themeToggle.textContent = 'Dark Mode';
themeToggle.className = 'hover:underline';

themeToggle.addEventListener('click', () => {
    if (themeToggle.textContent=='Dark Mode') {
        document.body.classList.replace('bg-white', 'bg-gray-800');
        document.body.classList.replace('text-black', 'text-white');
        themeToggle.textContent = 'Light Mode';
    } else {
        document.body.classList.replace('bg-gray-800', 'bg-white');
        document.body.classList.replace('text-white', 'text-black');
        themeToggle.textContent = 'Dark Mode';
    }
});

authButtons.appendChild(signupButton);
authButtons.appendChild(loginButton);
authButtons.appendChild(themeToggle);

headerMenu.appendChild(menuList);
headerMenu.appendChild(authButtons);

// Carousel Section

    const images = [
        '../public/assets/image1.png', // replace with your image paths
        '../public/assets/image2.png'
    ];
    const carousel = document.querySelector('.carousel');
    let currentIndex = 0;

    function showCurrentImage() {
        console.log("Loading image:", images[currentIndex]); // Debugging line
        carousel.innerHTML = ''; // Clear the carousel content
        let img = document.createElement('img');
        img.src = images[currentIndex];
        img.onload = () => console.log("Image loaded successfully");
        img.onerror = () => console.error("Failed to load image:", img.src);
        img.classList.add("w-full", "active"); // Full width and active image
        carousel.appendChild(img);
    }

    document.querySelector('.prev').addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
        showCurrentImage();
    });

    document.querySelector('.next').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        showCurrentImage();
    });

    showCurrentImage(); // Initially show the first image

    // Demo data for devices
    const demoData = [
        { device: 'Smart Watch', heartRate: 75, steps: 10000, calories: 500 },
        { device: 'Smart Glasses', heartRate: 65, steps: 8000, calories: 400 },
        { device: 'Headband', heartRate: 70, steps: 6000, calories: 350 },
        { device: 'Smart Bracelet', heartRate: 80, steps: 12000, calories: 600 }
    ];

    // Setup Chart.js
    const ctx = document.getElementById('healthDataChart').getContext('2d');
    const healthDataChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: demoData.map(d => d.device),
            datasets: [
                {
                    label: 'Heart Rate (bpm)',
                    data: demoData.map(d => d.heartRate),
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Steps',
                    data: demoData.map(d => d.steps),
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Calories Burned',
                    data: demoData.map(d => d.calories),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

});
