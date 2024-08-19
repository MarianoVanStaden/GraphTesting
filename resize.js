// resize.js
window.addEventListener('resize', function () {
    for (let i = 1; i <= 7; i++) {
        echarts.getInstanceByDom(document.getElementById(`chart${i}`)).resize();
    }
});
