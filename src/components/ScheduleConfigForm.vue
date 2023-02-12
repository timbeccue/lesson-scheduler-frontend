
This component should provide the inputs for users to specify the various schedule configurations:

- name of the project
- the available days
- size (minutes) of each period block
- when does a day start (minutesBeforeStart) 
- when does a day end (periods per day)
- duration of lessons

There will need to be some validation to ensure the inputs are consistent and easy to use.

For example, period sizes could be selected from options of 15,30,60 minutes

Rather than asking for the periods per day, ask for start/end times and ensure that the selections available
fit with the size of the period. Day durations should be integer multiples of the period duration.


<script>
import utils from '../utils.js'
export default {
    props: {
    },
    data() {
        return {
            projectName: 'my lesson schedule',
            periodSizeMinutes: 30,
            periodSizeOptions: [15,30,60],
            startTime: 480,  // minutes after midnight
            endTime: 1200,   // minutes after midnight
            lessonDurationMinutes: 60,
        }
    },
    computed: {
        periodsPerDay() {
            return parseInt((this.endTime - this.startTime) / this.periodSizeMinutes)
        },
        lessonDurationPeriods() {
            return this.lessonDurationMinutes / this.periodSizeMinutes
        },
        startTimeOptions() {
            const interval = this.periodSizeMinutes // minutes
            const minutesPerDay = 1440
            let options = []
            for (let i=0; i<minutesPerDay; i+=interval) {
                options.push(i)
            }
            return options
        },
        endTimeOptions() {
            return this.startTimeOptions.filter(x => x > this.startTime)
        },
        lessonDurationOptions() {
            let options = [15,30,45,60,90,120,150,180]
            options = options.filter(x => {
                const notLessThanPeriodSize  = (x >= this.periodSizeMinutes)
                const isMultipleOfPeriodSize = (x % this.periodSizeMinutes == 0)
                return notLessThanPeriodSize && isMultipleOfPeriodSize
            })
            return options
        },
        allSettings() {
            return {
                projectName: this.projectName,
                periodSizeMinutes: this.periodSizeMinutes,
                startTime: this.startTime,
                endTime: this.endTime,
                periodsPerDay: this.periodsPerDay,
                lessonDurationPeriods: this.lessonDurationPeriods
            }
        }
    },
    watch: {
        periodSizeMinutes(newVal, oldVal) {
            if (this.periodSizeMinutes > this.lessonDurationMinutes) {
                this.lessonDurationMinutes = this.periodSizeMinutes
            }
            if (this.startTime % newVal != 0) {
                this.startTime += (newVal - oldVal)
            }
            if (this.endTime % newVal != 0) {
                this.endTime += (newVal - oldVal)
            }
        }
    },
    methods: {
        minutesToPeriods(minutes) {
            return Math.floor(minutes / this.periodSizeMinutes)
        },
        minutesToHHMM: utils.minutesToHHMM,
        applySettings() {
            this.$emit('update', this.allSettings)
        }
    }
}
</script>

<template>
    <div class="form-container">
        <!-- <div class="mb-3">
            <label for="projectName" class="form-label">Project Name</label>
            <input type="text" class="form-control" id="projectName" v-model="projectName" placeholder="project name">
        </div> -->
        <div class="row mb-3">
            <label for="periodSizeMinutes" class="col-sm-5 col-form-label">Schedule Grid Size</label>
            <div class="col-sm-7">
                <select v-model="periodSizeMinutes" class="form-select" aria-label="Schedule grid size" id="periodSizeMinutes">
                    <option>Open this select menu</option>
                    <option 
                        v-for="(size, index) in periodSizeOptions" 
                        :key="index" 
                        :value="size"
                        :selected="periodSizeMinutes==size" 
                        >{{ size }} minutes</option>
                </select>
            </div>
        </div>
        <div class="row mb-3">
            <label for="lessonDuration" class="col-sm-5 col-form-label">Lesson Duration</label>
            <div class="col-sm-7">
                <select v-model="lessonDurationMinutes" class="form-select" aria-label="Lesson Duration" id="lessonDuration">
                    <option 
                        v-for="(length, index) in lessonDurationOptions" 
                        :key="index" 
                        :value="length"
                        :selected="length == lessonDurationMinutes" 
                        >{{ length }} minutes</option>
                </select>
            </div>
        </div>
        <div class="row mb-3">
            <label for="startTime" class="col-sm-5 col-form-label">Day starts at</label>
            <div class="col-sm-7">
                <select v-model="startTime" class="form-select" aria-label="start time" id="startTime">
                    <option 
                        v-for="(time, index) in startTimeOptions" 
                        :key="index" 
                        :value="time"
                        :selected="time == startTime" 
                        >{{ minutesToHHMM(time) }}</option>
                </select>
            </div>
        </div>
        <div class="row mb-3">
            <label for="endTime" class="col-sm-5 col-form-label">Day ends at</label>
            <div class="col-sm-7">
                <select v-model="endTime" class="form-select" aria-label="end time" id="endTime">
                    <option 
                        v-for="(time, index) in endTimeOptions" 
                        :key="index" 
                        :value="time"
                        :selected="time == endTime" 
                        >{{ minutesToHHMM(time) }}</option>
                </select>
            </div>
        </div>
        <div class="mb-3"><button class="btn btn-outline-primary" @click="applySettings">apply settings</button></div>
    </div>
</template>

<style scoped>
.form-container {
    background: v-bind(student);
}

.student.selected {
    font-weight: bold;
}
</style>