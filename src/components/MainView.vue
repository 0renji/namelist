<template>
    <div>
        {{test}}
    </div>
</template>

<script>
    export default {
        name: "MainView",

        computed: {
            test() {
                return this.$store.getters['global/test'];
            }
        }
    }
</script>

<style scoped>

</style>
