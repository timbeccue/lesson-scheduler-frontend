
<script>

/*

Inputs to this component should handle configuration of:
- visible schedule grid
    - start/end for each day
    - size of periods
- periods that are disabled
- periods that are selected

visible schedule grid requires:
- days
- periods per day (e.g. there would be 12 periods if periods were 1hr and day was 8am-8pm)
- time of first period
- length of period 


// READONLY
timeslotViewConfig = {
    days: ['mon', 'tue', 'wed'],
    minutesPerPeriod: 30,
    minutesBeforeStart: 480,    // 8am start
    periodsPerDay: 20,          // 6pm end
    disabledCells: [ // index of cells that should be disabled if cells were combined into one chronological array
        1,2,3, 21,22,23
    ]
}

// MUTABLE
selectedCells = [
    4,5, 10
]

*/

import utils from '../utils.js'

export default {
    props: {
        days: {
            type: Array,
            required: true,
        },
        minutesPerPeriod: {
            type: Number,
            required: true,
        },
        minutesBeforeStart: {
            type: Number,
            required: true,
        },
        periodsPerDay: {
            type: Number,
            required: true,
        },
        disabledCells: {
            type: Array,
            default: () => []
        },
        ignoreDisabledCells: {
            type: Boolean,
            default: false,
        },
        busyPeriodOverlay: {
            type: Array,
            default: () => [],
        },
        selectedCells: { // this is the one used in v-model
            type: Array,
            default: () => []
        },
        selectedColor: {
            type: String,
            default: () => '#444'
        },
        readOnly: {
            type: Boolean,
            default: false,
        },
        solutions: {
            type: Object,
            default: () => {} 
        },
        solutionColors: {
            type: Object,
            default: () => {} 
        },

    },
    emits: ['update:selectedCells'],
    data() {
        return {
            mouseIsDown: false
        }
    },
    computed: {
        totalNumPeriods() {
            return this.periodsPerDay * this.days.length
        },
        // Array of indexes that are scheduled in the solution
        solutionCells() {
            let s = [] 
            for (let student in this.solutions) {
                s = [...s, ...this.solutions[student]]
            }
            return s
        },
        // Object with key=cell index and val=name to be displayed.
        nameCells() {
            let nameCells = {}
            for (let student in this.solutions) {
                let index = this.solutions[student]
                nameCells[index[0]] = student
            }
            return nameCells
        },
        colorsFromIndex() {
            let colorCells = {}
            for (let solution in this.solutions) {
                let periodIndex = this.solutions[solution]
                for (let index in periodIndex) {
                    colorCells[periodIndex[index]] = this.solutionColors[solution]
                }
            }
            return colorCells
        }
    },
    methods: {
        handleMouseDown(event) {
            event.preventDefault()
            this.mouseIsDown = true
            this.cellClickHandler(event)
        },
        handleMouseUp(event) {
            this.mouseIsDown = false
        },
        handleMouseEnter(event) {
            event.preventDefault()
            if (this.mouseIsDown) {
                this.cellClickHandler(event)
            }
        },
        handleMouseLeave(event) {
            if (this.mouseIsDown) {
                this.mouseIsDown = false
            }
        },
        cellClickHandler(event) {

            function addOrRemove(array, value) {
                let index = array.indexOf(value);
                if (index === -1) {
                    array.push(value);
                } else {
                    array.splice(index, 1);
                }
            } 

            if (this.readOnly || event.srcElement.classList.contains('disabled')) return

            const index = parseInt(event.srcElement.attributes['data-index'].value)

            let newSelectedCells = [...this.selectedCells]
            addOrRemove(newSelectedCells, index)
            this.$emit('update:selectedCells', newSelectedCells)
        },
        cellClassesByIndex(index) {
            let classes = "cell day-period"
            if (this.selectedCells.includes(index)) {
                classes += " selected"
            }
            if (this.disabledCells.includes(index) && !this.ignoreDisabledCells) {
                classes += " disabled"
            }
            if (this.busyPeriodOverlay.includes(index)) {
                classes += " busy"
            }
            if (this.solutionCells.includes(index)) {
                classes += " solution"
                if (index in this.nameCells) {
                    classes += " named"
                }
            }
            return classes
        },
        cellStyleByIndex(index) {
            let style = "background: red;"
            if (index in this.colorsFromIndex) {
                let color = this.colorsFromIndex[index]
                style = ` background: ${color};`
                return style
            }
            return ""
        },
        cellContentByIndex(index) {
            let content = ""
            if (index in this.nameCells) {
                content += " " +this.nameCells[index]
            } 
            return content

        },
        formatTime: utils.minutesToHHMM,
    },
}
</script>

