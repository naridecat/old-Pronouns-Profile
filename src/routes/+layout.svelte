<script>
    import Navbar from "../components/Navbar.svelte";
</script>
<Navbar/>
<div class="contentWrapper" style="padding: 60px 20px; 20px 20px;">
    <slot/>
</div>

<style>

@font-face {
        font-family: 'Noto Color Emoji';
        src: url(https://raw.githack.com/googlefonts/noto-emoji/main/fonts/NotoColorEmoji.ttf);
    }
    .contentWrapper {
        max-width: 1080px;
        margin: auto;
        padding: 20px;
    }
</style>