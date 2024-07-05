const body = document.body;

const renderFooter = () => {
    const footerHTML = 
    `<footer class="bg-white dark:bg-gray-800 text-black dark:text-white p-4 text-center flex justify-center items-center gap-2">
        <p class="text-base">© FitTrackerPro - 2024 All Rights Reserved </p> -
        <a href="/terms-of-service" class="hover:text-[#0059ff]"> Terms of Use </a> - 
        <a href="/privacy-policy" class="hover:text-[#0059ff]"> Privacy Policy </a>
    </footer>`;
    body.innerHTML += footerHTML;
}

const renderProfile = () => {

}

const renderMenu = () => {

}

renderFooter();
renderProfile();
renderMenu();
