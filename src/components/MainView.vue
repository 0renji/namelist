<template>
    <div>
    </div>
</template>

<script>
    import api from '../api/'

    export default {
        name: "MainView",

        created() {
            api.getNamesFor(2019, 'friedrichshain-kreuzberg')
        },

        computed: {
        }
    }
</script>

<style scoped>

</style>
