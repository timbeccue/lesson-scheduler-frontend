<script>
import axios from 'axios'
import example_data from '@/json/group_data.json'
export default {
    data() {
        return {
            base_url: "https://mnfqx5fo68.execute-api.us-east-1.amazonaws.com",
            //base_url: "http://127.0.0.1:5000",

            days: ['mon', 'tue', 'wed', 'thu', 'fri'],
            //days:['mon', 'tue' ],
            minutesPerPeriod: 30,
            minutesBeforeStart: 480,    // 8am start
            periodsPerDay: 24,          // 6pm end
            lessonDuration: 2,

            students: example_data.map(s => {

                return {
                    name: s.name, 
                    color: s.color, 
                    busy: Array.from({length: (24 * 5)}, (_, i) => i).filter(x => !s.busy.includes(x))
                }
            }),
            students1: [
                {
                    name: "beethoven quartet",
                    color: "pink",
                    busy: [28,29,30,31,32,33,19,20,21,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,67,68,69,70,71,76,77,78,79,80,91,92,93,94,95,103,104,105,106,115,116,117,118,119],
                },
                {
                    name: "schumann quartet",
                    color: "lightblue",
                    busy: [0,1,2,3,4,5,6,7,8,9,10,11,12,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,72,73,74,75,76,77,78,79,80,85,86,96,97,98,99,100,101,102,103,104],
                },
                {
                    name: "brahms trio",
                    color: "lavender",
                    busy: [0],
                },
                {
                    name: "bartok quartet",
                    color: "lemonchiffon",
                    busy: [],
                },
            ],
            selectedStudent: 0,
            prof: {
                name: "firstname lastname",
               busy: [ 0,1,2,3,4,5,6,7,8,9,24,25,26,48,72,96,57,58,59,60,61,62,45,46,47,22,23,70,71,95,119,118,94,10,11,12,13,14,43,44,97,98,99]
            },
            generalBusyTimes: [15,16,17,18,39,40,41,42,63,64,65,66,87,88,89,90,111,112,113,114],

            solutionFailed: false,
            solutions: [],

            activeTab: 1,
            loadingOneSchedule: false,
            loadingAllSchedules: false,

            showProfBusyOnSolutions: false,
            showGroupBusyTimes: false,
            selectedGroupForBusyTimes: 0,
            
        }
    },
    computed: {

        studentColors() {
            // Returns an object of students with key=name and val=color
            return this.students.reduce((acc, cur, i) => (
                {...acc, [cur.name]: cur.color}), {})
        },
        timeslotViewConfig() {
            return {
                days: this.days,
                minutesPerPeriod: this.minutesPerPeriod,
                minutesBeforeStart: this.minutesBeforeStart,
                periodsPerDay: this.periodsPerDay,
                disabledCells: this.generalBusyTimes,
            }
        },
        limitedSolutions() {
            function compare(a, b) {
                let allValuesA = [];
                let allValuesB = [];
                for (let key in a) {
                    allValuesA = allValuesA.concat(a[key]);
                }
                for (let key in b) {
                    allValuesB = allValuesB.concat(b[key]);
                }
                let diffA = Math.max(...allValuesA) - Math.min(...allValuesA);
                let diffB = Math.max(...allValuesB) - Math.min(...allValuesB);
                return diffA - diffB;
            }
            let sortedArray = this.solutions.sort(compare);
            return sortedArray.slice(0,20)
        },
        allBusyPeriods() {
            let busy = [
                ...this.prof.busy, 
                ...[].concat(...this.students.map(s => s.busy))
            ]
            console.log(busy)
            return busy
        },
        selectedBusyPeriodsToShow() {
            let periods = []
            if (this.showProfBusyOnSolutions) {
                periods = [...this.prof.busy]
            }
            if (this.showGroupBusyTimes) {
                periods = [...periods, ...this.students[this.selectedGroupForBusyTimes].busy]
            }
            return periods
        }
    },

    methods: {
        range(a) {
            let allValuesA = [];
            for (let key in a) {
                allValuesA = allValuesA.concat(a[key]);
            }
            let diffA = Math.max(...allValuesA) - Math.min(...allValuesA);
            return diffA 
        },

        stringToBase64(jsonString) {
            //let jsonString = JSON.stringify(jsonObj);
            let encoder = new TextEncoder();
            let jsonUint8 = encoder.encode(jsonString);
            let base64String = jsonUint8.reduce((data, byte) => data + String.fromCharCode(byte), '');
            base64String = btoa(base64String);
            return base64String;
        },
        encodeBase64ToString(base64String) {
            let jsonString = atob(base64String);
            let decoder = new TextDecoder();
            jsonString = decoder.decode(new Uint8Array(jsonString.split('').map(char => char.charCodeAt(0))));
            //let json = JSON.parse(jsonString);
            return jsonString;
        },

        updateSettings(s) {
            this.minutesBeforeStart = s.startTime
            this.lessonDuration = s.lessonDurationPeriods
            this.periodsPerDay = s.periodsPerDay
            this.minutesPerPeriod = s.periodSizeMinutes
            console.log(s)
        },

        getAdd() {
            const url = this.base_url + '/add'
            const data = {
                a: 5,
                b: 6,
            }
            axios.post(url, data).then(r => {
                console.log(r)
            }).catch(e => {
                console.warn(e)
            })

        },
        getAllSolutions() {
            this.loadingAllSchedules = true

            // Clear past results
            this.solutionFailed = false
            this.solutions = []

            const url = this.base_url + "/solveall"
            const data = {
                scheduleConfig: {
                    ...this.timeslotViewConfig,
                    lessonDuration: this.lessonDuration,
                },
                students: this.students,
                prof: this.prof,
                generalBusyTimes: this.generalBusyTimes
            }
            axios.post(url, data).then(r => {
                this.loadingAllSchedules = false
                const solutionFound = r.data.solutionFound
                const solutions = r.data.solutions
                console.log(solutions)

                if (!solutionFound) {
                    this.solutionFailed = true
                    return
                }
                this.solutions = solutions

            }).catch(e => {
                this.loadingAllSchedules = false
                console.warn(e)
            })
        },
        getOneSolution() {
            this.loadingOneSchedule = true

            // Clear past results
            this.solutionFailed = false
            this.solutions = []

            const url = this.base_url + "/solve"
            const data = {
                scheduleConfig: {
                    ...this.timeslotViewConfig,
                    lessonDuration: this.lessonDuration,
                },
                students: this.students,
                prof: this.prof,
                generalBusyTimes: this.generalBusyTimes
            }
            axios.post(url, data).then(r => {
                this.loadingOneSchedule = false
                const solutionFound = r.data.solutionFound
                const solution = r.data.solution
                console.log(solution)

                if (!solutionFound) {
                    this.solutionFailed = true
                    return
                }
                this.solutions = [solution]

            }).catch(e => {
                this.loadingOneSchedule = false
                console.warn(e)
            })
        },
        removeStudent(index) {
            this.students.splice(index,1)
        },
    }
}
</script>
<script setup>
import TimeslotViewer from '@/components/TimeslotViewer.vue';
import StudentListSelector from '@/components/StudentListSelector.vue';
import InputContainer from '@/components/InputContainer.vue';
import AddStudentForm from '@/components/AddStudentForm.vue';
import ScheduleConfigForm from '@/components/ScheduleConfigForm.vue';
</script>

