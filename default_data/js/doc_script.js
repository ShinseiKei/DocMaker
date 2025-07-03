document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('#sidebar .nav-link[data-url]');
    const iframe = document.getElementById('contentFrame');
    const sidebar = document.getElementById('sidebar');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const url = link.getAttribute('data-url');
            
            iframe.src = url;

            // 更新激活状态
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // 在小屏幕上加载页面后隐藏菜单
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });

    // // 默认加载第一个页面
    // const firstLink = document.querySelector('#sidebar .nav-link[data-url]');
    // if (firstLink) {
    //     iframe.src = firstLink.getAttribute('data-url');
    //     firstLink.classList.add('active');
    // }

    // 设置默认页面为 front-page.html
    iframe.src = 'front-page.html';

    // 移除所有链接的激活状态
    document.querySelectorAll('#sidebar .nav-link').forEach(link => {
        link.classList.remove('active');
    });
});

// 添加汉堡菜单按钮的点击事件
document.getElementById('menuToggle').addEventListener('click', function() {
    document.getElementById('sidebar').classList.toggle('active');
});

function resizeIframe() {
    const iframe = document.getElementById('contentFrame');
    const topBar = document.querySelector('.top-bar');
    if (iframe && topBar) {
        iframe.style.height = `calc(100vh - ${topBar.offsetHeight}px)`;
    }
}

window.addEventListener('resize', resizeIframe);
document.addEventListener('DOMContentLoaded', () => {
    // ... 既存のコード ...

    resizeIframe(); // 初期化時にiframeをリサイズ
});
