/**
 * Class representing data analytics for various health metrics.
 */
export default class DataAnalytics {
    /**
     * Message displayed when no data is available.
     * @type {string}
     */
    NO_DATA_MSG = "No Data Yet...";

    /**
     * Creates an instance of DataAnalytics with initial empty data.
     */
    constructor() {
        this.heartRate = {labels: [], values: []};
        this.steps = {labels: [], values: []};
        this.caloriesBurned = {labels: [], values: []};
        this.sleep = {labels: [], values: [], valuesY1: []}
        this.stressLevel = {labels: [], values: []};
        this.oxygenSaturation = {labels: [], values: []};
        this.bloodPressure = {labels: [], systolic: [], diastolic: []};
        this.eeg = {labels: [], alpha: [], beta: [], gamma: [], delta: [], theta: []};
    }

    hasData() {
        // Check based on the common fields.
        return Object.keys(this.heartRate.values).length > 0 ||
            Object.keys(this.steps.values).length > 0 ||
            Object.keys(this.caloriesBurned.values).length > 0;
    }

    /**
     * Gets the analysis data for a specific field.
     * @param {string} field - The field to get data for. Possible values are 'heartRate', 'steps', 'caloriesBurned', 'sleep', 'stressLevel', 'oxygenSaturation', 'bloodPressure', 'eeg'.
     * @returns {Object|string} The data for the specified field or 'Unknown type' if the field is not recognized.
     */
    getAnalysisData(field) {
        switch (field) {
            case 'heartRate':
                return this.heartRate;
            case 'steps':
                return this.steps;
            case 'caloriesBurned':
                return this.caloriesBurned;
            case 'sleep':
                return this.sleep;
            case 'stressLevel':
                return this.stressLevel;
            case 'oxygenSaturation':
                return this.oxygenSaturation;
            case 'bloodPressure':
                return this.bloodPressure;
            case 'eeg':
                return this.eeg;
            default:
                return 'Unknown type';
        }
    }

    /**
     * Analyzes and updates the data with new chart data.
     * @param {Object} chartsData - The data to analyze and update.
     * @param {Object} chartsData.heartRate - The heart rate data.
     * @param {Object} chartsData.steps - The steps data.
     * @param {Object} chartsData.caloriesBurned - The calories burned data.
     * @param {Object} chartsData.sleep - The sleep data.
     * @param {Object} chartsData.stress - The stress level data.
     * @param {Object} chartsData.oxygenSaturation - The oxygen saturation data.
     * @param {Object} chartsData.bloodPressure - The blood pressure data.
     * @param {Object} chartsData.EEG - The EEG data.
     */
    analyzeData(chartsData) {
        this.heartRate = chartsData.heartRate;
        this.steps = chartsData.steps;
        this.caloriesBurned = chartsData.caloriesBurned;
        this.sleep = {
            labels: chartsData.sleep.labels,
            values: chartsData.sleep.values.map(sp => sp.duration),
            valuesY1: chartsData.sleep.values.map(sp => sp.quality)
        }
        this.stressLevel = {
            labels: chartsData.stressLevel.labels,
            values: chartsData.stressLevel.values.map(stress => stress.score)
        };
        this.oxygenSaturation = chartsData.oxygenSaturation;
        this.bloodPressure = {
            labels: chartsData.bloodPressure.labels,
            systolic: chartsData.bloodPressure.systolic,
            diastolic: chartsData.bloodPressure.diastolic
        };
        this.eeg = {
            labels: chartsData.eeg.labels,
            alpha: chartsData.eeg.alpha,
            beta: chartsData.eeg.beta,
            gamma: chartsData.eeg.gamma,
            delta: chartsData.eeg.delta,
            theta: chartsData.eeg.theta
        };
    }

