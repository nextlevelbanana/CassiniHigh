<script>
    import {currentDay} from "./store";
</script>

<style>
    h1 {
        position: absolute;
        top: 1rem;
        right: 1rem;
        border: 1px dashed cyan;
        font-size: 48px;
        opacity: 0.8;
    }
</style>

<h1>{$currentDay}</h1>