/**
 * 다크/라이트 모드 토글 기능
 * 사용자의 시스템 설정을 감지하고 로컬 스토리지에 저장
 */

// 테마 설정 및 적용
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme();

        this.init();
    }

    init() {
        // 초기 테마 적용
        this.applyTheme(this.currentTheme);

        // 토글 버튼 이벤트 리스너 추가
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // 시스템 테마 변경 감지
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // 사용자가 수동으로 설정하지 않은 경우에만 시스템 테마 따라감
            if (!this.getStoredTheme()) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    getStoredTheme() {
        try {
            return localStorage.getItem('theme');
        } catch (e) {
            return null;
        }
    }

    setStoredTheme(theme) {
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            // 로컬 스토리지 접근 실패 시 무시
        }
    }

    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    applyTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);

        // 토글 버튼 아이콘 업데이트
        if (this.themeToggle) {
            this.themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
            this.themeToggle.setAttribute('aria-label',
                theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'
            );
        }

        // Prism.js 테마 재적용 (코드 하이라이팅)
        if (window.Prism) {
            setTimeout(() => {
                Prism.highlightAll();
            }, 100);
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setStoredTheme(newTheme);
        this.applyTheme(newTheme);
    }
}

// DOM 로드 완료 시 테마 매니저 초기화
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});

// 콘솔 로그 (개발용)
console.log('🌙 Theme manager loaded');