    /**
     * Gets a summary of the analysis data for a specific field within a time frame.
     * @param {string} field - The field to get the summary for. Possible values are 'heartRate', 'steps', 'caloriesBurned', 'sleep', 'stressLevel', 'oxygenSaturation', 'bloodPressure', 'eeg'.
     * @param {string|undefined} [startTime] - The start time of the time frame in ISO 8601 format.
     * @param {string|undefined} [endTime] - The end time of the time frame in ISO 8601 format.
     * @returns {string} The summary for the specified field or 'Unknown type' if the field is not recognized.
     */
    getAnalysisSummary(field, startTime, endTime) {
        switch (field) {
            case 'heartRate':
                return this._getHeartRateSummary(startTime, endTime);
            case 'steps':
                return this._getStepsSummary(startTime, endTime);
            case 'caloriesBurned':
                return this._getCaloriesSummary(startTime, endTime);
            case 'sleep':
                return this._getSleepSummary(startTime, endTime);
            case 'stressLevel':
                return this._getStressLevelSummary(startTime, endTime);
            case 'oxygenSaturation':
                return this._getOxygenSaturationSummary(startTime, endTime);
            case 'bloodPressure':
                return this._getBloodPressureSummary(startTime, endTime);
            case 'eeg':
                // eslint-disable-next-line no-case-declarations
                const thresholds = { alpha: 0.5, beta: 0.5, gamma: 0.5, delta: 0.5, theta: 0.5 };
                return this._getEEGSummary(thresholds, startTime, endTime);
            default:
                return 'Unknown type';
        }
    }

    /**
     * Filters values by a specified time frame.
     * @param {string|undefined} startTime - The start time of the time frame in ISO 8601 format.
     * @param {string|undefined} endTime - The end time of the time frame in ISO 8601 format.
     * @param {Array<string>} labels - The array of labels corresponding to the values.
     * @param {Array<number>} values - The array of values to be filtered.
     * @returns {Array<number>} The filtered values within the specified time frame.
     */
    _filterDataByTimeFrame(startTime, endTime, labels, values) {
        if (startTime === undefined && endTime === undefined) {
            return values;
        } else if (startTime === undefined) {
            return values;
        } else if (endTime === undefined) {
            return values;
        }
        const start = new Date(startTime);
        const end = new Date(endTime);
        return labels.reduce((filteredValues, label, index) => {
            const date = new Date(label.split(' ')[1].split('-').reverse().join('-') + 'T' + label.split(' ')[0]);
            if (date >= start && date <= end) {
                filteredValues.push(values[index]);
            }
            return filteredValues;
        }, []);
    }

    /**
     * Calculates the average of an array of values.
     * @param {Array<number>} values - The array of values to calculate the average of.
     * @returns {number} The average value.
     */
    _calculateAverage(values) {
        return values.reduce((sum, value) => sum + value, 0) / values.length;
    }

    /**
     * Gets a summary of heart rate data within a time frame.
     * @param {string|undefined} startTime - The start time of the time frame in ISO 8601 format.
     * @param {string|undefined} endTime - The end time of the time frame in ISO 8601 format.
     * @returns {string} The heart rate summary.
     */
    _getHeartRateSummary(startTime, endTime) {
        const { labels, values } = this.heartRate;

        const filteredValues = this._filterDataByTimeFrame(startTime, endTime, labels, values);
        if (filteredValues.length === 0) {
            return this.NO_DATA_MSG;
        }

        const average = this._calculateAverage(filteredValues);

        return average < 60
                ? 'Your heart rate is low. Consider checking with a healthcare professional.'
                : average > 100
                    ? 'Your heart rate is high. Managing stress and regular exercise could help.'
                    : 'Your heart rate is normal. Keep maintaining a healthy lifestyle!';
    }

