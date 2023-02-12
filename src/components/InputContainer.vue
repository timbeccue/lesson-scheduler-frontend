<script>
export default {
    data() {
        return {
            students: [
                {
                    name: "tim beccue",
                    color: "lightblue",
                    busy: [],
                },
                {
                    name: "william gu",
                    color: "pink",
                    busy: [],
                },
                {
                    name: "allison wang",
                    color: "lavender",
                    busy: [],
                },
                {
                    name: "jesse su",
                    color: "lemonchiffon",
                    busy: [],
                },
            ],
            selectedStudent: 1,
        }
    },
    methods: {
        updateSettings(s) {
            console.log(s)
        }
    },
}
</script>
<script setup>
import StudentListSelector from '@/components/StudentListSelector.vue';
import AddStudentForm from '@/components/AddStudentForm.vue';
import ScheduleConfigForm from '@/components/ScheduleConfigForm.vue';
</script>

<template>
    <div class="stuff-wrapper">
        <ScheduleConfigForm @update="updateSettings" />
        <AddStudentForm v-model:students="students" />
        <StudentListSelector :students="students" v-model:selectedStudent="selectedStudent" />

    </div>
</template>

<style scoped>
.stuff-wrapper {
    margin: 1em;
    display:flex;
    gap: 1em;
}
</style>