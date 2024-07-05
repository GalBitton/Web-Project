import Chart from 'chart.js/auto';

document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('healthDataChart').getContext('2d');
    const healthDataChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Device 1', 'Device 2', 'Device 3', 'Device 4'],
            datasets: [{
                label: 'Average Heartrate BPM',
                data: [70, 75, 80, 65],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Carousel functionality
    const carousel = document.querySelector('.carousel');
    const prev = document.querySelector('.prev');
    const next = document.querySelector('.next');

    let currentIndex = 0;
    const images = ['/assets/device_image1.svg', '/assets/device_image2.svg'];

    function updateCarousel() {
        carousel.innerHTML = `<img src="${images[currentIndex]}" alt="Device Image" class="h-40">`;
    }

    prev.addEventListener('click', () => {
        currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
        updateCarousel();
    });

    next.addEventListener('click', () => {
        currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
        updateCarousel();
    });

    updateCarousel();
});
