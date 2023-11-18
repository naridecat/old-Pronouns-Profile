<!-- src/routes/write/+page.svelte -->

<script lang="ts">
    import { onMount } from "svelte";
    import { beforeNavigate } from '$app/navigation';
    import HCaptcha from '../components/HCaptcha.svelte'
    import Fa from "svelte-fa";
    import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
    import { dndzone, type Item } from 'svelte-dnd-action';
    import { fade, fly } from 'svelte/transition';
    import Birthday from "../components/plugins/Birthday.svelte";
    import Gender from '../components/plugins/Gender.svelte'
    import {pluginData} from '$lib/store'
    import Pronouns from "../components/plugins/Pronouns.svelte";
    import Sns from "../components/plugins/SNS.svelte";
    let modalContent = ""
    let pluginValue:any
    pluginData.subscribe((data:any)=>{
        pluginValue = data
    })
    function getSortedPluginValues(items:item[], pluginData:any) {
        const selectedItems = items.filter(item => item.selected);
        const sortedPluginValues = selectedItems.map(item => ({
            Id: item.id,
            Value: pluginData[item.assigned]
        }));
    return sortedPluginValues;

}
    type item = {
        id: number;
        name: string;
        selected: boolean;
        assigned: string;
    }

	let date = new Date()
    let items = [
        { id: 1, name: "생년월일", selected: false, assigned: 'birthdayValue'},
        { id: 2, name: "성별", selected: false, assigned: 'genderValue'},
        { id: 3, name: "호칭", selected: false, assigned: 'Pronouns' },
        // { id: 4, name: "SNS", selected: false, assigned: 'SNS' },
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


    let ModalOpen:boolean = false
    let Page:PageData = {
        Name: ""
    }
    let HCAPTCHA_TOKEN:string
    function callbackToken(event:CustomEvent){
        HCAPTCHA_TOKEN = event.detail.token
    }
    const deploy = async ()=>{
        if (Page.Name == ""){

            modalContent = `<div style="font-size: 1.5rem; font-weight: 800;">안내</div>
        <p>닉네임을 입력해주세요.</p>`
        ModalOpen = true
            return
        }
        if (password == passwordRetype){
            const response = await fetch('/api/document/deploy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: HCAPTCHA_TOKEN,
                    data: getSortedPluginValues(items, pluginValue),
                    password: password,
                    username: Page.Name
                })
            })
            if (response.ok){
                let responseJSON = await response.json()
                if (responseJSON.success){

            modalContent = `<div style="font-size: 1.5rem; font-weight: 800;">페이지 생성 완료</div>
        <p>${responseJSON.url}</p>`
        ModalOpen = true
                } else {
                    modalContent = `<div style="font-size: 1.5rem; font-weight: 800;">페이지 생성 실패</div>
                    <p>${responseJSON.url}</p>`
                    ModalOpen = true
                }
            }
            
        } else {
            modalContent = `<div style="font-size: 1.5rem; font-weight: 800;">안내</div>
        <p>비밀번호가 잘못되었습니다.</p>`
        ModalOpen = true
        return
        }
    }
    let password:string
    let passwordRetype:string
    onMount(async()=>{
        modalContent = `<div style="font-size: 1.5rem; font-weight: 800;">페이지를 생성하기 전 다음 내용을 꼭 확인해주세요.</div>
        <p>오랜기간 갱신이 없는 페이지는 예고 없이 삭제될 수 있어요.</p>
        <p>현재 테스트 오픈 기간이므로 사이트가 불안정할 수 있어요.</p>
        <p>본 서비스의 취지와 맞지 않는 불건전한 페이지는 예고 없이 삭제될 수 있어요.</p>`
        ModalOpen = true
    })
</script>

{#if (ModalOpen)}
<div class="modal-overlay" transition:fade={{ delay: 0, duration: 300 }}>
    <div class="modal" transition:fade={{ duration: 300 }}>
        {@html modalContent}
        <div class="modalBtnBar">
            <button on:click={()=>{ModalOpen = false}}>확인</button>
        </div>
    </div>
</div>
{/if}
<div class="header">
    <div class="inputArea">
        <span class="title">닉네임</span>
        <input type="text" autocomplete="off" bind:value={Page.Name} class="userName" placeholder="닉네임을 입력해주세요" required>
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
            {#if (plugin.id == 4)}
                <Sns/>
            {/if}
        </div>
    {/if}
    {/each}
</div>
<div class="documentSetting">
    <span style="font-size: 1.5rem; display: block; padding: 10px 0px 10px 0px">문서 설정</span>
    <div style="opacity: 0.5; margin-bottom: 10px;">비밀번호를 이용해 문서를 수정하거나 관리할 수 있습니다.</div>
    <div class="InputBox" style="margin-bottom: 10px;">
        <input type="password" bind:value={password} placeholder="비밀번호">
        <input type="password" bind:value={passwordRetype} placeholder="비밀번호 재입력">
    </div>
    <HCaptcha sitekey='510cee75-b44d-40a2-b817-37e2abaea64e' on:success={callbackToken}/>
    <button on:click={deploy}>완료</button>
</div>
<style>
    @media screen and (max-width: 540px){
        div.inputArea > .userName {
            font-size: 1.5rem !important;
        }
    }
    .documentSetting > button {
        margin-top: 10px;
        color: black;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        border: 1px solid #efefef;
        border-radius: 10px;
        background: none;
        cursor: pointer;
        font-size: 1rem;
    }
    div.pluginSetting {
        padding-top: 10px;
    }
    div.documentSetting {
        margin-bottom: 10px;
        border: 1px solid #efefef;
        border-radius: 10px;
        padding: 10px;
    }
    div.pluginSettingItem {
        margin-bottom: 10px;
        border: 1px solid #efefef;
        border-radius: 10px;
        padding: 10px;
    }
    div.pluginsList {
        display: flex;
        gap: 10px;
        overflow-x:scroll;
        flex-wrap: wrap;
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
    .InputBox {
        align-items: center;
        border-radius: 10px;
        border: 1px solid #efefef;
    }

    .InputBox > input {
        display: block;
        width: calc(100% - 20px);
        outline: none;
        border: none;
        flex-grow: 1; /* Input will fill the space */
        margin-right: 10px; /* Spacing between input and dropdown */
        padding: 10px;
        border-radius: 5px;
        font-size: 1rem;
        background: none;
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
        position: -webkit-sticky; /* For Safari */
        position: sticky;
        margin-top: 10px;
        top: 5rem; /* Adjust this value as needed to match your layout */
        z-index: 10; /* Ensure it's above other content */
        padding-top: 2.5rem; /* Give some space at the top */
        background: white;
        border-radius: 10px;
        border: 1px solid #efefef;
        padding: 10px;
    }
</style>