// Utility functions
const createMenuItem = (href, text, image = false, classes = [], onClick = null) => {
    const link = document.createElement('a');
    link.href = href;
    link.classList.add('block', 'px-4', 'py-2', 'flex', 'justify-center', 'hidden', 'md:flex', ...classes);

    if (image) {
        const img = document.createElement('img');
        img.src = text;
        img.classList.add('themeIcon', 'h-[2rem]', 'w-[2rem]');
        img.alt = 'Toggle Theme';
        link.appendChild(img);
    } else {
        link.textContent = text;
    }

    if (onClick) {
        link.addEventListener('click', onClick);
    }
    return link;
};

// Authentication functions
const getLoginStatus = () => JSON.parse(localStorage.getItem('loginStatus')) || false;
const setLoginStatus = (status) => localStorage.setItem('loginStatus', JSON.stringify(status));

// Check if the current page is the dashboard
const currentPath = window.location.pathname;
const inDashboard = currentPath === '/dashboard';

// Render functions
const renderFooter = () => {
    const footerHTML = `
        <footer class="bg-white dark:bg-gray-800 text-black dark:text-white p-4 text-center flex justify-center items-center gap-2">
            <p class="text-base">© NeuroSync - 2024 All Rights Reserved </p> - 
            <a href="/terms-of-service" class="hover:text-[#0059ff] ${currentPath === '/terms-of-service' ? 'text-[#0059ff]' : ''}"> Terms of Use </a> - 
            <a href="/privacy-policy" class="hover:text-[#0059ff] ${currentPath === '/privacy-policy' ? 'text-[#0059ff]' : ''}"> Privacy Policy </a>
        </footer>`;
    document.body.insertAdjacentHTML('beforeend', footerHTML);
};

const renderProfileMenu = () => {
    const profileImg = document.getElementById('top-menu-button');
    profileImg.addEventListener('click', () => {
        const menu = document.getElementById('top-menu');
        menu.classList.toggle('hidden');
    });
};

const renderMenu = () => {
    const headerMenu = document.getElementById('header-menu');
    headerMenu.className = 'bg-gray-200 dark:bg-gray-800 text-black dark:text-white p-4 flex items-center' + (inDashboard ? ' md:justify-between' : ' md:justify-center');
    const isLoggedIn = getLoginStatus();

    const menuItems = getMenuItems(isLoggedIn);
    const hamburgerMenu = document.createElement('img');
    hamburgerMenu.classList.add('md:hidden', 'hamburger-menu', 'mx-8', 'flex', 'cursor-pointer');
    if (inDashboard) {
        hamburgerMenu.classList.add('hidden');
    }
    hamburgerMenu.src = '/assets/hamburger-icon.svg';
    headerMenu.appendChild(hamburgerMenu);

    const logoContainer = createLogoContainer(isLoggedIn);
    headerMenu.appendChild(logoContainer);

    menuItems.forEach(item => {
        const menuItem = createMenuItem(item.href, item.name, false, item.classes, item.action);
        headerMenu.appendChild(menuItem);
    });




    if (inDashboard && isLoggedIn) {
        const profileContainer = createProfileContainer();
        headerMenu.appendChild(profileContainer);
    }
};

const createLogoContainer = (isLoggedIn) => {
    const logoContainer = document.createElement('div');
    logoContainer.classList.add('flex', 'items-center');
    if (!inDashboard) {
        logoContainer.classList.add('hidden', 'md:flex');
    }

    const logoLink = document.createElement('a');
    logoLink.href = '/';
    const logoImg = document.createElement('img');
    logoImg.src = '/assets/logo1.jpg';
    logoImg.alt = 'Project Icon';
    logoImg.classList.add('h-10', 'mr-6', 'w-18', 'h-16');
    logoLink.appendChild(logoImg);
    logoContainer.appendChild(logoLink);

    if (isLoggedIn) {
        const dashboardHeading = document.createElement('h1');
        dashboardHeading.classList.add('text-lg', 'hover:text-[#0059ff]');
        if (inDashboard) {
            dashboardHeading.classList.add('text-[#0059ff]');
        }

        const dashboardLink = document.createElement('a');
        dashboardLink.href = '/dashboard';
        dashboardLink.textContent = 'Dashboard';
        dashboardHeading.appendChild(dashboardLink);
        logoContainer.appendChild(dashboardHeading);
    }


    return logoContainer;
};

