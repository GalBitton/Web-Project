document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const currentPath = window.location.pathname;

    const renderFooter = () => {
        const footerHTML = `
            <footer class="bg-white dark:bg-gray-800 text-black dark:text-white p-4 text-center flex justify-center items-center gap-2">
                <p class="text-base">© FitTrackerPro - 2024 All Rights Reserved </p> - 
                <a href="/terms-of-service" class="hover:text-[#0059ff] ${currentPath === '/terms-of-service' ? 'text-[#0059ff]' : ''}"> Terms of Use </a> - 
                <a href="/privacy-policy" class="hover:text-[#0059ff] ${currentPath === '/privacy-policy' ? 'text-[#0059ff]' : ''}"> Privacy Policy </a>
            </footer>`;
        body.insertAdjacentHTML('beforeend', footerHTML);
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
        headerMenu.className = 'bg-gray-200 dark:bg-gray-800 text-black dark:text-white p-4 flex justify-between items-center';

        const logoContainer = document.createElement('div');
        logoContainer.classList.add('flex', 'items-center');

        const logoLink = document.createElement('a');
        logoLink.href = '/';
        const logoImg = document.createElement('img');
        logoImg.src = '/assets/logo1.jpg';
        logoImg.alt = 'Project Icon';
        logoImg.classList.add('h-10', 'mr-6', 'w-18', 'h-16');
        logoLink.appendChild(logoImg);
        logoContainer.appendChild(logoLink);

        const dashboardHeading = document.createElement('h1');
        dashboardHeading.classList.add('text-lg', 'hover:text-[#0059ff]');
        if (currentPath === '/dashboard') {
            dashboardHeading.classList.add('text-[#0059ff]');
        }
        const dashboardLink = document.createElement('a');
        dashboardLink.href = '/dashboard';
        dashboardLink.textContent = 'Dashboard';
        dashboardHeading.appendChild(dashboardLink);
        logoContainer.appendChild(dashboardHeading);

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

        const createMenuItem = (href, text, image = false, classes = []) => {
            const link = document.createElement('a');
            link.href = href;
            link.classList.add('block', 'px-4', 'py-2', 'flex', 'justify-center', ...classes);
            
            if (image) {
                const img = document.createElement('img');
                img.src = text;
                img.classList.add('themeIcon', 'h-[2rem]', 'w-[2rem]');
                img.alt = 'Toggle Theme';
                link.appendChild(img);
            } else {
                link.textContent = text
            }
            return link;
        };

        menu.appendChild(createMenuItem('#', '', true, ['theme-toggle']));
        menu.appendChild(createMenuItem('#', 'Settings'));
        menu.appendChild(createMenuItem('#', 'Logout'));

        profileContainer.appendChild(menu);
        headerMenu.appendChild(logoContainer);
        headerMenu.appendChild(profileContainer);
    };

    const renderThemeToggle = () => {
        const themeToggleButton = document.querySelector('#top-menu .theme-toggle');
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

    const init = () => {
        renderFooter();
        renderMenu();
        renderProfileMenu();
        renderThemeToggle();
    };

    init();
});
