import React, { useEffect } from "react";

function App() {

  return (
    <div class="bg-white dark:bg-slate-900 text-white">
      <header id="header-menu" class="relative z-20"></header>
      <div class="relative flex flex-col justify-between min-h-screen">
          <img src="/assets/backgrounds/landingPage-transparent.png" alt="Landing Page Image" class="absolute left-1/4 inset-0 w-full h-full object-cover opacity-50" />
          <div class="relative z-10 flex flex-col items-start p-8 max-w-xl mt-24 ml-4 md:ml-16 dark:bg-slate-900">
              <h1 class="text-5xl md:text-7xl font-bold mb-4 text-black dark:text-white">Neurosync</h1>
              <p class="text-sm md:text-lg mb-8 text-black dark:text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Neque laoreet suspendisse interdum consectetur libero id faucibus. Morbi tincidunt augue interdum velit euismod in pellentesque massa placerat. Blandit turpis cursus in hac habitasse platea. Accumsan sit amet nulla facilisi morbi tempus. </p>
              <a href="#" class="bg-gray-300 dark:bg-slate-600 text-black dark:text-white px-6 py-3 rounded-full hover:bg-gray-300 transition duration-300">Get started</a>
          </div>
          <div class="relative z-10 flex flex-col md:flex-row justify-around p-4 bg-gradient-to-t from-black via-transparent to-black w-full space-y-4 md:space-y-0">
              <div class="bg-gray-800 bg-opacity-75 rounded-lg p-6 text-center w-full md:w-1/4 min-w-[200px] hover:scale-105 transform transition duration-300">
                  <h2 class="text-2xl md:text-3xl font-bold mb-2">01</h2>
                  <p class="text-sm md:text-base">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Neque laoreet suspendisse interdum consectetur libero id faucibus. Morbi tincidunt augue interdum velit euismod in pellentesque massa placerat. Blandit turpis cursus in hac habitasse platea. Accumsan sit amet nulla facilisi morbi tempus. </p>
              </div>
              <div class="bg-gray-800 bg-opacity-75 rounded-lg p-6 text-center w-full md:w-1/4 min-w-[200px] hover:scale-105 transform transition duration-300">
                  <h2 class="text-2xl md:text-3xl font-bold mb-2">02</h2>
                  <p class="text-sm md:text-base">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Neque laoreet suspendisse interdum consectetur libero id faucibus. Morbi tincidunt augue interdum velit euismod in pellentesque massa placerat. Blandit turpis cursus in hac habitasse platea. Accumsan sit amet nulla facilisi morbi tempus. </p>
              </div>
              <div class="bg-gray-800 bg-opacity-75 rounded-lg p-6 text-center w-full md:w-1/4 min-w-[200px] hover:scale-105 transform transition duration-300">
                  <h2 class="text-2xl md:text-3xl font-bold mb-2">03</h2>
                  <p class="text-sm md:text-base">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Neque laoreet suspendisse interdum consectetur libero id faucibus. Morbi tincidunt augue interdum velit euismod in pellentesque massa placerat. Blandit turpis cursus in hac habitasse platea. Accumsan sit amet nulla facilisi morbi tempus. </p>
              </div>
          </div>
      </div>
      <script type="module" src="/src/scripts/main.js"></script>
    </div>
  );
}

export default App;