<template>
    <!-- TODO: rewrite with bootstrap grid system for responsive resizing -->
    <div class="mouse-container" @mouseleave="handleMouseLeave">
        <div class="timeslot-columns">
            <div class="time-column">
                <div class="day-name">&nbsp;</div>
                <div class="cell time-cell" 
                    v-for="(period, p_index) in periodsPerDay" 
                    :key="period">
                        <div class="row-time">{{ formatTime(p_index * minutesPerPeriod + minutesBeforeStart) }}</div>
                </div>

            </div>
            <div class="day-column" v-for="(day, d_index) in days" :key="day">
                <div class="day-name">{{ day }}</div>
                <div 
                    v-for="(period, p_index) in periodsPerDay" 
                    :key="period" 
                    :class="cellClassesByIndex((periodsPerDay * d_index) + p_index)" 
                    :style="cellStyleByIndex((periodsPerDay * d_index) + p_index)" 
                    :id="`${day}-${p_index}`"
                    :data-index="(periodsPerDay * d_index) + p_index"
                    @mousedown="handleMouseDown"
                    @mouseup="handleMouseUp"
                    @mousemove="handleMouseMove"
                    @mouseenter="handleMouseEnter"
                    >
                    <!--div>{{  (periodsPerDay * d_index) + p_index }}</div-->
                    <div
                        class="solution-name" 
                        v-if="((periodsPerDay * d_index) + p_index) in nameCells">
                        {{ cellContentByIndex((periodsPerDay * d_index) + p_index) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.timeslot-columns {
    display: flex;
}

.day-name {
    text-align: center;
}

.cell+.cell {
    border-top: none;
}
.cell {
    /* outline: 1px solid grey; */
    border: 1px solid rgba(0,0,0,.125);
    outline-offset:-1px;
    height: 1.5em;
    color:rgba(0,0,0,.125);
    font-size: 12pt;
    /* margin-left: -1px; */
    /* margin-top: -1px; */
    width: min-content;
}
.cell:not(.time-cell):hover {
    border-width: 3px;
    overflow: hidden;
}
.cell:not(.time-cell):nth-child(odd) {
    border-bottom: 1px solid black;
}

.cell.day-period {
    min-width: 100px;
}

.cell.time-cell {
    color: black;
    border-color: rgba(0,0,0,0.01);
    display: flex;
    flex-direction: row-reverse;
    /* align-items: flex-end; */
    padding-right: 0.5em;
    width: 70px;
}
.time-cell > .row-time {
    margin-top: -0.8rem;
    font-size:10pt;
}
.time-cell:nth-child(odd) {
    opacity:0.1;
}

.cell.busy {
    background-color: #cacaca;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath fill-rule='evenodd' d='M0 0h4v4H0V0zm4 4h4v4H4V4z'/%3E%3C/g%3E%3C/svg%3E");
}
.cell.selected {
    background: v-bind(selectedColor);
    color:grey;
}
.cell.disabled {
    background: lightgrey;
}
.cell.solution {
    background: #140042;
}
.solution-name {
    color: black;
    /* white-space:pre-wrap; */
    overflow: hidden;
    text-overflow: ellispis;
    
}
.cell:not(.disabled):hover {
    cursor: pointer;
}


</style>