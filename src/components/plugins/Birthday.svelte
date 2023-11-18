<script lang="ts">
    import { DateInput } from 'date-picker-svelte';
    import { pluginData } from '$lib/store';
    import { onMount } from 'svelte';

</script>
<span style="font-size: 1.5rem; display: block; padding: 10px 0px 10px 0px">생일</span>
<div style="opacity: 0.5;">태어난지 얼마나 지났는지 표시합니다.</div>
<div class="InputBox" style="margin-top: 10px;">
    <input type="date" bind:value={$pluginData.birthdayValue}/>
</div>
<style>
    input {
        width: calc(100% - 10px);
        padding: 10px;
        border: none;
        background: none;
        outline: none;
    }
    .InputBox {
        display: flex;
        align-items: center;
        border-radius: 10px;
        border: 1px solid #efefef;
    }
</style>