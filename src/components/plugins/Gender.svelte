<script lang="ts">
    import { pluginData } from '$lib/store';
    import { onMount } from 'svelte';

    let genderValue: string[] = [];
    const unsubscribe = pluginData.subscribe(data => {
        genderValue = data.genderValue;
    });

    onMount(() => {
        return unsubscribe;
    });

    const genderType = [
        "남성", "여성"
    ];

    const genderQueerType = [
        "트랜스매스큘린", "트랜스페미닌", "안드로진", "바이젠더", "데미젠더", "에이젠더", "젠더리스", "뉴트로이스", "트라이젠더", "폴리젠더", "팬젠더", "젠더플루이드", "젠더플럭스",
        "트랜스여성", "트랜스남성", "트랜스젠더", "논바이너리", "인터섹스"
    ];

    let toggleGenderQueer = false;

    const toggleGender = (gender: string) => {
        if (genderValue.includes(gender)) {
            pluginData.update(data => ({ ...data, genderValue: genderValue.filter(item => item !== gender) }));
        } else {
            pluginData.update(data => ({ ...data, genderValue: [...genderValue, gender] }));
        }
    };
</script>

<div>
    <span style="font-size: 1.5rem; display: block; padding: 10px 0px 10px 0px">성별</span>
    <div style="opacity: 0.5;">성 소수자이신 경우 더보기를 눌러 젠더퀴어 성별을 모두 확인할 수 있습니다.</div>
    <div class="genderItemWrapper">
        {#each genderType as Name}
            <button
                class="genderItem"
                class:selected={genderValue.includes(Name)}
                on:click={() => toggleGender(Name)}
            >
                {Name}
            </button>
        {/each}
    </div>
    <button class="toggleBtn" on:click={() => { toggleGenderQueer = !toggleGenderQueer; }}>
        {#if (toggleGenderQueer)}
            덜 보기
        {:else}
            더 보기
        {/if}
    </button>
    {#if (toggleGenderQueer)}
        <div class="genderItemWrapper">
            {#each genderQueerType as Name}
                <button
                    class="genderItem"
                    class:selected={genderValue.includes(Name)}
                    on:click={() => toggleGender(Name)}
                >
                    {Name}
                </button>
            {/each}
        </div>
    {/if}
</div>

<style>
    .toggleBtn {
        padding: 5px;
        background: none;
        border: none;
    }
    .genderItemWrapper {
        display: flex;
        gap: 10px;
        padding: 10px 0px;
        flex-wrap: wrap;
    }
    .genderItem.selected {
        background: white;
    }
    .genderItem {
        white-space: nowrap;
        min-width: fit-content;
        border-radius: 10px;
        background: #efefef;
        border: 1px solid #efefef;
        user-select: none;
        transition: 0.3s background;
        padding: 10px;
        cursor: pointer;
        margin-bottom: 10px;
    }
</style>
