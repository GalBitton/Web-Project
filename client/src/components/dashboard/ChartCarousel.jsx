import { Carousel } from 'react-responsive-carousel';
import ResponsiveChartComponent from '@/components/charts/responsive-charts';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

/**
 * Displays a carousel of charts where each chart can be navigated using arrows or swiped.
 * 
 * @component
 * @name ChartCarousel
 * @param {Object} props - The component props.
 * @param {Array<Object>} props.graphs - The array of graph objects to display in the carousel.
 * @param {number} props.currentIndex - The index of the currently selected chart.
 * @param {Function} props.setCurrentIndex - Function to set the index of the currently selected chart.
 * @returns {React.ReactElement} The rendered component.
 */
const ChartCarousel = ({ graphs, currentIndex, setCurrentIndex }) => {
    return (
        <Carousel
            selectedItem={currentIndex}
            showThumbs={false}
            showIndicators={false}
            showStatus={false}
            infiniteLoop={true}
            swipeable={false}
            useKeyboardArrows={true}
            onChange={(index) => setCurrentIndex(index)}
            className="w-full max-w-[100vw]"
            renderArrowPrev={(clickHandler, hasPrev) =>
                hasPrev && (
                    <button
                        type="button"
                        onClick={clickHandler}
                        className="absolute left-0 z-10 transform -translate-y-1/2 top-24 text-black dark:text-white"
                    >
                        <FaArrowLeft size={30} />
                    </button>
                )
            }
            renderArrowNext={(clickHandler, hasNext) =>
                hasNext && (
                    <button
                        type="button"   
                        onClick={clickHandler}
                        className="absolute right-0 z-10 transform -translate-y-1/2 top-24 text-black dark:text-white"
                    >
                        <FaArrowRight size={30} />
                    </button>
                )
            }
        >
            {graphs.map((graph, index) => (
                <div key={index} className="flex mb-32 justify-center">
                    <ResponsiveChartComponent
                        title={graph.title}
                        chartId={graph.chartId}
                        labels={graph.labels}
                        datasets={graph.datasets}
                        summary={graph.summary}
                    />
                </div>
            ))}
        </Carousel>
    );
};

export default ChartCarousel;