    /**
     * Gets a summary of steps data within a time frame.
     * @param {string|undefined} startTime - The start time of the time frame in ISO 8601 format.
     * @param {string|undefined} endTime - The end time of the time frame in ISO 8601 format.
     * @returns {string} The steps summary.
     */
    _getStepsSummary(startTime, endTime) {
        const { labels, values } = this.steps;

        const filteredValues = this._filterDataByTimeFrame(startTime, endTime, labels, values);
        if (filteredValues.length === 0) {
            return this.NO_DATA_MSG;
        }

        const average = this._calculateAverage(filteredValues);

        return average < 5000
                ? 'You are less active than recommended. Try to move more during the day.'
                : average > 10000
                    ? 'Great job staying active! Keep it up.'
                    : 'You have a moderate activity level. Try to reach 10,000 steps daily for better health.';
    }

    /**
     * Gets a summary of calories burned data within a time frame.
     * @param {string|undefined} startTime - The start time of the time frame in ISO 8601 format.
     * @param {string|undefined} endTime - The end time of the time frame in ISO 8601 format.
     * @returns {string} The calories burned summary.
     */
    _getCaloriesSummary(startTime, endTime) {
        const { labels, values } = this.caloriesBurned;

        const filteredValues = this._filterDataByTimeFrame(startTime, endTime, labels, values);
        if (filteredValues.length === 0) {
            return this.NO_DATA_MSG;
        }

        const average = this._calculateAverage(filteredValues);

        return average < 200
                ? 'Your activity levels are low. Increasing exercise could boost your health.'
                : average > 500
                    ? 'You are burning a good amount of calories. Keep up the active lifestyle!'
                    : 'Your calorie burn is moderate. Consider adding more activity for health benefits.';
    }

    /**
     * Gets a summary of sleep data within a time frame.
     * @returns {string} The sleep summary.
     */
    _getSleepSummary() {
        if (this.sleep.values.length === 0 && this.sleep.valuesY1.length === 0)
            return this.NO_DATA_MSG;

        let durationSummary = this.sleep.values < 7
            ? 'You are getting less sleep than recommended. Aim for at least 7 hours per night.'
            : 'You are getting enough sleep. Great job!';

        let qualitySummary = this.sleep.valuesY1 < 1
            ? 'Your sleep quality is poor. Improving your sleep environment could help.'
            : this.sleep.valuesY1 > 2
                ? 'You have good sleep quality. Keep maintaining your sleep routine.'
                : 'Your sleep quality is fair. There may be room for improvement.';


        return `${durationSummary} ${qualitySummary}`;
    }

    /**
     * Gets a summary of stress level data within a time frame.
     * @param {string|undefined} startTime - The start time of the time frame in ISO 8601 format.
     * @param {string|undefined} endTime - The end time of the time frame in ISO 8601 format.
     * @returns {string} The stress level summary.
     */
    _getStressLevelSummary(startTime, endTime) {
        const { labels, values } = this.stressLevel;

        const filteredValues = this._filterDataByTimeFrame(startTime, endTime, labels, values);
        if (filteredValues.length === 0) {
            return this.NO_DATA_MSG;
        }

        const average = this._calculateAverage(filteredValues);

        return average < 2
            ? 'You manage stress well. Keep up the good work!'
            : average > 4
                ? 'Your stress levels are high. Consider stress management techniques.'
                : 'Your stress is at a moderate level. Monitor it to prevent it from rising.';
    }

    /**
     * Gets a summary of oxygen saturation data within a time frame.
     * @param {string|undefined} startTime - The start time of the time frame in ISO 8601 format.
     * @param {string|undefined} endTime - The end time of the time frame in ISO 8601 format.
     * @returns {string} The oxygen saturation summary.
     */
    _getOxygenSaturationSummary(startTime, endTime) {
        const { labels, values } = this.oxygenSaturation;

        const filteredValues = this._filterDataByTimeFrame(startTime, endTime, labels, values);
        if (filteredValues.length === 0) {
            return this.NO_DATA_MSG;
        }

        const average = this._calculateAverage(filteredValues);

        return average < 95
            ? 'Your oxygen saturation is below normal. Consult a healthcare provider if this persists.'
            : 'Your oxygen saturation is normal. Keep breathing easy!';
    }

