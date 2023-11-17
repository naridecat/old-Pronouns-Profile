<script>
    import { DateInput } from 'date-picker-svelte';
    import { pluginData } from '$lib/store';
</script>
<span style="font-size: 1.5rem; display: block; padding: 10px 0px 10px 0px">생일</span>
<input type="date" bind:value={$pluginData.birthdayValue}/>

<style>
    input {
        width: calc(100% - 10px);
        padding: 5px;
        border: 1px solid #efefef;
    }
</style>