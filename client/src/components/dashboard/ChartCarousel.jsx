import { Carousel } from 'react-responsive-carousel';
import ResponsiveChartComponent from '@/components/charts/responsive-charts';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const ChartCarousel = ({ graphs, currentIndex, setCurrentIndex }) => {
    return (
        <Carousel
            selectedItem={currentIndex}
            showThumbs={false}
            showIndicators={false}
            showStatus={false}
            infiniteLoop={true}
            swipeable={true}
            useKeyboardArrows={true}
            onChange={(index) => setCurrentIndex(index)}
            className="w-full max-w-[100vw]"
            renderArrowPrev={(clickHandler, hasPrev) =>
                hasPrev && (
                    <button
                        type="button"
                        onClick={clickHandler}
                        className="absolute left-0 z-10 p-2 transform -translate-y-1/2 top-1/2 text-black dark:text-white"
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
                        className="absolute right-0 z-10 p-2 transform -translate-y-1/2 top-1/2 text-black dark:text-white"
                    >
                        <FaArrowRight size={30} />
                    </button>
                )
            }
        >
            {graphs.map((graph, index) => (
                <div key={index} className="flex mb-36 justify-center">
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