    /**
     * Gets a summary of blood pressure data within a time frame.
     * @param {string|undefined} startTime - The start time of the time frame in ISO 8601 format.
     * @param {string|undefined} endTime - The end time of the time frame in ISO 8601 format.
     * @returns {string} The blood pressure summary.
     */
    _getBloodPressureSummary(startTime, endTime) {
        const { labels, systolic, diastolic } = this.bloodPressure;

        const filteredSystolic = this._filterDataByTimeFrame(startTime, endTime, labels, systolic);
        const filteredDiastolic = this._filterDataByTimeFrame(startTime, endTime, labels, diastolic);

        if (filteredSystolic.length === 0 || filteredDiastolic.length === 0)
            return this.NO_DATA_MSG;

        const averageSystolic = this._calculateAverage(filteredSystolic);
        const averageDiastolic = this._calculateAverage(filteredDiastolic);

        return averageSystolic > 120 || averageDiastolic > 80
            ? 'Your blood pressure is elevated. Regular monitoring and a healthy lifestyle are advised.'
            : 'Your blood pressure is in the normal range. Keep maintaining a heart-healthy lifestyle!';
    }

    /**
     * Gets a summary of EEG data within a time frame based on thresholds.
     * @param {Object} thresholds - The threshold values for different EEG waves.
     * @param {number} thresholds.alpha - The threshold for alpha waves.
     * @param {number} thresholds.beta - The threshold for beta waves.
     * @param {number} thresholds.gamma - The threshold for gamma waves.
     * @param {number} thresholds.delta - The threshold for delta waves.
     * @param {number} thresholds.theta - The threshold for theta waves.
     * @param {string|undefined} startTime - The start time of the time frame in ISO 8601 format.
     * @param {string|undefined} endTime - The end time of the time frame in ISO 8601 format.
     * @returns {string} The EEG summary.
     */
    _getEEGSummary(thresholds, startTime, endTime) {
        const { labels, alpha, beta, gamma, delta, theta } = this.eeg;

        const filteredAlpha = this._filterDataByTimeFrame(startTime, endTime, labels, alpha);
        const filteredBeta = this._filterDataByTimeFrame(startTime, endTime, labels, beta);
        const filteredGamma = this._filterDataByTimeFrame(startTime, endTime, labels, gamma);
        const filteredDelta = this._filterDataByTimeFrame(startTime, endTime, labels, delta);
        const filteredTheta = this._filterDataByTimeFrame(startTime, endTime, labels, theta);

        if (filteredAlpha.length === 0 || filteredBeta.length === 0 || filteredGamma.length === 0 || filteredDelta.length === 0 || filteredTheta.length === 0) {
            return this.NO_DATA_MSG;
        }

        const averageAlpha = this._calculateAverage(filteredAlpha);
        const averageBeta = this._calculateAverage(filteredBeta);
        const averageGamma = this._calculateAverage(filteredGamma);
        const averageDelta = this._calculateAverage(filteredDelta);
        const averageTheta = this._calculateAverage(filteredTheta);

        const alphaSummary = averageAlpha > thresholds.alpha
            ? 'You are relaxed and calm.'
            : 'You may be experiencing some stress. Consider relaxation techniques.';
        const betaSummary = averageBeta > thresholds.beta
            ? 'You are alert and focused.'
            : 'You might be less focused. Try engaging in activities that enhance concentration.';
        const gammaSummary = averageGamma > thresholds.gamma
            ? 'Your brain is highly active and engaged.'
            : 'Your cognitive activity is normal.';
        const deltaSummary = averageDelta > thresholds.delta
            ? 'You are getting deep, restorative sleep.'
            : 'You might not be getting enough deep sleep. Consider improving your sleep routine.';
        const thetaSummary = averageTheta > thresholds.theta
            ? 'You are relaxed, possibly in a light sleep or meditative state.'
            : 'Your relaxation levels are normal.';

        return `${alphaSummary} ${betaSummary} ${gammaSummary} ${deltaSummary} ${thetaSummary}`;
    }
}
