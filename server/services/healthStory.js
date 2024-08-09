export default class HealthStory {
    constructor(healthStats) {
        this.heartRate = healthStats.heartRate || null;
        this.steps = healthStats.steps || null;
        this.caloriesBurned = healthStats.caloriesBurned || null;
        this.sleepDuration = healthStats.sleep?.duration || null;
        this.sleepQuality = healthStats.sleep?.quality || null;
        this.stressScore = healthStats.stressScore || null;
        this.breathingRate = healthStats.breathingRate || null;
        this.bloodPressure = healthStats.bloodPressure || null;
        this.activityLevel = healthStats.activityLevel || null;
        this.focusScore = healthStats.focusScore || null;
        this.eeg = healthStats.eeg || null;
    }

    createStory() {
        let story = "Your recent health data provides insights into your overall well-being.\n";

        // Heart Rate
        if (this.heartRate !== null) {
            if (this.heartRate < 60) {
                story += "Your heart rate is on the lower side, indicating relaxation or possible bradycardia. ";
            } else if (this.heartRate > 100) {
                story += "Your elevated heart rate suggests stress, anxiety, or physical exertion. ";
            } else {
                story += "Your heart rate is within the normal range, reflecting a balanced state of health. ";
            }
        }

        // Steps
        if (this.steps !== null) {
            if (this.steps < 5000) {
                story += "Your step count suggests a sedentary lifestyle, which may impact your physical and mental health. ";
            } else if (this.steps >= 10000) {
                story += "Your step count suggests you're maintaining an active lifestyle, which is excellent for both physical and mental health. ";
            } else {
                story += "Your step count suggests you're moderately active, which is beneficial for your overall well-being. ";
            }
        }

        // Sleep
        if (this.sleepDuration !== null && this.sleepQuality !== null) {
            story += `You got ${this.sleepDuration} hours of sleep, which is considered ${this.sleepQuality}. `;
            if (this.sleepQuality === "Very Poor" || this.sleepQuality === "Poor") {
                story += "Poor sleep quality may lead to stress and reduced cognitive function. ";
            } else if (this.sleepQuality === "Excellent") {
                story += "Excellent sleep quality is a strong foundation for good mental health and daily performance. ";
            }
        }

        // Stress
        if (this.stressScore !== null) {
            if (this.stressScore > 7) {
                story += "Your high stress score indicates significant pressure. Consider relaxation techniques. ";
            } else if (this.stressScore > 4) {
                story += "You have a moderate level of stress, which is normal, but managing it is important for long-term health. ";
            } else {
                story += "Your stress levels are low, suggesting you're in a good mental state. ";
            }
        }

        // Breathing Rate
        if (this.breathingRate !== null) {
            if (this.breathingRate < 12) {
                story += "Your breathing rate is lower than usual, which might indicate relaxation or deep meditation. ";
            } else if (this.breathingRate > 20) {
                story += "A higher breathing rate suggests anxiety or physical exertion. ";
            } else {
                story += "Your breathing rate is within the normal range, reflecting a calm and balanced state. ";
            }
        }

        // Blood Pressure
        if (this.bloodPressure && this.bloodPressure.systolic !== null && this.bloodPressure.diastolic !== null) {
            if (this.bloodPressure.systolic > 130 || this.bloodPressure.diastolic > 80) {
                story += "Your blood pressure is elevated, which could be a sign of stress or cardiovascular strain. ";
            } else {
                story += "Your blood pressure is within a healthy range, supporting your overall well-being. ";
            }
        }

        // Activity Level
        if (this.activityLevel !== null) {
            if (this.activityLevel > 75) {
                story += "Your high activity level shows great physical fitness and resilience. ";
            } else if (this.activityLevel < 30) {
                story += "A low activity level might suggest fatigue or a sedentary lifestyle. ";
            } else {
                story += "Your activity level indicates a healthy balance of movement and rest. ";
            }
        }

        // Focus Score
        if (this.focusScore !== null) {
            if (this.focusScore > 70) {
                story += "Your focus is sharp, which is excellent for productivity and mental clarity. ";
            } else if (this.focusScore < 30) {
                story += "Your focus seems low, which might indicate mental fatigue or distraction. ";
            }
        }

        // EEG Analysis
        const eegStory = this.analyzeEEG();
        if (eegStory) {
            story += eegStory;
        }

        return story.trim();
    }

    analyzeEEG() {
        let eegStory = "";
        if (this.eeg !== null) {
            if (this.eeg.alpha > 0.6) {
                eegStory += "Your brain is showing strong alpha waves, which suggest a relaxed state, possibly meditative. ";
            } else {
                eegStory += "Your alpha wave activity is low, which might indicate a lack of relaxation or focus. ";
            }

            if (this.eeg.beta > 0.7) {
                eegStory += "Elevated beta waves indicate active thinking or stress, possibly related to anxiety or concentration. ";
            } else {
                eegStory += "Your beta wave activity is low, suggesting a calm mental state with less cognitive activity or stress. ";
            }

            if (this.eeg.gamma !== null) {
                if (this.eeg.gamma > 0.8) {
                    eegStory += "High gamma wave activity suggests heightened focus and cognitive function, possibly during intense concentration. ";
                } else {
                    eegStory += "Your gamma wave activity is low, which might indicate a lower level of focus and cognitive function. ";
                }
            }

            if (this.eeg.delta !== null) {
                if (this.eeg.delta > 0.4) {
                    eegStory += "Delta wave activity suggests you are in deep sleep or a state of restorative rest. ";
                } else {
                    eegStory += "Your delta wave activity is low, indicating that you might not be experiencing deep restorative sleep. ";
                }
            }

            if (this.eeg.theta !== null) {
                if (this.eeg.theta > 0.5) {
                    eegStory += "Strong theta waves might indicate a state of drowsiness or deep meditation. ";
                } else {
                    eegStory += "Your theta wave activity is low, suggesting you are likely alert and not in a meditative state. ";
                }
            }
        }

        return eegStory ? `\nEEG Analysis: ${eegStory.trim()}` : null;
    }
}
