<script>
    import Fa from 'svelte-fa'
    import { faPen } from "@fortawesome/free-solid-svg-icons";

</script>
<style>
    nav {
        position: fixed;
        width: 100%;
        background: white;
        border-bottom: 1px solid #efefef;
    }
    .navbarWrapper {
        max-width: 1080px;
        margin: auto;
        padding: 20px;
        display: flex;
        justify-content: space-between;
    }
    .NavMenu > div.navItem {
        width: fit-content;
    }
    .brand > a {
        text-decoration: none;
        color: black;
    }
    .navItem > a {
        text-decoration: none;
        color: black;
    }
</style>

<nav>
    <div class="navbarWrapper">
        <div class="brand"><a href="/">Pronouns</a></div>
        <div class="NavMenu">
            <div class="navItem"><a href="/write"><Fa icon={faPen}/></a></div>
        </div>
    </div>
</nav>