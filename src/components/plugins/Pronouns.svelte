<script lang="ts">
    import { pluginData } from '$lib/store';
    let PronounsData: string = "";
    let selectedEmoji: string = "❤️";
    let isDropdownOpen: boolean = false;

    const emojis = ["❤️", "😉", "👍", "👎"];

    const addPronouns = () => {
        if (PronounsData.trim() && selectedEmoji) {
            pluginData.update(currentData => {
                return {
                    ...currentData,
                    Pronouns: [...currentData.Pronouns, { Name: PronounsData, Emoji: selectedEmoji }]
                };
            });

            PronounsData = "";
            selectedEmoji = "❤️"; // Reset to the default emoji
        }
    };

    const selectEmoji = (emoji: string) => {
        selectedEmoji = emoji;
        isDropdownOpen = false; // Close the dropdown after selection
    };

    // Toggle the dropdown open/close
    const toggleDropdown = () => {
        isDropdownOpen = !isDropdownOpen;
    };

    const removePronoun = (pronounToRemove:Pronoun) => {
        pluginData.update(currentData => {
            return {
                ...currentData,
                Pronouns: currentData.Pronouns.filter(pronoun => pronoun !== pronounToRemove)
            };
        });
    };



</script>

<div>
    <span style="font-size: 1.5rem; display: block; padding: 10px 0px 10px 0px">호칭</span>
    <div style="opacity:0.5; margin-bottom: 10px;">호칭을 입력하고, 이모지를 눌러 호칭에 대한 자신의 생각을 표현할 수 있습니다.<br>호칭을 두 번 눌러 삭제할 수 있습니다.</div>
    {#if ($pluginData.Pronouns.length > 0)}
    <div class="PronounsWrapper">
        {#each $pluginData.Pronouns as pronoun}
            <button class="PronounItem"
            on:dblclick={() => removePronoun(pronoun)}
            >{pronoun.Name} {pronoun.Emoji}</button>
        {/each}
    </div>
    {/if}
    <div class="InputBox">
        <input type="text" autocomplete="off" bind:value={PronounsData} placeholder="호칭 입력">
        <div class="Dropdown">
            <button class="EmojiButton" on:click={toggleDropdown}>
                {selectedEmoji}
            </button>
            {#if isDropdownOpen}
                <div class="DropdownMenu">
                    {#each emojis as emoji}
                        <button on:click={() => selectEmoji(emoji)}>{emoji}</button>
                    {/each}
                </div>
            {/if}
        </div>
        <button on:click={addPronouns} style="white-space: nowrap">추가</button>
    </div>
</div>

<style>
    .PronounsWrapper {
        display: flex;
        gap: 10px;
        padding: 10px 0px;
        flex-wrap: wrap; /* 여기에 wrap 속성을 추가합니다. */
    }
    input {
        background: none;
        
    }
    .PronounItem {
        white-space: nowrap;
        min-width: fit-content; /* width 대신 min-width를 사용하여 내용에 맞게 크기가 조정되도록 합니다. */
        border-radius: 10px;
        background: #efefef;
        border: 1px solid #efefef;
        user-select: none;
        font-family: 'Noto Color Emoji', 'HakgyoansimWoojuR';

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
    }

    .InputBox > .Dropdown {
        margin-right: 10px; /* Spacing between dropdown and button */
    }

    .EmojiButton {
        font-family: 'Noto Color Emoji';
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
        outline:none;
    }
    .DropdownMenu {
        position: absolute;
        min-width: 50px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        z-index: 2;
        background: #fff;
        border-radius: 5px;
        overflow: hidden; /* Ensures the rounded corners */
    }

    .DropdownMenu button {
        font-family: 'Noto Color Emoji';
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