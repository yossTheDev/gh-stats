<script lang="ts">
  /* State */
  let repo_data = null;
  let total_downloads: number = 0;
  let releases = null;
  let loading: boolean = false;
  let repo: string = "";
  let owner: string = "";
  let status: number = 200;
  let recent = JSON.parse(localStorage.getItem("recent_test")) || [
    "yossthedev/yala",
  ];

  /* Actions */
  const getData = async () => {
    loading = true;
    repo_data = null;

    try {
      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/releases`
      );

      repo_data = await (
        await fetch(`https://api.github.com/repos/${owner}/${repo}`)
      ).json();

      status = res.status;
      releases = await res.json();

      total_downloads = getTotalRepoDownloads(releases);

      if (!recent.find((item) => item === owner + "/" + repo))
        recent = [...recent, owner + "/" + repo];

      localStorage.setItem("recent_test", JSON.stringify(recent));
    } finally {
      loading = false;
    }
  };

  const getTotalDownloads = (data: any) => {
    let count = 0;
    data.forEach((asset) => (count += asset.download_count));

    return count;
  };

  const getTotalRepoDownloads = (data: any) => {
    let count = 0;
    data.forEach((release: any) => {
      release.assets.forEach((item: any) => (count += item.download_count));
    });

    return count;
  };

  const cleanRecent = () => {
    recent = [];
    localStorage.setItem("recent_test", JSON.stringify(recent));
  };
</script>

<main
  class="flex flex-col max-h-full flex-auto h-screen w-full overflow-y-scroll bg-base-100 text-base-content"
