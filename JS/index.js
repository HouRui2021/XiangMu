// AJAX获取数据的函数
const getData = function (str) {
    return new Promise(res => {
        let xhr = new XMLHttpRequest;
        xhr.open('get', str);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                res(JSON.parse(xhr.responseText));
            }
        }
        xhr.send();
    })
};

// 轮播图板块
(function banner() {

    let bannerLeft = document.querySelector('.bannerLeft');
    let lis = document.querySelectorAll('.bannerLeftList li');
    let banner_advs = document.querySelectorAll('.banner_adv');
    // let banner = document.querySelector('.banner');
    let floatBoxs;


    // 获取轮播图侧边栏的数据并操作--------------------------------
    const getsidebar_data = function () {
        return getData("./float_box.json");
    }
    getsidebar_data().then(data => {
        render_sidebar(data);
        floatBoxs = document.querySelectorAll('.floatBox')
    })
    // 渲染轮播图侧边栏浮块的子项目内容
    const render_detail_content = function (data = []) {
        let str = '';
        data.forEach(item => {
            let arr = item.split('url:');
            str += `<a href="${arr[1]}">${arr[0]}</a>`
        })
        return str;
    }
    // 渲染轮播图侧边栏的函数
    const render_sidebar = function (data = []) {
        data.forEach(item => {
            let str = '';
            let floatBox = document.createElement('div');
            floatBox.classList.add('floatBox');
            floatBox.setAttribute('index', item.id)
            item.text.forEach(item => {
                let { title, content } = item;
                str += `<div class="detail_box">
                            <h2 class="detail_title">
                                <a href="#">${title}</a>
                                <a href="#">更多<i class="iconfont icon-jiantou"></i></a>
                            </h2>
                            <div class="detail_content">
                               ${render_detail_content(content)}
                            </div>
                        </div>`
            })
            floatBox.innerHTML = str;
            bannerLeft.appendChild(floatBox);
        })
    }
    //给每一个li绑定移入事件，让浮块出现
    lis.forEach((item, index) => {
        item.onmouseenter = function () {
            floatBoxs.forEach(item => {
                item.classList.remove('active');
            })
            floatBoxs[index].classList.add('active');
        }
    })
    // 移出侧边栏浮块消失
    bannerLeft.onmouseleave = function () {
        floatBoxs.forEach(item => {
            item.classList.remove('active');
        })
    }


    // 获取和操作banner区域的广告图片的数据-----------------------
    const getbanner_adv_data = function () {
        return getData("./banner_adv.json")
    }
    getbanner_adv_data().then((data = []) => {
        data.forEach((item, index) => {
            let { bg, url } = item;
            banner_advs[index].style.backgroundImage = `url(${bg})`;
            banner_advs[index].href = url;
        })
    })

    // banner区域的轮播图(封装插件完成)---------------------------
    Public.rotation_op('./banner_rotation.json')



})();


// 电影推荐板块
(function () {
    let movit_content = document.querySelectorAll('.movit_content')
    let hot_move_box = document.querySelector('.hot .move_box');
    let prepare_move_box = document.querySelector('.prepare .move_box');
    let left_arrow = document.querySelectorAll('.movit_content .left_arrow');
    let right_arrow = document.querySelectorAll('.movit_content .right_arrow');
    let item_boxs = document.querySelectorAll('.movie_box .movit_classify .item_box');
    let hot_flag = false;
    let prepare_flag = false;

    // 加载热门电影
    const hot = function () {
        // 获取到热映内容的数据
        getData("./hot_movie.json").then((data = []) => {
            render_hot_movie(data);
        })
        // 渲染热映电影内容的函数
        const render_hot_movie = function (data = []) {
            let str1 = '';
            data.forEach(item => {
                let { pic, score, name, id, href } = item;
                str1 += `<li>
                        <a href="${href}">
                            <img src="${pic}" alt="">
                            <img class="${score >= 9 ? "block" : ""}" src="//s0.meituan.net/bs/fe-web-meituan/25e6614/img/imax.png" alt="">
                        </a>
                        <div class="move_box_introduce">
                            <p>观众评<span>${score}</span></p>
                            <p>${name}</p>
                            <span>购票</span>
                        </div>
                    </li>`
            })
            hot_move_box.innerHTML = str1;
        }
    }
    // 加载即将上映的电影
    const prepare = function () {
        // 获取到即将上映电影内容的数据
        getData("./prepare_move.json").then((data = []) => {
            render_prepare_movie(data);
        })

        // 渲染即将上映电影内容的函数
        const render_prepare_movie = function (data = []) {
            let str1 = '';
            data.forEach(item => {
                let { pic, person, name, id, href } = item;
                str1 += ` <li>
                        <a href="${href}">
                            <img src="${pic}" alt="">
                            <img class="${person >= 100000 ? 'block' : ''}" src="//s0.meituan.net/bs/fe-web-meituan/25e6614/img/imax.png" alt="">
                        </a>
                        <div class="move_box_introduce">
                            <p><span>${person}</span>人想看</p>
                            <p>${name}</p>
                            <span>预售</span>
                        </div>
                    </li>`
            })
            prepare_move_box.innerHTML = str1;
        }
    }

    // 上来先加载热门电影内容
    hot();
    prepare();


    // 给推荐选项绑定鼠标滑过事件，加载对应内容
    item_boxs[0].onmouseenter = function () {
        item_boxs[1].classList.remove('active')
        item_boxs[0].classList.add('active');
        movit_content[1].style.display = 'none';
        movit_content[0].style.display = 'block';
    }
    item_boxs[1].onmouseenter = function () {
        item_boxs[0].classList.remove('active')
        item_boxs[1].classList.add('active');
        movit_content[0].style.display = 'none';
        movit_content[1].style.display = 'block';
    }


    // 给左右箭头绑定事件
    // hot_move_box.index = false;
    right_arrow[0].onclick = function () {
        if (hot_flag) return
        hot_move_box.style.transition = 'all 0.6s';
        hot_move_box.style.transform = 'translateX(-1165px)';
        hot_flag = true;
    }
    left_arrow[0].onclick = function () {
        if (!hot_flag) return
        hot_move_box.style.transition = 'all 0.6s';
        hot_move_box.style.transform = 'translateX(0)';
        hot_flag = false;
    }

    // prepare_move_box.index = false;
    right_arrow[1].onclick = function () {
        if (prepare_flag) return
        prepare_move_box.style.transition = 'all 0.6s';
        prepare_move_box.style.transform = 'translateX(-1165px)';
        prepare_flag = true;
    }
    left_arrow[1].onclick = function () {
        if (!prepare_flag) return
        prepare_move_box.style.transition = 'all 0.6s';
        prepare_move_box.style.transform = 'translateX(0)';
        prepare_flag = false;
    }
})();

