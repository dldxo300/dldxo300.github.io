/**
 * 검색 및 필터링 기능
 * 게시글 검색과 태그 필터링을 담당
 */

// 검색 및 필터링 클래스
class SearchManager {
    constructor(posts = []) {
        this.allPosts = posts;
        this.filteredPosts = [...posts];
        this.selectedTags = new Set();

        this.searchInput = document.getElementById('search-input');
        this.tagFilter = document.getElementById('tag-filter');
        this.postsList = document.getElementById('posts-list');

        this.init();
    }

    init() {
        // 검색 입력 이벤트
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.searchPosts(e.target.value);
            });
        }

        // 초기 태그 필터 생성
        this.createTagFilter();

        // 초기 게시글 렌더링
        this.renderPosts();
    }

    // 모든 게시글의 태그 수집
    getAllTags() {
        const tagSet = new Set();
        this.allPosts.forEach(post => {
            if (post.tags && Array.isArray(post.tags)) {
                post.tags.forEach(tag => tagSet.add(tag));
            }
        });
        return Array.from(tagSet).sort();
    }

    // 태그 필터 UI 생성
    createTagFilter() {
        if (!this.tagFilter) return;

        const tags = this.getAllTags();
        this.tagFilter.innerHTML = '';

        tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag';
            tagElement.textContent = tag;
            tagElement.addEventListener('click', () => this.toggleTagFilter(tag));
            this.tagFilter.appendChild(tagElement);
        });
    }

    // 태그 필터 토글
    toggleTagFilter(tag) {
        if (this.selectedTags.has(tag)) {
            this.selectedTags.delete(tag);
        } else {
            this.selectedTags.add(tag);
        }

        // UI 업데이트
        this.updateTagFilterUI();

        // 필터링 적용
        this.applyFilters();
    }

    // 태그 필터 UI 업데이트
    updateTagFilterUI() {
        const tagElements = this.tagFilter.querySelectorAll('.tag');
        tagElements.forEach(element => {
            const tag = element.textContent;
            if (this.selectedTags.has(tag)) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }
        });
    }

    // 검색어로 게시글 필터링
    searchPosts(query) {
        this.searchQuery = query.toLowerCase().trim();
        this.applyFilters();
    }

    // 모든 필터 적용
    applyFilters() {
        this.filteredPosts = this.allPosts.filter(post => {
            // 검색어 필터링
            const matchesSearch = this.matchesSearchQuery(post);

            // 태그 필터링
            const matchesTags = this.matchesTagFilter(post);

            return matchesSearch && matchesTags;
        });

        this.renderPosts();
    }

    // 검색어 일치 여부 확인
    matchesSearchQuery(post) {
        if (!this.searchQuery) return true;

        const searchFields = [
            post.title,
            post.excerpt,
            post.description,
            ...(post.tags || [])
        ].filter(Boolean);

        return searchFields.some(field =>
            field.toLowerCase().includes(this.searchQuery)
        );
    }

    // 태그 필터 일치 여부 확인
    matchesTagFilter(post) {
        if (this.selectedTags.size === 0) return true;

        if (!post.tags || !Array.isArray(post.tags)) return false;

        // 선택된 태그 중 하나라도 포함되면 true
        return Array.from(this.selectedTags).some(selectedTag =>
            post.tags.includes(selectedTag)
        );
    }

    // 게시글 목록 렌더링
    renderPosts() {
        if (!this.postsList) return;

        if (this.filteredPosts.length === 0) {
            this.postsList.innerHTML = `
                <div class="no-posts">
                    <p>검색 결과가 없습니다.</p>
                    <p>다른 검색어나 필터를 시도해보세요.</p>
                </div>
            `;
            return;
        }

        this.postsList.innerHTML = this.filteredPosts
            .map(post => this.createPostCard(post))
            .join('');
    }

    // 게시글 카드 HTML 생성
    createPostCard(post) {
        const date = new Date(post.date).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const tags = post.tags && post.tags.length > 0
            ? post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')
            : '';

        return `
            <a href="post.html?file=${encodeURIComponent(post.file)}" class="post-card">
                <h2 class="post-title">${this.escapeHtml(post.title)}</h2>
                <div class="post-meta">
                    <span>${date}</span>
                    ${post.category ? `<span>${post.category}</span>` : ''}
                </div>
                <p class="post-excerpt">${this.escapeHtml(post.excerpt)}</p>
                ${tags ? `<div class="post-tags">${tags}</div>` : ''}
            </a>
        `;
    }

    // HTML 이스케이프
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 게시글 데이터 업데이트
    updatePosts(posts) {
        this.allPosts = posts;
        this.filteredPosts = [...posts];
        this.selectedTags.clear();
        this.searchQuery = '';

        // 검색 입력 초기화
        if (this.searchInput) {
            this.searchInput.value = '';
        }

        // 태그 필터 재생성
        this.createTagFilter();

        // 게시글 재렌더링
        this.renderPosts();
    }
}

// 전역 검색 매니저 인스턴스
let searchManager = null;

// 검색 매니저 초기화 함수
function initSearchManager(posts = []) {
    searchManager = new SearchManager(posts);
}

// 검색 매니저 업데이트 함수
function updateSearchManager(posts) {
    if (searchManager) {
        searchManager.updatePosts(posts);
    } else {
        initSearchManager(posts);
    }
}

// 콘솔 로그 (개발용)
console.log('🔍 Search manager loaded');