const createProfileContainer = () => {
    const profileContainer = document.createElement('div');
    profileContainer.classList.add('mx-16');

    const profileImg = document.createElement('img');
    profileImg.src = '/assets/profilePicture.webp';
    profileImg.alt = 'Top Image';
    profileImg.classList.add('h-16', 'cursor-pointer');
    profileImg.id = 'top-menu-button';
    profileContainer.appendChild(profileImg);

    const menu = document.createElement('div');
    menu.id = 'top-menu';
    menu.classList.add('items-center', 'absolute', 'right-0', 'mt-2', 'mx-2', 'w-48', 'bg-gray-200', 'dark:bg-gray-700', 'text-black', 'dark:text-white', 'rounded-lg', 'shadow-lg', 'divide-y', 'hidden');

    menu.appendChild(createMenuItem('#', '', true, ['theme-toggle']));
    menu.appendChild(createMenuItem('#', 'Settings'));
    menu.appendChild(createMenuItem('#', 'Logout', false, [], handleLogout));
    profileContainer.appendChild(menu);

    return profileContainer;
};

const getMenuItems = (isLoggedIn) => {
    if (inDashboard) {
        return [];
    }

    let logItem = { href: '#' };
    let signItem = { href: '#' };
    if (!isLoggedIn) {
        logItem = { name: 'Sign In', href: '#', classes: ['text-lg', 'hover:text-[#0059ff]', 'mx-4', 'cursor-pointer', 'text-black', 'dark:text-white'], action: handleLogin };
        signItem = { name: 'Sign Up', href: '#', classes: ['text-lg', 'hover:text-[#0059ff]', 'mx-4', 'cursor-pointer', 'text-black', 'dark:text-white'] };
    }

    return [
        { name: '', href: '#', classes: ['theme-toggle'] },
        logItem,
        signItem,
        { name: 'About Us', href: '#', classes: ['text-lg', 'hover:text-[#0059ff]', 'mx-4', 'cursor-pointer', 'text-black', 'dark:text-white'] },
        { name: 'Contact', href: '#', classes: ['text-lg', 'hover:text-[#0059ff]', 'mx-4', 'cursor-pointer', 'text-black', 'dark:text-white'] },
    ];
};

const handleLogin = (e) => {
    e.preventDefault();
    setLoginStatus(true);
    window.location.href = '/dashboard';
};

const handleLogout = (e) => {
    e.preventDefault();
    setLoginStatus(false);
    window.location.href = '/';
};

// Theme functions
const renderThemeToggle = () => {
    const headerMenu = document.getElementById('header-menu');
    const themeToggleButton = inDashboard ? document.querySelector('#top-menu .theme-toggle') :
        createMenuItem('#', '', true, ['theme-toggle']);
    if (!inDashboard) {
        headerMenu.appendChild(themeToggleButton);
    }
    const themeIcon = document.querySelector('.themeIcon');
    const darkModeIcon = 'assets/dark-mode.svg';
    const lightModeIcon = 'assets/light-mode.svg';

    const updateThemeIcon = () => {
        themeIcon.src = document.documentElement.classList.contains('dark') ? lightModeIcon : darkModeIcon;
    };

    const applyStoredTheme = () => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            document.documentElement.classList.toggle('dark', storedTheme === 'dark');
        }
        updateThemeIcon();
    };

    themeToggleButton.addEventListener('click', (e) => {
        e.preventDefault();
        document.documentElement.classList.toggle('dark');
        const newTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        updateThemeIcon();
    });

    applyStoredTheme();
};

// Initialization
const init = () => {
    renderMenu();
    renderFooter();
    renderThemeToggle();
    if (inDashboard && getLoginStatus()) {
        renderProfileMenu();
    }
};

document.addEventListener('DOMContentLoaded', init);
