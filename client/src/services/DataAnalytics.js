export default class DataAnalytics {
    NO_DATA_MSG = "No Data Yet...";

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
            labels: chartsData.stress.labels,
            values: chartsData.stress.values.map(stress => stress.score)
        };
        this.oxygenSaturation = chartsData.oxygenSaturation;
        this.bloodPressure = {
            labels: chartsData.bloodPressure.labels,
            systolic: chartsData.bloodPressure.values.map(value => value.systolic),
            diastolic: chartsData.bloodPressure.values.map(value => value.diastolic)
        };
        this.eeg = {
            labels: chartsData.EEG.labels,
            alpha: chartsData.EEG.values.map(data => data.alpha),
            beta: chartsData.EEG.values.map(data => data.beta),
            gamma: chartsData.EEG.values.map(data => data.gamma),
            delta: chartsData.EEG.values.map(data => data.delta),
            theta: chartsData.EEG.values.map(data => data.theta)
        };
    }

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

    _calculateAverage(values) {
        return values.reduce((sum, value) => sum + value, 0) / values.length;
    }

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

    _getSleepSummary(startTime, endTime) {
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
