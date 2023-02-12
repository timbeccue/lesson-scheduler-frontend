
<script>
import utils from '../utils.js'
export default {
    props: {
        students: {
            type: Array,
            required: true 
        },
    },
    data() {
        return {
            name: '',
            color: utils.getColor(),
        }
    },
    emits: ['update:students'],
    methods: {
        getRandomColor() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        },
        newStudent() {
            let student = {
                name: this.name, 
                color: this.color,
                busy: []
            }
            this.$emit('update:students', [...this.students, student])

            // clear inputs
            this.name = ''
            this.color = utils.getColor()
        }
    }
}
</script>

<template>
    <div class="form-container">
        <div class="input-group">
            <button class="btn btn-outline-primary" type="button" id="button-addon2" @click="newStudent">add group</button>
            <input type="text" placeholder="name" class="form-control" v-model="name">
        </div>
            <!-- <input type="color" style="width: 50px;" class="form-control form-control-color" v-model="color" title="Choose your color" list="presetColors">
            <datalist id="presetColors">
                <option>#ff0000</option>/>
                <option>#00ff00</option>
                <option>#0000ff</option>
                <option>#f000ff</option>
                <option>#0f00ff</option>
                <option>#00f0ff</option>
            </datalist>
        </div>-->
    </div>
</template>

<style scoped>

.flex {
    display:flex;
}
.form-container {
    background: v-bind(student);
}

.student.selected {
    font-weight: bold;
}
</style>