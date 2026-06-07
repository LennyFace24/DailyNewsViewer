<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { X, Plus, Tag } from 'lucide-svelte';
  import { settings } from '$lib/stores/settings';

  export let open = false;
  export let selectedTags: string[] = [];

  const dispatch = createEventDispatcher();

  let isClosing = false;
  let newTag = '';

  // 预设标签
  const presetTags = [
    'AI', '机器学习', '深度学习', 'Web开发', '前端', '后端',
    '移动开发', '游戏开发', '安全', '数据库', 'DevOps', '开源',
    '创业', '职场', '学术', '工具', '教程', '新闻'
  ];

  function close() {
    isClosing = true;
    setTimeout(() => {
      open = false;
      isClosing = false;
    }, 200);
  }

  function toggleTag(tag: string) {
    if (selectedTags.includes(tag)) {
      selectedTags = selectedTags.filter(t => t !== tag);
    } else {
      selectedTags = [...selectedTags, tag];
    }
    dispatch('change', { tags: selectedTags });
  }

  function addCustomTag() {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      selectedTags = [...selectedTags, newTag.trim()];
      newTag = '';
      dispatch('change', { tags: selectedTags });
    }
  }

  function removeTag(tag: string) {
    selectedTags = selectedTags.filter(t => t !== tag);
    dispatch('change', { tags: selectedTags });
  }
</script>

{#if open}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal-overlay" class:fade-out={isClosing} on:click={close}>
    <div class="modal-box glass-card" class:scale-out={isClosing} on:click|stopPropagation>
      <div class="modal-header">
        <h3>标签管理</h3>
        <button class="close-btn" on:click={close}>
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- 已选标签 -->
      {#if selectedTags.length > 0}
        <div class="selected-tags">
          <div class="tags-label">已选标签</div>
          <div class="tags-list">
            {#each selectedTags as tag}
              <span class="tag-item selected">
                {tag}
                <button class="tag-remove" on:click={() => removeTag(tag)}>
                  <X class="w-3 h-3" />
                </button>
              </span>
            {/each}
          </div>
        </div>
      {/if}

      <!-- 预设标签 -->
      <div class="preset-tags">
        <div class="tags-label">推荐标签</div>
        <div class="tags-list">
          {#each presetTags as tag}
            <button
              class="tag-item {selectedTags.includes(tag) ? 'selected' : ''}"
              on:click={() => toggleTag(tag)}
            >
              {tag}
            </button>
          {/each}
        </div>
      </div>

      <!-- 自定义标签 -->
      <div class="custom-tag">
        <div class="tags-label">自定义标签</div>
        <div class="custom-tag-input">
          <input
            bind:value={newTag}
            placeholder="输入标签名称"
            class="tag-input"
            on:keydown={(e) => e.key === 'Enter' && addCustomTag()}
          />
          <button class="add-btn" on:click={addCustomTag} disabled={!newTag.trim()}>
            <Plus class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 200;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    animation: fadeIn 0.2s ease-out;
  }

  .modal-box {
    width: 100%;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    border-radius: 20px 20px 0 0;
    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .fade-out {
    animation: fadeOut 0.2s ease-out forwards;
  }

  .scale-out {
    animation: slideDown 0.2s ease-out forwards;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 20px 0;
    margin-bottom: 16px;
  }

  .modal-header h3 {
    font-size: 18px;
    font-weight: 600;
  }

  .close-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.5);
    background: transparent;
    border: none;
    cursor: pointer;
  }
  .close-btn:active {
    background: rgba(255, 255, 255, 0.1);
  }

  .selected-tags,
  .preset-tags,
  .custom-tag {
    padding: 0 20px 16px;
  }

  .tags-label {
    font-size: 12px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.4);
    margin-bottom: 10px;
  }

  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .tag-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 14px;
    border-radius: 100px;
    font-size: 13px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    transition: all 0.2s;
  }
  .tag-item:active {
    background: rgba(255, 255, 255, 0.1);
  }
  .tag-item.selected {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    color: white;
  }

  .tag-remove {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    cursor: pointer;
    transition: background 0.2s;
  }
  .tag-remove:active {
    background: rgba(255, 255, 255, 0.3);
  }

  .custom-tag-input {
    display: flex;
    gap: 8px;
  }

  .tag-input {
    flex: 1;
    padding: 10px 14px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 14px;
    outline: none;
  }
  .tag-input:focus {
    border-color: rgba(255, 255, 255, 0.2);
  }
  .tag-input::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  .add-btn {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    cursor: pointer;
    transition: all 0.2s;
  }
  .add-btn:active {
    background: rgba(255, 255, 255, 0.2);
  }
  .add-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  @keyframes slideDown {
    from { transform: translateY(0); }
    to { transform: translateY(100%); }
  }
</style>
