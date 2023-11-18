<script lang="ts">
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import { fade } from "svelte/transition";
    import HCaptcha from "../../../components/HCaptcha.svelte";
    export let data;
    if (!data.success && data.reason == "Not Found" && browser) {
        goto("/404");
    }
    let errorMessage = "";
    let pagePwd = "";
    const calculateTimePassed = (birthday: string) => {
        const today = new Date();
        const birthDate = new Date(birthday);
        const timeDiff = today.getTime() - birthDate.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
        return daysDiff;
    };
    let HCAPTCHA_TOKEN: string;
    function callbackToken(event: CustomEvent) {
        HCAPTCHA_TOKEN = event.detail.token;
    }
    const calculateAge = (birthday: string) => {
        const today = new Date();
        const birthDate = new Date(birthday);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();

        // 만약 오늘이 생일이 지난 달이라면, 나이에서 1을 빼줍니다.
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    let togglePassword: boolean = false;
    let actiontype: string;

    let modalContent: string;
    let ModalOpen: boolean;
    async function callBump() {
        if (actiontype == "bump") {
            const bumpData = await fetch(`/p/${data.url}/bump`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    password: pagePwd,
                    token: HCAPTCHA_TOKEN,
                }),
            });
            if (bumpData.ok) {
                togglePassword = false;
                modalContent = `<div style="font-size: 1.5rem; font-weight: 800;">갱신 완료</div>`;
                ModalOpen = true;
            } else {
                const data: any = await bumpData.json();
                errorMessage = data.reason;
            }
        } else if (actiontype == "drop") {
            const bumpData = await fetch(`/p/${data.url}/drop`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    password: pagePwd,
                    token: HCAPTCHA_TOKEN,
                }),
            });
            if (bumpData.ok) {
                togglePassword = false;
                modalContent = `<div style="font-size: 1.5rem; font-weight: 800;">삭제 완료</div>`;
                ModalOpen = true;
            } else {
                const data: any = await bumpData.json();
                errorMessage = data.reason;
            }
        }
    }
</script>

<div style="">
    {#if data.success}
        <div class="Header">
            <div class="Nickname">{data.username}</div>
            <div>최근 갱신 : {data.lastBumped}</div>
        </div>
        <div class="Plugins">
            {#each data.data as plugin}
                <div class="PluginItem">
                    {#if plugin.Id == 1}
                        <!--생일-->
                        <div
                            style="padding: 10px 0px 20px 0px; border-bottom: 1px solid #efefef;"
                        >
                            🎂 <b>생일</b> : {plugin.Value} ( D+{calculateTimePassed(
                                plugin.Value
                            )} )
                        </div>
                        <div style="padding: 20px 0px 10px 0px">
                            🎓 <b>나이</b> : {calculateAge(plugin.Value)}
                        </div>
                    {:else if plugin.Id == 2}
                        <!--성별-->
                        <div style="padding: 10px 0px 10px 0px;">
                            ⚧ <b>성별</b> : {plugin.Value}
                        </div>
                    {:else if plugin.Id == 3}
                        <!--호칭-->
                        <div
                            style="padding: 10px 0px 20px 0px; border-bottom: 1px solid #efefef;"
                        >
                            <b style="display: block;">😁 호칭</b>
                        </div>
                        <div style="padding: 10px 0px 10px 0px;">
                            {#each plugin.Value as pronoun}
                                <div style="padding: 10px;">
                                    {pronoun.Emoji}
                                    {pronoun.Name}
                                </div>
                            {/each}
                        </div>
                        <!-- {:else if (plugin.Id == 4)} -->
                    {/if}
                </div>
            {/each}
            <div style="padding: 10px;">
                <button
                    on:click={() => {
                        (errorMessage = ""),
                            (actiontype = "bump"),
                            (togglePassword = true);
                    }}>갱신</button
                >
                <button
                    on:click={() => {
                        (errorMessage = ""),
                            (actiontype = "drop"),
                            (togglePassword = true);
                    }}>삭제</button
                >
            </div>
        </div>
    {/if}
</div>

{#if togglePassword}
    <div class="modal-overlay" transition:fade={{ delay: 0, duration: 300 }}>
        <div class="modal" transition:fade={{ duration: 300 }}>
            <div style="padding-bottom: 10px; font-size: 1.5rem;">
                {#if actiontype == "drop"}
                    [삭제 확인]
                {:else if actiontype == "bump"}
                    [갱신 확인]
                {/if}

                페이지 비밀번호를 입력해주세요
            </div>
            <div class="InputBox">
                <input
                    type="password"
                    bind:value={pagePwd}
                    autocomplete="off"
                    name="pagePassword"
                    placeholder="페이지 비밀번호"
                />
            </div>
            <HCaptcha
                sitekey="510cee75-b44d-40a2-b817-37e2abaea64e"
                on:success={callbackToken}
            />

            <p>{errorMessage}</p>
            <div class="modalBtnBar">
                <button
                    on:click={() => {
                        togglePassword = false;
                    }}>취소</button
                >
                <button
                    on:click={() => {
                        callBump();
                    }}>확인</button
                >
            </div>
        </div>
    </div>
{/if}

{#if ModalOpen}
    <div class="modal-overlay" transition:fade={{ delay: 0, duration: 300 }}>
        <div class="modal" transition:fade={{ duration: 300 }}>
            {@html modalContent}
            <div class="modalBtnBar">
                <button
                    on:click={() => {
                        ModalOpen = false;
                    }}>확인</button
                >
            </div>
        </div>
    </div>
{/if}

<style>
    div.modalBtnBar {
        padding-top: 10px;
        float: right;
        gap: 10px;
    }
    button {
        font-size: 1rem;
        padding: 0;
        margin-left: 10px;
        border-radius: 4px;
        background: none;
        border: none;
    }
    .Header {
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 5rem;
        padding-bottom: 2.5rem;
        border-bottom: 1px solid #efefef;
    }
    .Header > .Nickname {
        font-size: 3rem;
    }
    .PluginItem {
        margin-top: 10px;
        padding: 10px;
        border: 1px solid #efefef;
        border-radius: 10px;
    }
    * {
        font-family: "HakgyoansimWoojuR", "Noto Color Emoji";
    }
    .InputBox {
        align-items: center;
        border-radius: 10px;
        border: 1px solid #efefef;
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
</style>
