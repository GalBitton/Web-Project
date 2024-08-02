export default class dataAnalytics {
    constructor() {
        this.heartRate = -1;
        this.steps = -1;
        this.calories = -1;
        this.sleep = -1;
        this.sleepQuality = -1;
        this.stressLevel = -1;
        this.oxygenSaturation = -1;
        this.bloodPressure = { systolic: -1, diastolic: -1 };
        this.eeg = { alpha: -1, beta: -1, gamma: -1, delta: -1, theta: -1 };
    }

    calculateAverage(dataArray) {
        if (dataArray.length === 0) return 0;
        const sum = dataArray.reduce((a, b) => a + b, 0);
        return sum / dataArray.length;
    }

    analyzeData(chartsData) {
        this.heartRate = this.calculateAverage(chartsData.heartRate.values);
        this.steps = this.calculateAverage(chartsData.steps.values);
        this.calories = this.calculateAverage(chartsData.calories.values);
        this.sleep = this.calculateAverage(chartsData.sleep.values);
        this.sleepQuality = this.calculateAverage(chartsData.sleep.valuesY1);
        this.stressLevel = this.calculateAverage(chartsData.stress.values);
        this.oxygenSaturation = this.calculateAverage(chartsData.oxygen.values);
        this.bloodPressure = {
            systolic: this.calculateAverage(chartsData.bloodPressure.systolic),
            diastolic: this.calculateAverage(chartsData.bloodPressure.diastolic)
        };
        this.eeg = {
            alpha: this.calculateAverage(chartsData.eeg.alpha),
            beta: this.calculateAverage(chartsData.eeg.beta),
            gamma: this.calculateAverage(chartsData.eeg.gamma),
            delta: this.calculateAverage(chartsData.eeg.delta),
            theta: this.calculateAverage(chartsData.eeg.theta)
        };
    }

    getAnalysisSummary(field) {
        switch (field) {
            case 'heartRate':
                return this.getHeartRateSummary();
            case 'steps':
                return this.getStepsSummary();
            case 'calories':
                return this.getCaloriesSummary();
            case 'sleep':
                return this.getSleepSummary();
            case 'stressLevel':
                return this.getStressLevelSummary();
            case 'oxygenSaturation':
                return this.getOxygenSaturationSummary();
            case 'bloodPressure':
                return this.getBloodPressureSummary();
            case 'eeg':
                // eslint-disable-next-line no-case-declarations
                const thresholds = { alpha: 0.5, beta: 0.5, gamma: 0.5, delta: 0.5, theta: 0.5 };
                return this.getEEGSummary(thresholds);
            default:
                return 'Unknown type';
        }
    }

    getHeartRateSummary() {
        const average = this.heartRate;
        return average===-1 ? 'No Data Yet ...'
            : average < 60
                ? 'Your heart rate is low. Consider checking with a healthcare professional.'
                : average > 100
                    ? 'Your heart rate is high. Managing stress and regular exercise could help.'
                    : 'Your heart rate is normal. Keep maintaining a healthy lifestyle!';
    }

    getStepsSummary() {
        const average = this.steps;
        return average===-1 ? 'No Data Yet ...'
            : average < 5000
                ? 'You are less active than recommended. Try to move more during the day.'
                : average > 10000
                    ? 'Great job staying active! Keep it up.'
                    : 'You have a moderate activity level. Try to reach 10,000 steps daily for better health.';
    }

    getCaloriesSummary() {
        const average = this.calories;
        return average === -1 ? 'No Data Yet ...'
            : average < 200
                ? 'Your activity levels are low. Increasing exercise could boost your health.'
                : average > 500
                    ? 'You are burning a good amount of calories. Keep up the active lifestyle!'
                    : 'Your calorie burn is moderate. Consider adding more activity for health benefits.';
    }

    getSleepSummary() {
        const duration = this.sleep;
        const quality = this.sleepQuality;

        if(duration===-1 && quality===-1)
            return 'No Data Yet ...';

        let durationSummary = duration < 7
            ? 'You are getting less sleep than recommended. Aim for at least 7 hours per night.'
            : 'You are getting enough sleep. Great job!';

        let qualitySummary = quality < 1
            ? 'Your sleep quality is poor. Improving your sleep environment could help.'
            : quality > 2
                ? 'You have good sleep quality. Keep maintaining your sleep routine.'
                : 'Your sleep quality is fair. There may be room for improvement.';


        return `${durationSummary} ${qualitySummary}`;
    }

    getStressLevelSummary() {
        const average = this.stressLevel;
        return average < 2
            ? 'You manage stress well. Keep up the good work!'
            : average > 4
                ? 'Your stress levels are high. Consider stress management techniques.'
                : 'Your stress is at a moderate level. Monitor it to prevent it from rising.';
    }

    getOxygenSaturationSummary() {
        const average = this.oxygenSaturation;
        return average < 95
            ? 'Your oxygen saturation is below normal. Consult a healthcare provider if this persists.'
            : 'Your oxygen saturation is normal. Keep breathing easy!';
    }

    getBloodPressureSummary() {
        const { systolic, diastolic } = this.bloodPressure;
        return systolic > 120 || diastolic > 80
            ? 'Your blood pressure is elevated. Regular monitoring and a healthy lifestyle are advised.'
            : 'Your blood pressure is in the normal range. Keep maintaining a heart-healthy lifestyle!';
    }

    getEEGSummary(thresholds) {
        const { alpha, beta, gamma, delta, theta } = this.eeg;

        const alphaSummary = alpha > thresholds.alpha
            ? 'You are relaxed and calm.'
            : 'You may be experiencing some stress. Consider relaxation techniques.';
        const betaSummary = beta > thresholds.beta
            ? 'You are alert and focused.'
            : 'You might be less focused. Try engaging in activities that enhance concentration.';
        const gammaSummary = gamma > thresholds.gamma
            ? 'Your brain is highly active and engaged.'
            : 'Your cognitive activity is normal.';
        const deltaSummary = delta > thresholds.delta
            ? 'You are getting deep, restorative sleep.'
            : 'You might not be getting enough deep sleep. Consider improving your sleep routine.';
        const thetaSummary = theta > thresholds.theta
            ? 'You are relaxed, possibly in a light sleep or meditative state.'
            : 'Your relaxation levels are normal.';

        return `${alphaSummary} ${betaSummary} ${gammaSummary} ${deltaSummary} ${thetaSummary}`;
    }

}
