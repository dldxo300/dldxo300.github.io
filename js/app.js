/**
 * 메인 애플리케이션 로직
 * posts.json 로드 및 검색 기능 초기화
 */

// 애플리케이션 클래스
class BlogApp {
    constructor() {
        this.posts = [];
        this.init();
    }

    async init() {
        try {
            // posts.json 로드
            await this.loadPosts();

            // 검색 매니저 초기화
            initSearchManager(this.posts);

            console.log(`📚 블로그 앱 초기화 완료: ${this.posts.length}개의 게시글 로드됨`);
        } catch (error) {
            console.error('블로그 앱 초기화 실패:', error);
            this.showError('게시글을 불러오는 중 오류가 발생했습니다.');
        }
    }

    // posts.json 파일 로드
    async loadPosts() {
        try {
            const response = await fetch('posts.json');

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            this.posts = await response.json();

            // 데이터 검증
            if (!Array.isArray(this.posts)) {
                throw new Error('posts.json이 올바른 배열 형식이 아닙니다.');
            }

            // 각 게시글 데이터 검증 및 기본값 설정
            this.posts = this.posts.map(post => ({
                file: post.file || '',
                title: post.title || '제목 없음',
                date: post.date || new Date().toISOString().split('T')[0],
                tags: Array.isArray(post.tags) ? post.tags : [],
                category: post.category || '',
                description: post.description || '',
                excerpt: post.excerpt || ''
            }));

            // 날짜순 정렬 (최신순)
            this.posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        } catch (error) {
            console.error('posts.json 로드 실패:', error);

            // posts.json이 없는 경우 빈 배열로 초기화
            if (error.message.includes('404') || error.message.includes('Not Found')) {
                console.warn('posts.json 파일이 없습니다. 샘플 데이터를 사용합니다.');
                this.posts = this.getSamplePosts();
            } else {
                throw error;
            }
        }
    }

    // 샘플 게시글 데이터 (posts.json이 없을 때 사용)
    getSamplePosts() {
        return [
            {
                file: 'sample.md',
                title: '블로그에 오신 것을 환영합니다!',
                date: new Date().toISOString().split('T')[0],
                tags: ['블로그', '시작하기'],
                category: '일반',
                description: '나의 첫 번째 블로그 게시글입니다.',
                excerpt: '블로그를 시작하게 되어 기쁩니다. 이곳에서 다양한 주제에 대해 이야기해보겠습니다...'
            }
        ];
    }

    // 에러 메시지 표시
    showError(message) {
        const postsList = document.getElementById('posts-list');
        if (postsList) {
            postsList.innerHTML = `
                <div class="error-message" style="
                    text-align: center;
                    padding: 2rem;
                    color: var(--text-secondary);
                    background-color: var(--card-bg);
                    border: 1px solid var(--border-color);
                    border-radius: 0.5rem;
                ">
                    <p>⚠️ ${message}</p>
                    <p style="font-size: 0.9rem; margin-top: 0.5rem;">
                        잠시 후 다시 시도하거나 개발자에게 문의해주세요.
                    </p>
                </div>
            `;
        }
    }
}

// DOM 로드 완료 시 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    new BlogApp();
});

// 콘솔 로그 (개발용)
console.log('🚀 Blog app loaded');