// 民宿推荐板块
(function () {
    let hotel_box = document.querySelector('.hotel_box')
    let hotel_top = document.querySelector('.hotel_top');
    let flage_li = document.querySelector('.hotel_top li:nth-of-type(2)');
    let hotel_contentS;
    let item_boxS;
    // 获取推荐民宿板块的数据
    getData("./hotel.json").then((data = []) => {
        render_hotel(data);
        hotel_contentS = document.querySelectorAll('.hotel_content');
        item_boxS = document.querySelectorAll('.hotel_top .item_box');
        item_boxS.forEach((item, index) => {
            item.onmouseenter = function () {
                hotel_contentS.forEach(item => {
                    item.classList.remove('active');
                })
                item_boxS.forEach(item => {
                    item.classList.remove('active');
                })
                hotel_contentS[index].classList.add('active')
                item.classList.add('active')
            }
        })
    })
    // 渲染推荐民宿板块
    const render_hotel = function (data = []) {
        data.forEach((item, index) => {
            let { city, content } = item;
            let li = document.createElement('li');
            li.classList.add('item_box');
            li.innerHTML = `${city}`;
            hotel_top.insertBefore(li, flage_li);
            let div = document.createElement('div');
            div.classList.add('hotel_content');
            div.classList.add('clearfix');
            if (index == 0) {
                li.classList.add('active');
                div.classList.add('active');
            }
            content.forEach(item => {
                let { href, img_big, img_logo, title, structure, person, address, price } = item;
                div.innerHTML += `<a href="${href}">
                                    <div class="img_box">
                                        <img src="${img_big}"
                                            alt="">
                                        <img src="${img_logo}"
                                            alt="">
                                    </div>
                                    <div class="details">
                                        <p>${title}</p>
                                        <p>
                                            <span>${structure}</span>
                                            <span>${person}</span>&nbsp;|
                                            <span>${address}</span>
                                        </p>
                                        <p><span>￥</span>${price}</p>
                                    </div>
                                </a>`;
            })
            hotel_box.appendChild(div);
        })
    }






})();

// 猜你喜欢板块
(function () {
    let guess_list = document.querySelector('.guess_list');
    // 获取数据且渲染
    getData('./guess.json').then((data = []) => {
        renderGuessList(data);
    })



    // 渲染猜你喜欢板块的内容的函数
    const renderGuessList = function (data = []) {
        let str = '';
        data.forEach(item => {
            let { id, href, img, title, appraise, stars, location, price } = item;
            str += ` <a href="${href}" class="guess_list_item">
                        <div class="img_box">
                            <img src="${img}"
                            alt="">
                        </div>
                        <div class="infoBox">
                            <p>${title}</p>
                            <div class="stars">
                                <span class="star iconfont icon-xingxing ${1 <= stars ? 'active' : ''}"></span>
                                <span class="star iconfont icon-xingxing ${2 <= stars ? 'active' : ''}"></span>
                                <span class="star iconfont icon-xingxing ${3 <= stars ? 'active' : ''}"></span>
                                <span class="star iconfont icon-xingxing ${4 <= stars ? 'active' : ''}"></span>
                                <span class="star iconfont icon-xingxing ${5 <= stars ? 'active' : ''}"></span>
                                <span class="appraise">${appraise}个评价</span>
                            </div>
                            <p class="location">${location}</p>
                            <p class="price">￥<span>${price.toFixed(1)}</span><span>起</span></p>
                        </div>
                    </a>`
        })
        guess_list.innerHTML = str;
    }
})();

// 美团导航板块
(function () {
    let meitruanNav_list = document.querySelector('.meitruanNav_list');

    getData('./meitruanNav.json').then((data = []) => {
        renderMeitruanNav_list(data);
    })

    const renderLis = function (data = []) {
        let str = '';
        data.forEach((item, index) => {
            let { describe, href } = item;
            str += ` <a href="${href}">${describe}</a>`;
        })
        return str;
    }

    const renderMeitruanNav_list = function (data = []) {
        let str = '';
        data.forEach((item, index) => {
            let { title, list } = item;
            str += ` <div class="meitruanNav_list_item clearfix">
                        <h4 class="title">${title}</h4>
                        <div class="lis">
                            ${renderLis(list)}
                        </div>
                    </div>`;
        })
        meitruanNav_list.innerHTML = str;
    }

})()



