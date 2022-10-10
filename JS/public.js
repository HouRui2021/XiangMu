const Public = (function () {

    // 轮播图插件
    const rotation_op = function (url) {
        let data = null;
        let Rotation_box = document.querySelector('.Rotation_box');
        let img_box = document.querySelector('.Rotation_box>.img_box');
        let right_arrow = document.querySelector('.right_arrow');
        let left_arrow = document.querySelector('.left_arrow');
        let dot_box = document.querySelector('.dot_box');
        let as;
        let dots;
        let index = 0;
        let max = 0;
        let time = null;

        // 根据promise获取数据
        const getData = function () {
            return new Promise((res => {
                let xhr = new XMLHttpRequest;
                xhr.open('get', url);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        data = JSON.parse(xhr.responseText)
                        res(data);
                    }
                }
                xhr.send();
            }))
        }


        // 获取到数据需要做的事情
        getData().then(value => {
            max = value.length - 1;
            render(value);
            as = document.querySelectorAll('.img_box>a');
            dots = document.querySelectorAll('.dot_box>span');
            move();
            dotsClick();
        })

        // 渲染轮播图的函数
        const render = function (data = []) {
            let str1 = '', str2 = '';
            data.forEach((item, index) => {
                let { pic,title } = item
                str1 += `<a href="#" class="${index==0?"active":""}">
                            <img src="${pic}" alt="${title}">
                        </a>`;
                str2 += `<span class='${index == 0 ? 'current' : ''}'></span>`
            })
            img_box.innerHTML = str1;
            dot_box.innerHTML = str2;
        }

        // 给对应索引的图片盒子li添加上active类名,让对应的图片盒子显示的函数
        const changeLi = function (i) {
            as.forEach((item) => {
                item.classList.remove('active');
            })
            as[i].classList.add('active');
        }
        //  给对应索引的小圆点添加上current类名，让对应的小圆点高亮的函数
        const changeDot = function (n) {
            dots.forEach(item => {
                item.classList.remove('current');
            })
            dots[n].classList.add('current');
        }


        // 索引自加,让下一张的图片和小圆点显示和高亮的函数
        const next = function () {
            index++;
            if (index > max) {
                index = 0;
            }
            changeLi(index);
            changeDot(index);
        };


        // 索引自减,让下一张的图片和小圆点显示和高亮的函数
        const prev = function () {
            index--;
            if (index < 0) {
                index = max;
            }
            changeLi(index);
            changeDot(index);
        };

        // 让轮播图自动循环显示的函数
        const move = function () {
            time = setInterval(function () {
                next();
            }, 1800)
        };


        // 鼠标移入，轮播图停止的函数
        Rotation_box.onmouseenter = function () {
            clearInterval(time);
        };

        // 鼠标移出，轮播图开始的函数
        Rotation_box.onmouseleave = function () {
            move();
        }


        // 给右箭头绑定点击事件，点击让下一张图片显示
        right_arrow.onclick = function () {
            next();
        }

        // 给左箭头绑定点击事件，点击让上一张图片显示
        left_arrow.onclick = function () {
            prev();
        }


        // 给每个小圆点绑定点击事件，让小圆点对应的图片显示
        const dotsClick = function () {
            dots.forEach((item, key) => {
                item.onclick = function () {
                    index = key;
                    changeLi(index);
                    changeDot(index);
                }
            })
        }

    }


    return {
        rotation_op
    }
})()

