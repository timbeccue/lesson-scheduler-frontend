
<script>
export default {
    props: {
        students: {
            type: Array,
            required: true 
        },
        selectedStudent: {
            type: Number,
            default: 0,
        }
    },
    emits: ['update:selectedStudent'],
    methods: {
        colorBackgroundFromStudent(student) {
            let color = student.color
            let styleString = `background: ${color};`
            return ''//styleString
        },
        studentClassesFromIndex(index) {
            let classes = "" 
            if (index == this.selectedStudent) {
                classes += " active"
            }
            return classes
        },
        clickHandler(event) {
            const index = parseInt(event.srcElement.attributes['data-index'].value)
            this.$emit('update:selectedStudent', index)
        },
        removeStudent(index) {
            this.$emit('remove', index)
        },
    }
}
</script>

<template>
    <ul class="list-group">
        <li
            v-for="(student, index) in students"
            :key="index"
            :class="'list-item' + studentClassesFromIndex(index)"
            :data-index="index"
            @click="clickHandler"
            >
            <!--span class="badge rounded-circle" :style="colorBackgroundFromStudent(student)">&nbsp;</span-->
            <div class="name" :style="'' + colorBackgroundFromStudent(student)">{{ student.name }}</div>
            <!--span class="colorbar" :style="colorBackgroundFromStudent(student)">&nbsp;</span-->
            <button type="button" @click="removeStudent(index)" class="btn-close me-2" aria-label="Close"></button>
        </li>
    </ul>
</template>

<style scoped>
.student-container {
    width: 15em;
}
.list-item+.list-item {
    border-top-width: 0;
}
.list-item{
    display:flex;
    justify-content:space-between;
    align-items: center;
    gap: 1em;
    border: 1px solid rgba(0,0,0,.125);
    text-align:left;
    background: white;
    cursor:pointer;
}
.name {
    padding: 0.25rem 0.5rem;
    pointer-events: none;
    /* width: 70%; */
    flex-grow:1;
}

.colorbar {
    width: 10px;
    height: 100%;
    margin:0;
    padding:0;
    pointer-events:none;
}

.list-item.active > *{
    font-weight:900;
}
.list-item.active {
    border-top-width: 1px;
    /* width: calc(100% + 40px); */
}
</style>