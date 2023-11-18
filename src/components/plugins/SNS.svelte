<script lang="ts">
    import { pluginData } from "$lib/store";
    import Fa from "svelte-fa";
    import {
        faDiscord,
        faFacebook,
        faInstagram,
        faTwitter,
    } from "@fortawesome/free-brands-svg-icons";

    let SNSData: string = "";
    let selectedSNS: string = "X";
    let SNSUrl: string = "";
    let isDropdownOpen: boolean = false;

    const snsOptions = ["X", "Discord", "Facebook", "Instagram"];

    const addSNS = () => {
        if (SNSData.trim() && selectedSNS) {
            pluginData.update((currentData) => {
                return {
                    ...currentData,
                    SNS: [
                        ...currentData.SNS,
                        { Name: SNSData, Type: selectedSNS, Url: SNSUrl },
                    ],
                };
            });

            SNSData = "";
            selectedSNS = "Twitter"; // Reset to the default SNS
        }
    };

    const selectSNS = (sns: string) => {
        switch (sns) {
            case "X":
                SNSUrl = `https://x.com/${SNSData}`;
                break;
            case "Facebook":
                SNSUrl = `https://facebook.com/${SNSData}`;
                break;
            case "Instagram":
                SNSUrl = `https://instagram.com/${SNSData}`;
                break;
            case "Discord":
                SNSUrl = `#`;
                break;
        }
        selectedSNS = sns;
        isDropdownOpen = false; // Close the dropdown after selection
    };

    // Toggle the dropdown open/close
    const toggleDropdown = () => {
        isDropdownOpen = !isDropdownOpen;
    };

    const removeSNS = (snsToRemove: any) => {
        pluginData.update((currentData) => {
            return {
                ...currentData,
                SNS: currentData.SNS.filter((sns) => sns !== snsToRemove),
            };
        });
    };
</script>

<div>
    <span style="font-size: 1.5rem; display: block; padding: 10px 0px 10px 0px"
        >SNS</span
    >
    <div style="opacity:0.5; margin-bottom: 10px;">자신의 SNS 프로필을 추가하여 연결할 수 있습니다.<br>SNS 소유 확인을 별로도 진행하지 않습니다. 유의해주시기 바랍니다.</div>
    {#if $pluginData.SNS.length > 0}
        <div class="SNSWrapper">
            {#each $pluginData.SNS as sns}
                <button on:dblclick={() => removeSNS(sns)} class="SNSItem">
                    {sns.Name}
                    {#if sns.Type == "Instagram"}
                        <Fa icon={faInstagram} />
                    {:else if sns.Type == "Discord"}
                        <Fa icon={faDiscord} />
                    {:else if sns.Type == "Facebook"}
                        <Fa icon={faFacebook} />
                    {:else if sns.Type == "Twitter"}
                        <Fa icon={faTwitter} />
                    {/if}
                </button>
            {/each}
        </div>
    {/if}
    <div class="InputBox">
        <input type="text" bind:value={SNSData} placeholder="SNS 계정 입력" />
        <div class="Dropdown">
            <button class="DropdownButton" on:click={toggleDropdown}>
                {selectedSNS}
            </button>
            {#if isDropdownOpen}
                <div class="DropdownMenu">
                    {#each snsOptions as sns}
                        <button on:click={() => selectSNS(sns)}>{sns}</button>
                    {/each}
                </div>
            {/if}
        </div>
        <button on:click={addSNS} style="white-space: nowrap">추가</button>
    </div>
</div>

<style>
    @font-face {
        font-family: "Noto Color Emoji";
        src: url(https://raw.githack.com/googlefonts/noto-emoji/main/fonts/NotoColorEmoji.ttf);
    }
    .SNSWrapper {
        display: flex;
        gap: 10px;
        padding: 10px 0px;
        flex-wrap: wrap; /* 여기에 wrap 속성을 추가합니다. */
    }
    .SNSItem {
        white-space: nowrap;
        min-width: fit-content; /* width 대신 min-width를 사용하여 내용에 맞게 크기가 조정되도록 합니다. */
        border-radius: 10px;
        background: #efefef;
        border: 1px solid #efefef;
        user-select: none;
        font-family: "HakgyoansimWoojuR";

        transition: 0.3s background;
        padding: 10px;
        cursor: pointer;
        margin-bottom: 10px; /* 추가된 줄에서 아이템 사이의 수직 간격을 위해 추가합니다. */
    }
    .InputBox {
        display: flex;
        align-items: center;
        border-radius: 10px;
        border: 1px solid #efefef;
    }

    .InputBox > input {
        border: none;
        flex-grow: 1; /* Input will fill the space */
        margin-right: 10px; /* Spacing between input and dropdown */
        padding: 10px;
        border-radius: 5px;
        font-size: 1rem;
        background: none;
    }
    button {
        border: none;
        background: none;
    }

    .InputBox > .Dropdown {
        margin-right: 10px; /* Spacing between dropdown and button */
    }

    .DropdownButton {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #fff;
        border: none;
        border-radius: 5px;
        padding: 10px;
        cursor: pointer;
        font-size: 1rem;
    }
    input {
        outline: none;
    }
    .DropdownMenu {
        position: absolute;
        min-width: 50px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        z-index: 2;
        background: #fff;
        border-radius: 5px;
        overflow: hidden; /* Ensures the rounded corners */
    }

    .DropdownMenu > button {
        font-family: "Noto Color Emoji";
        display: block;
        width: 100%;
        padding: 10px;
        border: none;
        background: none;
        text-align: center;
        font-size: 1rem;
        color: #333;
    }

    .DropdownMenu button:hover {
        background-color: #f0f0f0;
    }

    .InputBox > button {
        color: black;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        background: none;
        cursor: pointer;
        font-size: 1rem;
        text-transform: uppercase; /* Makes the button text uppercase */
    }
</style>
