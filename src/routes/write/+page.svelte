<!-- src/routes/write/+page.svelte -->

<script lang="ts">
    import { onMount } from "svelte";
    import { beforeNavigate } from '$app/navigation';
    import Fa from "svelte-fa";
    import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
    import { dndzone, type Item } from 'svelte-dnd-action';
    import { fade, fly } from 'svelte/transition';
    import Birthday from "../../components/plugins/Birthday.svelte";
    import Gender from '../../components/plugins/Gender.svelte'
    import {pluginData} from '$lib/store'
    import { page } from "$app/stores";
    import Pronouns from "../../components/plugins/Pronouns.svelte";
    
    let pluginValue:any
    pluginData.subscribe((data:any)=>{
        pluginValue = data
    })
	let date = new Date()
    let items = [
        { id: 1, name: "생년월일", selected: false },
        { id: 2, name: "성별", selected: false },
        { id: 3, name: "호칭", selected: false },
        { id: 4, name: "SNS", selected: false },
        { id: 5, name: "디데이", selected: false },
        { id: 6, name: "국가 시간대", selected: false },
        { id: 7, name: "지향성", selected: false },
    ];
    function handleDndUpdate(event: CustomEvent) {
        items = event.detail.items;
    }

    function toggleItem(plugin:PluginItem) {
        const index = items.findIndex(item => item.id === plugin.id);
        if (index !== -1) {
            items[index].selected = !items[index].selected;
            // Svelte가 변경사항을 감지하도록 배열을 재할당합니다.
            items = [...items];
        }
    }


    let WarningModal:boolean = false
    let Page:PageData = {
        Name: ""
    }
    onMount(async()=>{
        WarningModal = true
    })
</script>

{#if (WarningModal)}
<div class="modal-overlay" transition:fade={{ delay: 0, duration: 300 }}>
    <div class="modal" transition:fade={{ duration: 300 }}>
        <div style="font-size: 1.5rem; font-weight: 800;">페이지를 생성하기 전 다음 내용을 꼭 확인해주세요.</div>
        <p>한 달 이상 접속이 없는 공간은 삭제돼요.</p>
        <p>공간을 생성할 때 정한 비밀번호를 입력해 내용을 수정할 수 있어요.</p>
        <p>본 사이트의 취지와 맞지 않는 불건전한 페이지는 예고 없이 삭제될 수 있어요.</p>
        <div class="modalBtnBar">
            <button on:click={()=>{WarningModal = false}}>확인</button>
        </div>
    </div>
</div>
{/if}
<div class="header">
    <div class="inputArea">
        <span class="title">닉네임</span>
        <input type="text" bind:value={Page.Name} class="userName" placeholder="닉네임을 입력해주세요" required>
    </div>
</div>
<div class="plugins">
    <div use:dndzone={{ items, flipDurationMs: 300 }} on:consider={handleDndUpdate} on:finalize={handleDndUpdate} class="pluginsList">
        {#each items as plugin (plugin.id)}
            <button class="pluginItem" on:click={($plugin)=>{toggleItem(plugin)}}>
                {#if (!plugin.selected)}
                <Fa icon={faPlus}/>
                {:else}
                <Fa icon={faMinus}/>
                {/if}
                <span class="placeholder">{plugin.name}</span>
            </button>
        {/each}
    </div>
</div>
<div class="pluginSetting">
    {#each items as plugin}
    {#if (plugin.selected)}
        <div class="pluginSettingItem">
            {#if (plugin.id == 1)}
                <Birthday/>
            {/if}
            {#if (plugin.id == 2)}
                <Gender/>
            {/if}
            {#if (plugin.id == 3)}
                <Pronouns/>
            {/if}
        </div>
    {/if}
    {/each}
</div>
<style>
    @media screen and (max-width: 540px){
        div.inputArea > .userName {
            font-size: 1.5rem !important;
        }
    }
    div.pluginSetting {
        padding-top: 2rem;
    }
    div.pluginSettingItem {
        margin-bottom: 30px;
        border: 1px solid #efefef;
        border-radius: 10px;
        padding: 10px;
    }
    div.pluginsList {
        display: flex;
        gap: 10px;
        overflow-x:scroll;
    }
    div.pluginsList > button.pluginItem {
        width: fit-content;
        border-radius: 10px;
        background: white;
        border: 1px solid #efefef;
        user-select: none;
        white-space: nowrap;
        transition: 0.3s background;
        padding: 10px;
        cursor: pointer;
    }
    div.pluginsList > button.pluginItem:hover {
        background: #efefef;
    }
    div.header {
        padding-top: 5rem;
        padding-bottom: 2.5rem;
        border-bottom: 1px solid #efefef;
    }
    div.inputArea > span.title {
        display: block;
    }
    div.inputArea > input[type=text] {
        border: none;
        padding: 4px;
    }
    div.inputArea > input[type=text]::placeholder {
        color: #6f6f6f;
    }
    div.inputArea > .userName {
        font-size: 3rem;
        outline: none;
    }
    div.modalBtnBar {
        float: right;
    }
    div.modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    div.modal {
        background: white;
        padding: 20px;
        border-radius: 10px;
        max-width: 500px;
        width: 100%;
        z-index: 1001;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        position: relative;
    }
    div.modal > .modalBtnBar > button {
        padding: 0;
        background: transparent;
        border: none;
        cursor: pointer;
    }
    div.plugins {
        padding: 2.5rem 0 0rem 0;
    }
</style>