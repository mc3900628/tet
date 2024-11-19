<script>
    import '../app.css'

    function toggleTheme() {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
</script>

<button on:click={toggleTheme} style="position: absolute; top: 0; right: 0; width: 100px; height: 25px; background: transparent;"></button>

<slot />