>
  <!-- Nav Bar -->
  <div class="navbar bg-base-100">
    <p
      class="btn btn-ghost mx-auto md:mr-auto normal-case text-xl text-gray-600 dark:text-white"
    >
      GitHub Downloads Counter
    </p>
  </div>

  <!-- Inputs -->
  <div class="md:flex-row flex flex-col h-fit my-auto gap-3 w-fit mx-auto p-1">
    <div class="form-control w-full max-w-xs">
      <label class="label">
        <span class="label-text">GitHub Profile/Organization</span>
      </label>
      <input
        bind:value={owner}
        type="text"
        placeholder="Owner"
        class="input w-full max-w-xs mx-auto input-bordered"
      />
    </div>

    <div class="flex gap-3">
      <div class="form-control w-full max-w-xs">
        <label class="label">
          <span class="label-text">Repository name</span>
        </label>
        <input
          bind:value={repo}
          type="text"
          placeholder="Repo"
          class="input w-full max-w-xs mx-auto input-bordered"
        />
      </div>

      <button on:click={getData} class="btn btn-circle btn-accent mt-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon icon-tabler icon-tabler-search"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
          <path d="M21 21l-6 -6" />
        </svg>
      </button>
    </div>
  </div>

  <!-- Content -->
  <div class="flex flex-auto flex-col mt-2 md:p-4 p-3">
    <!-- Recent -->
    {#if recent.length > 0}
      <div
        class="bg-base-300/70 rounded-2xl shadow-inner py-2 px-3 md:mx-0 mx-2"
      >
        <p class="font-bold">Recents</p>
        <div class="flex flex-row gap-2 p-1 mt-2 overflow-scroll">
          {#each recent as item}
            <button
              on:click={() => {
                owner = item.split("/")[0];
                repo = item.split("/")[1];
                getData();
              }}
              class="btn btn-sm btn-ghost border-none bg-base-200 flex-row w-fit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-brand-github my-auto"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"
                />
              </svg>

              <p class="my-auto">{item}</p>
            </button>
          {/each}

          <button on:click={cleanRecent} class="btn btn-xs ml-auto">
            clean
          </button>
        </div>
      </div>
    {/if}

    <!-- Repo Info -->
    {#if repo_data}
      <div
        class="flex md:flex-row flex-col min-w-full mx-auto gap-2 my-4 md:p-6 p-4"
      >
        <div
          class="flex flex-col w-full bg-base-200 rounded-2xl marker:card p-4"
        >
          <div class="flex flex-row gap-1">
            <img
              class="mask-circle mask h-20 w-20"
              alt="avatar"
              src={repo_data.owner.avatar_url}
            />
            <p class="font-bold my-auto">{repo_data.full_name}</p>
          </div>

          <p>{repo_data.description}</p>

          <div class="flex gap-2 mt-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-star my-auto"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"
              />
            </svg>

            <p class="my-auto">{repo_data.stargazers_count}</p>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-arrow-bear-right-2 my-auto"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M15 3h5v5" />
              <path d="M20 3l-7.536 7.536a5 5 0 0 0 -1.464 3.534v6.93" />
              <path d="M4 5l4.5 4.5" />
            </svg>

            <p class="my-auto">{repo_data.forks_count}</p>
          </div>
        </div>

        <div class="flex flex-col bg-base-200 rounded-2xl card p-4">
          <div class="my-auto flex gap-2 flex-col">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-circle-arrow-down"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
              <path d="M8 12l4 4" />
              <path d="M12 8v8" />
              <path d="M16 12l-4 4" />
            </svg>

            <p class="my-auto">Total Downloads: {total_downloads}</p>
          </div>
        </div>
      </div>
    {/if}

    <!-- Releases -->
    {#if releases?.length > 0 && !loading}
      <div class="flex flex-col gap-2 md:p-6 p-4">
        <div class="flex flex-row gap-2 mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon icon-tabler icon-tabler-packages my-auto"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M7 16.5l-5 -3l5 -3l5 3v5.5l-5 3z" />
            <path d="M2 13.5v5.5l5 3" />
            <path d="M7 16.545l5 -3.03" />
            <path d="M17 16.5l-5 -3l5 -3l5 3v5.5l-5 3z" />
            <path d="M12 19l5 3" />
            <path d="M17 16.5l5 -3" />
            <path d="M12 13.5v-5.5l-5 -3l5 -3l5 3v5.5" />
            <path d="M7 5.03v5.455" />
            <path d="M12 8l5 -3" />
          </svg>
          <p class="my-auto select-none">Releases</p>
        </div>
        {#each releases as item, index}
          <div
            class={`card flex flex-col select-none ${
              index === 0 ? "bg-blue-700 shadow text-white" : "bg-base-200"
            } p-4`}
          >
            <p class="card-title mb-2">{item.tag_name}</p>
            <div class="flex gap-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-user my-auto"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
              </svg>
              <p class="my-auto">Release Author: {item.author.login}</p>
            </div>

            <div class="flex gap-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-clock my-auto"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                <path d="M12 7v5l3 3" />
              </svg>
              <p class="my-auto">
                Published on: {new Date(item.published_at).toLocaleDateString()}
              </p>
            </div>

            <div class="flex gap-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-file-download"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                <path
                  d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"
                />
                <path d="M12 17v-6" />
                <path d="M9.5 14.5l2.5 2.5l2.5 -2.5" />
              </svg>
              <p class="my-auto">
                Total Downloads {getTotalDownloads(item.assets)}
              </p>
            </div>

            <p class="text-xs my-2 mt-2 font-bold">
              Assets ({item.assets.length})
            </p>
            {#each item.assets as asset}
              <div class="flex gap-2">
                <svg
                  class="my-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" />
                  <path d="M12 12l8 -4.5" />
                  <path d="M12 12l0 9" />
                  <path d="M12 12l-8 -4.5" />
                  <path d="M16 5.25l-8 4.5" />
                </svg>

                <a href={asset.browser_download_url} class="text-xs link"
                  >{asset.name}</a
                >

                <div class="flex gap-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-file-download"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                    <path
                      d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"
                    />
                    <path d="M12 17v-6" />
                    <path d="M9.5 14.5l2.5 2.5l2.5 -2.5" />
                  </svg>
                  <p class="text-xs">{asset.download_count}</p>
                </div>
              </div>
            {/each}
          </div>
        {/each}
      </div>
    {:else if !loading && status === 200}
      <p class="my-auto mx-auto">Nothing to see here</p>
    {/if}

    <!-- Loading -->
    {#if loading}
      <span class="loading loading-spinner loading-lg my-auto mx-auto" />
    {/if}

    {#if status === 404}
      <p class="my-auto mx-auto">Not Found</p>
    {/if}

    {#if status === 403}
      <p class="my-auto mx-auto">Rate limit exceeded. Try again later</p>
    {/if}
  </div>

  <!-- Footer -->
  <span class="mx-auto text-xs mt-2"
    >Made with 🧡 Svelte by <a href="https://github.com/yossthedev/"
      >@yossthedev</a
    ></span
  >
  <a class="mx-auto text-xs mb-2" href="https://github.com/yossthedev/gh-stats"
    >Source Code</a
  >
</main>
