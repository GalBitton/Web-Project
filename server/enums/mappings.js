const fieldMappings = {
    appleSmartwatch: {
        heartRate: "heartRate",
        steps: "steps",
        caloriesBurned: "caloriesBurned",
        sleep: {
            duration: "sleep.duration",
            quality: "sleep.quality"
        },
        activity: {
            move: "activityRings.move",
            exercise: "activityRings.exercise",
            stand: "activityRings.stand"
        },
        bloodPressure: {
            systolic: "bloodPressure.systolic",
            diastolic: "bloodPressure.diastolic"
        }
    },
    fitbitBracelet: {
        heartRate: "heartRate",
        steps: "steps",
        caloriesBurned: "caloriesBurned",
        sleep: {
            duration: "sleep.duration",
            quality: "sleep.quality"
        },
        stress: {
            score: "stressManagement.score",
            breathingRate: "stressManagement.breathingRate"
        }
    },
    samsungBracelet: {
        heartRate: "heartRate",
        steps: "steps",
        caloriesBurned: "caloriesBurned",
        sleep: {
            duration: "sleep.durationHours",
            quality: "sleep.qualityRating"
        },
        stress: {
            score: "stressLevel",
            breathingRate: "breathingRate"
        }
    },
    dreemHeadband: {
        eeg: {
            alpha: "EEG.alpha",
            beta: "EEG.beta",
            gamma: "EEG.gamma",
            delta: "EEG.delta",
            theta: "EEG.theta"
        },
        sleep: {
            duration: "sleepData.totalDuration",
            quality: "sleepData.sleepQuality"
        },
        focusScore: "meditationScore"
    },
    museHeadband: {
        eeg: {
            alpha: "EEG.alphaWaves",
            beta: "EEG.betaWaves",
            gamma: "EEG.gammaWaves",
            delta: "EEG.deltaWaves",
            theta: "EEG.thetaWaves"
        },
        sleep: {
            duration: "sleep.duration",
            quality: "sleep.quality"
        },
        focusScore: "focusScore"
    },
    xiaomiBracelet: {
        heartRate: "heartRate",
        steps: "steps",
        caloriesBurned: "caloriesBurned",
        sleep: {
            duration: "sleep.totalDuration",
            quality: "sleep.qualityIndex"
        },
        stress: {
            score: "relaxationScore",
            breathingRate: "respiratoryRate"
        }
    },
    xiaomiSmartwatch: {
        heartRate: "heartRate",
        steps: "steps",
        caloriesBurned: "caloriesBurned",
        sleep: {
            duration: "sleep.duration",
            quality: "sleep.quality"
        },
        stress: {
            score: "stressLevel",
            breathingRate: "respiratoryRate"
        },
        vo2Max: "VO2Max"
    },
    samsungSmartwatch: {
        heartRate: "heartRate",
        steps: "steps",
        caloriesBurned: "caloriesBurned",
        sleep: {
            duration: "sleep.duration",
            quality: "sleep.quality"
        },
        stress: {
            score: "stressLevel"
        },
        oxygenSaturation: "oxygenSaturation"
    }
};


export {
    fieldMappings
}

