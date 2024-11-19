<main>
  <div class="px-4 lg:px-20 mx-auto">

    <!-- navigation -->
    <div class="navbar bg-base-100">
      <div class="navbar-start">
        <a class="btn btn-ghost text-3xl" href="/">ProofAnchor</a>
      </div>
      <div class="navbar-end">
        {#if $accountsStore && $accountsStore[0] && $accountsStore[0].length > 0}
          <p><span class="font-bold">Account: </span>{$accountsStore[0].slice(0, 7)}...{$accountsStore[0].slice(-5)}</p>
        {:else}
          <a class="btn" on:click={connectMetaMask}>Connect MetaMask</a>
        {/if}
      </div>
    </div>

    {#if walletConnected}
      <!-- file selection & get proof -->
      <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold text-center my-20 md:my-12 lg:my-40">Verify file</h1>
      <div class="flex flex-col justify-center items-center space-y-4">
        <form id="upload-form" class="flex flex-col gap-4" enctype="multipart/form-data" on:submit|preventDefault={getProof}>
          <div class="flex flex-col items-center space-y-4">
            <label for="file" class="block text-sm font-medium">Which file's proof of existence would you like to verify?</label>
            <input type="file" id="file" class="file-input file-input-bordered w-full max-w-5xl" name="file" on:change={onChooseFile}><br><br>
            <button
              type="submit"
              class="btn btn-primary"
              class:loading={isVerifying}
              disabled={!$fileSelected}>
              {#if isVerifying}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              {:else}
                Verify File
              {/if}
          </div>
        </form>
      </div>

      {#if $fileSelected}
        {#if $resultMsg}
          <!-- result -->
          <div class="text-center my-8">
            {#if $resultMsg.type == 'success'}
              <p class="text-2xl font-bold">This file was verified at:</p>
            {/if}
            <p class="text-xl mt-2 font-bold">{$resultMsg.msg}</p>
          </div>
        {/if}
      {/if}

    {:else}
      <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-center my-40 md:my-12 lg:my-40">Connect your wallet to start verifying files...</h1>
    {/if}

  </div>
</main>

<script>
  import Web3 from "web3";
  import { onMount } from 'svelte';
  import { contractAddress, contractABI, fileEndpoint } from '$lib/config';
  import { accountsStore } from '../../stores.js';
  import { writable } from 'svelte/store';

  let web3;
  let contract;
  let accounts;
  let fileSelected = writable(false);
  let resultMsg = writable(null);
  $: walletConnected = $accountsStore && $accountsStore.length > 0;
  
  let isVerifying = false;

  onMount(async () => {
    if (typeof window.ethereum !== 'undefined') {
      web3 = new Web3(window.ethereum);
      contract = new web3.eth.Contract(contractABI, contractAddress);
      await checkMetaMaskConnection();
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    } else {
      console.error('MetaMask not installed');
      alert('MetaMask not installed. Please install MetaMask');
    }
  });

  async function checkMetaMaskConnection() {
    try {
      let accounts = await web3.eth.getAccounts();
      accountsStore.set(accounts);

      if (accounts.length > 0) {
        console.log('MetaMask connected. Account:', accounts[0]);
      }
      else {
        console.log('MetaMask not connected.');
      }
    } catch (error) {
      console.error('Error checking MetaMask connection:', error);
    }
  }

  async function connectMetaMask() {
    if (web3) {
      try {
        let accounts = await web3.eth.requestAccounts();
        accountsStore.set(accounts);
        console.log(`connected wallet address: ${accounts[0]}`);
      } catch (error) {
        console.error('User denied account access');
      }
    }
    else {
      alert('Metamask not installed')
    }
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length == 0) {
      console.log('MetaMask disconnected.')
      accountsStore.set(accounts);
    } else {
      console.log(`Account changed. Newly connected account: ${accounts[0]}`);
      accountsStore.set(accounts);
    }
  }

  async function getFileHash(event) {
    const formData = new FormData(event.target);

    try {
      const response = await fetch(fileEndpoint, {
        method: 'POST',
        body: formData,
      });

      const fileHash = await response.json();

      return fileHash;
    } catch (error) {
      alert('failed to get file hash from server');
      console.error('failed to get file hash from server', error);
    }
  }

  function convertUnixTimestamp(unixTimestamp) {
    console.log(unixTimestamp);
    const milliseconds = Number(unixTimestamp) * 1000;
    const dateObject = new Date(milliseconds);
    const humanReadableDate = dateObject.toLocaleString(); // converts to local date and time format

    return humanReadableDate;
  }

  async function getProof() {
    isVerifying = true;
    let { fileHash } = await getFileHash(event);
    console.log('received fileHash from API:', fileHash);
    if (!fileHash.startsWith('0x')) {
      fileHash = '0x' + fileHash;
    }

    try {
      const timestamp = await contract.methods.getProof(fileHash).call();
      console.log('received timestamp from Blockchain:', timestamp);
      resultMsg.set({ type: 'success', msg: convertUnixTimestamp(timestamp) });
    } catch (error) {
      resultMsg.set({ type: 'failure', msg: 'This file is not verified.' });
      console.error(error);
    }
    
    isVerifying = false;
  }

  function onChooseFile(event) {
    fileSelected.set(event.target.files.length > 0);
    resultMsg.set('');
  }
</script>

<style>
</style>
