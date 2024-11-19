<script>
  import {goto} from '$app/navigation';
</script>

<style>
    .main-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    header, footer {
        padding: 1rem;
        text-align: center;
    }

    main {
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    footer {
        font-size: 0.875rem;
    }
</style>

<div class="main-container">
    <main>
        <div class="text-center hero-content">
            <div class="max-w-7xl">
                <h1 class="text-5xl font-bold">Welcome to ProofAnchor</h1>
                <p class="py-6">Securely store and retrieve proofs using Blockchain technology.</p>
                <button class="btn btn-outline btn-error mx-2" on:click={() => goto('/anchor-file')}>
                    Anchor Proof
                </button>
                <button class="btn btn-outline btn-info mx-2" on:click={() => goto('/verify-file')}>
                    Verify File
                </button>
            </div>
        </div>
    </main>

    <footer class="text-gray-600">
        &copy; 2024 ProofAnchor. All rights reserved.
    </footer>
</div>
