/**
 * 게시글 로더
 * 마크다운 파일을 로드하고 HTML로 변환하여 표시
 */

// 게시글 로더 클래스
class PostLoader {
    constructor() {
        this.postContent = document.getElementById('post-content');
        this.init();
    }

    init() {
        // URL에서 게시글 파일명 추출
        const urlParams = new URLSearchParams(window.location.search);
        const fileName = urlParams.get('file');

        if (!fileName) {
            this.showError('게시글 파일을 찾을 수 없습니다.');
            return;
        }

        // 게시글 로드
        this.loadPost(fileName);
    }

    // 마크다운 파일 로드
    async loadPost(fileName) {
        try {
            const response = await fetch(`pages/${fileName}`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const markdown = await response.text();

            // 마크다운을 HTML로 변환
            const html = this.parseMarkdown(markdown);

            // 게시글 표시
            this.displayPost(html, markdown);

            // Giscus 댓글 로드
            this.loadGiscus(fileName);

            console.log(`📄 게시글 로드 완료: ${fileName}`);

        } catch (error) {
            console.error('게시글 로드 실패:', error);
            this.showError('게시글을 불러오는 중 오류가 발생했습니다.');
        }
    }

    // 마크다운 파싱 및 HTML 변환
    parseMarkdown(markdown) {
        // Front Matter 파싱
        const frontMatterMatch = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

        let frontMatter = {};
        let content = markdown;

        if (frontMatterMatch) {
            const frontMatterText = frontMatterMatch[1];
            content = frontMatterMatch[2];

            // Front Matter 라인 파싱
            const lines = frontMatterText.split('\n');
            lines.forEach(line => {
                const colonIndex = line.indexOf(':');
                if (colonIndex > 0) {
                    const key = line.substring(0, colonIndex).trim();
                    let value = line.substring(colonIndex + 1).trim();

                    // 따옴표 제거
                    if ((value.startsWith('"') && value.endsWith('"')) ||
                        (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.slice(1, -1);
                    }

                    // 배열 파싱 (tags)
                    if (key === 'tags' && value.startsWith('[') && value.endsWith(']')) {
                        try {
                            value = JSON.parse(value);
                        } catch {
                            value = value
                                .slice(1, -1)
                                .split(',')
                                .map(tag => tag.trim().replace(/^['"]|['"]$/g, ''));
                        }
                    }

                    frontMatter[key] = value;
                }
            });
        }

        // marked.js로 마크다운 → HTML 변환
        const htmlContent = marked.parse(content);

        // 제목과 메타데이터로 HTML 구성
        const title = frontMatter.title || '제목 없음';
        const date = frontMatter.date ? new Date(frontMatter.date).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) : '';
        const tags = frontMatter.tags && Array.isArray(frontMatter.tags)
            ? frontMatter.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')
            : '';
        const category = frontMatter.category || '';

        return `
            <header class="post-header">
                <h1 class="post-title-large">${this.escapeHtml(title)}</h1>
                <div class="post-meta-large">
                    ${date ? `<span>${date}</span>` : ''}
                    ${category ? `<span>${this.escapeHtml(category)}</span>` : ''}
                </div>
                ${tags ? `<div class="post-tags">${tags}</div>` : ''}
            </header>
            <div class="post-body">
                ${htmlContent}
            </div>
        `;
    }

    // HTML 이스케이프
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 게시글 표시
    displayPost(html, originalMarkdown) {
        if (!this.postContent) return;

        this.postContent.innerHTML = html;

        // 코드 하이라이팅 적용
        if (window.Prism) {
            setTimeout(() => {
                Prism.highlightAll();
            }, 100);
        }

        // 원본 마크다운을 data 속성에 저장 (필요시 사용)
        this.postContent.setAttribute('data-markdown', originalMarkdown);
    }

    // Giscus 댓글 시스템 로드
    loadGiscus(fileName) {
        const container = document.getElementById('giscus-container');
        if (!container) return;

        // 기존 Giscus 제거
        container.innerHTML = '';

        // Giscus 스크립트 생성
        const script = document.createElement('script');
        script.src = 'https://giscus.app/client.js';
        script.async = true;

        // Giscus 설정 (사용자 요청에 맞춰 구성)
        script.setAttribute('data-repo', 'dldxo300/dldxo300.github.io');
        script.setAttribute('data-repo-id', 'R_kgDOQLHJgw');
        script.setAttribute('data-category', 'General');
        script.setAttribute('data-category-id', 'DIC_kwDOQLHJg84CxMa6');
        script.setAttribute('data-mapping', 'pathname');
        script.setAttribute('data-strict', '0');
        script.setAttribute('data-reactions-enabled', '1');
        script.setAttribute('data-emit-metadata', '0');
        script.setAttribute('data-input-position', 'bottom');
        script.setAttribute('data-theme', 'preferred_color_scheme');
        script.setAttribute('data-lang', 'ko');
        script.setAttribute('crossorigin', 'anonymous');

        container.appendChild(script);

        console.log('💬 Giscus 댓글 시스템 초기화 완료', {
            pathname: window.location.pathname,
            fileName
        });
    }

    // 에러 메시지 표시
    showError(message) {
        if (!this.postContent) return;

        this.postContent.innerHTML = `
            <div class="error-message" style="
                text-align: center;
                padding: 3rem;
                color: var(--text-secondary);
                background-color: var(--card-bg);
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
            ">
                <p>⚠️ ${message}</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">
                    <a href="index.html" style="color: var(--accent-color);">메인 페이지로 돌아가기</a>
                </p>
            </div>
        `;
    }
}

// DOM 로드 완료 시 게시글 로더 초기화
document.addEventListener('DOMContentLoaded', () => {
    new PostLoader();
});

// 콘솔 로그 (개발용)
console.log('📖 Post loader loaded');