<template>
    <div class="container-sm">

        <ul class="nav nav-pills justify-content-center">
            <li class="nav-item">
                <button class="nav-link" @click="activeTab = 1" :class="activeTab==1 ? 'active' : ''">Setup</button>
            </li>
            <li class="nav-item">
                <button class="nav-link" @click="activeTab = 2" :class="activeTab==2 ? 'active' : ''">My Availability</button>
            </li>
            <li class="nav-item">
                <button class="nav-link" @click="activeTab = 3" :class="activeTab==3 ? 'active' : ''">Students Availability</button>
            </li>
            <li class="nav-item">
                <button class="nav-link" @click="activeTab = 4" :class="activeTab==4 ? 'active' : ''">Solutions</button>
            </li>
        </ul>

        <div class="tab-content" v-if="activeTab == 1">
            <div class="container-xl row gx-7">
                <div class="col-4">
                    <p class="fs-4">Schedule Settings</p>
                    <KeepAlive>
                        <ScheduleConfigForm @update="updateSettings" />
                    </KeepAlive>
                    <hr>
                    <p class="fs-4">Groups</p>
                    <StudentListSelector :students="students" v-model:selectedStudent="selectedStudent" style="width: 100%;" @remove="removeStudent"/>
                    <div class="mb-3"/>
                    <AddStudentForm v-model:students="students" />
                </div>
                <div class="col-1"/>
                <div class="col-7">
                    <div class="d-flex justify-content-between">
                        <p class="fs-5">Specify Non-Schedulable Times Here</p>
                        <button class="btn btn-outline-secondary" @click="generalBusyTimes=[]">clear selection</button>
                    </div>
                    <TimeslotViewer v-bind="timeslotViewConfig" v-model:selectedCells="generalBusyTimes" ignoreDisabledCells/>
                </div>
            </div>
        </div>
        <div class="tab-content" v-if="activeTab == 2">
            <div class="container-xl row gx-7">
                <div class="col-4">
                    <p class="fs-4">Schedule Settings</p>
                    <KeepAlive>
                        <ScheduleConfigForm @update="updateSettings" />
                    </KeepAlive>
                </div>
                <div class="col-1"/>
                <div class="col-7">
                    <div class="d-flex justify-content-between">
                        <p class="fs-5">Specify your busy hours here</p>
                        <button class="btn btn-outline-secondary" @click="prof.busy=[]">clear selection</button>
                    </div>
                    <TimeslotViewer v-bind="timeslotViewConfig" v-model:selectedCells="prof.busy" />
                </div>
            </div>
        </div>
        <div class="tab-content" v-if="activeTab == 3">
            <div class="container-xl row gx-7">
                <div class="col-4">
                    <p class="fs-4 mb-4">Groups</p>
                    <StudentListSelector :students="students" v-model:selectedStudent="selectedStudent" @remove="removeStudent"/>
                    <div class="mb-3"/>
                    <AddStudentForm v-model:students="students" />
                </div>
                <div class="col-1"/>
                <div class="col-7">
                    <div class="d-flex justify-content-between">
                        <div>
                            <span class="fs-5">Specify busy times for: </span> 
                            <span class="fs-5" :style="`background: ${students[selectedStudent].color};`">{{ students[selectedStudent].name }}</span>
                        </div>
                        <button class="btn btn-outline-secondary" @click="students[selectedStudent].busy = []">clear selection</button>
                    </div>
                    <TimeslotViewer v-bind="timeslotViewConfig" v-model:selectedCells="students[selectedStudent].busy" />
                </div>
            </div>
        </div>
        <div class="tab-content" v-if="activeTab == 4">
            <div class="container-xl row gx-7">
                <div class="col-4">

                        <button class="btn btn-outline-success btn-lg mb-3" @click="getOneSolution">
                            <span>generate one schedule</span>
                            <span v-if="loadingOneSchedule" class="spinner-border spinner-border-sm ms-4" role="status" aria-hidden="true"></span>
                            <span class="visually-hidden">Loading...</span>
                        </button>

                        <button class="btn btn-outline-success btn-lg mb-3" @click="getAllSolutions">
                            <span>generate many schedules </span>
                            <span v-if="loadingAllSchedules" class="spinner-border spinner-border-sm ms-4" role="status" aria-hidden="true"></span>
                            <span class="visually-hidden">Loading...</span>
                        </button>

                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="profBusySelect" v-model="showProfBusyOnSolutions">
                            <label class="form-check-label" for="profBusySelect">Show Professor Busy Times</label>
                        </div>

                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="groupBusySelect" v-model="showGroupBusyTimes">
                            <label class="form-check-label" for="groupBusySelect">Include busy times for selected group: </label>
                        </div>

                        <select v-model="selectedGroupForBusyTimes" class="form-select" aria-label="Default select example">
                            <option selected>Open this select menu</option>
                            <option v-for="(student,index) in students"
                                :key="index"
                                :value="index"
                                >{{ student.name }}</option>
                        </select>

                </div>
                <div class="col-1"/>
                <div class="col-7">
                    <p class="text-danger" v-if="solutionFailed">Solution not found for the given inputs</p>
                    <div 
                        v-for="(solution, index) in limitedSolutions"
                        :key="index"
                        class="mb-5"> 
                        <div class="d-flex justify-content-between">
                            <p class="fs-5">solution #{{ index+1 }}, range={{ range(solution) }}</p>
                            <!--button class="btn btn-outline-secondary" @click="student.busy = []">clear selection</button-->
                        </div>
                        <TimeslotViewer readOnly v-bind="timeslotViewConfig" :solutions="solutions[index]" :solution-colors="studentColors" :busy-period-overlay="selectedBusyPeriodsToShow" />
                    </div>
                </div>
            </div>
            <div class="schedule-group">


                <p class="text-danger" v-if="solutionFailed">Solution not found for the given inputs</p> 
            </div>
        </div>


    </div>
</template>

<style scoped>
.tab-content {
    margin: 4rem;
}
.input-container {
    display: flex;
    gap: 3em;
    margin: 1em;
    overflow-x: auto;
}
.output-container {
    display:flex;
    gap: 3em;
    margin: 1em;
    overflow-x: auto;
}
.schedule-group {
    display: flex; 
    flex-direction: column;
    gap: 1em;
}
</style>