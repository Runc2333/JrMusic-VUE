var sliderTimeout = 0;
var startX = 0;
var startY = 0;
var startBanner = 0;
var lengthX = 0;
//vue变量
var data = {
	searchDefault: {
		showKeyword: null,
		realKeyword: null
	},
	buttons: [{
		icon: "fa fa-calendar",
		label: "每日推荐",
		date: 1
	},{
		icon: "fad fa-list-music",
		label: "歌单",
		date: 0
	},{
		icon: "fad fa-list-ol",
		label: "排行榜",
		date: 0
	},{
		icon: "fad fa-broadcast-tower",
		label: "电台",
		date: 0
	},{
		icon: "fad fa-radio",
		label: "私人FM",
		date: 0
	}],
	recommendPlaylists: {
		title: "为你精挑细选",
		subtitle: "推荐歌单",
		playlists: [],
	},
	recommendSongs: {
		title: "一秒沦陷 为你精选",
		subtitle: "私人推荐",
		songs: [],
	},
	bottomBarItems: [{
		label: "发现",
		icon: "fal fa-radar",
		active: 1,
	},{
		label: "我的",
		icon: "fal fa-music",
		active: 0,
	},{
		label: "账号",
		icon: "fal fa-user",
		active: 0,
	}],
	sliderTransition: "all 0.3s ease",
	songsTransition: "all 0.3s ease",
	banners: [],
	nowBanner: 0,
	nowSongs: 0,
	preloader: 1,
}
//初始化vue
var app = new Vue({
	el: "#app",
	data: data,
	computed: {
		bannerTotalWidth: function(){
			return this.banners.length * window.screen.width + "px";
		},
		deviceWidth: function(){
			return window.screen.width + "px";
		},
		sliderLeft: function(){
			return (~(this.nowBanner * window.screen.width)) + "px";
		},
		songsTotalWidth: function(){
			return this.recommendSongs.songs.length * 345 + "px";
		},
		songsLeft: function(){
			return (~(this.nowSongs * 345)) + "px";
		},
	},
	methods: {
		scrollBannerStart: function(event){
			if(event.touches.length == 1){
				data.sliderTransition = "none";
				clearTimeout(sliderTimeout);
				startX = event.touches[0].screenX;
				startY = event.touches[0].screenY;
				startBanner = data.nowBanner;
			}
		},
		scrollBannerMove: function(event){
			if(event.touches.length == 1){
				clearTimeout(sliderTimeout);
				var nowX = event.touches[0].screenX;
				var nowY = event.touches[0].screenY;
				lengthX = startX - nowX;
				lengthY = startY - nowY;
				if(Math.abs(lengthX) > Math.abs(lengthY)){
					event.preventDefault();
					data.nowBanner = startBanner + lengthX / window.screen.width;
				}
			}else{
				data.sliderTransition = "all 0.3s ease";
				clearTimeout(sliderTimeout);
				data.nowBanner = Math.round(data.nowBanner);
				sliderTimeout = setTimeout(function(){
					initSlider();
				},5300);
			}
		},
		scrollBannerEnd: function(event){
			data.sliderTransition = "all 0.3s ease";
			clearTimeout(sliderTimeout);
			if(lengthX > 50){
				var tmp = Math.ceil(data.nowBanner);
			}else if(lengthX < -50){
				var tmp = Math.floor(data.nowBanner);
			}else{
				var tmp = Math.round(data.nowBanner);
			}
			if(tmp >= data.banners.length - 1){
				data.nowBanner = data.banners.length - 1;
			}else if(tmp <= 0){
				data.nowBanner = 0;
			}else{
				data.nowBanner = tmp;
			}
			for(i=0;i<data.banners.length;i++){
				data.banners[i].active = 0;
			}
			data.banners[data.nowBanner].active = 1;
			sliderTimeout = setTimeout(function(){
				initSlider();
			},5300);
			return true;
		},
		scrollSongsStart: function(event){
			if(event.touches.length == 1){
				data.songsTransition = "none";
				startX = event.touches[0].screenX;
				startY = event.touches[0].screenY;
				startSongs = data.nowSongs;
			}
		},
		scrollSongsMove: function(event){
			if(event.touches.length == 1){
				var nowX = event.touches[0].screenX;
				var nowY = event.touches[0].screenY;
				lengthX = startX - nowX;
				lengthY = startY - nowY;
				if(Math.abs(lengthX) > Math.abs(lengthY)){
					event.preventDefault();
					data.nowSongs = startSongs + lengthX / 345;
				}
			}else{
				data.songsTransition = "all 0.3s ease";
				data.nowSongs = Math.round(data.nowSongs);
			}
		},
		scrollSongsEnd: function(event){
			data.songsTransition = "all 0.3s ease";
			if(lengthX > 50){
				var tmp = Math.ceil(data.nowSongs);
			}else if(lengthX < -50){
				var tmp = Math.floor(data.nowSongs);
			}else{
				var tmp = Math.round(data.nowSongs);
			}
			if(tmp >= Math.ceil(data.recommendSongs.songs.length / 3) - 1){
				data.nowSongs = Math.ceil(data.recommendSongs.songs.length / 3) - 1;
			}else if(tmp <= 0){
				data.nowSongs = 0;
			}else{
				data.nowSongs = tmp;
			}
			return true;
		},
	},
	mounted: function(){
		sliderTimeout = setTimeout(function(){
			initSlider();
		},5300);
		$(".preloaderPreloader").css("opacity",0);
		setTimeout(function(){
			$(".preloader").css("opacity",0);
			setTimeout(function(){
				$(".preloader,.preloaderPreloader").remove();
			},800);
		},1000);
	},
	updated: function(){
		//do something
	}
});
//初始化Slider
function initSlider(){
	for(i=0;i<data.banners.length;i++){
		data.banners[i].active = 0;
	}
	if(data.nowBanner >= data.banners.length - 1){
		data.nowBanner = 0;
	}else{
		data.nowBanner++;
	}
	data.banners[data.nowBanner].active = 1;
	sliderTimeout = setTimeout(function(){
		initSlider();
	},5300);
}
//请求banner
$.ajax({
	url:"/api/api.php?resource=/banner",
	type:"GET",
	async:true,
	timeout:5000,
	success:function(banner){
		var bannerSrcRAW = JSON.parse(banner);
		for(i=0;i<bannerSrcRAW.banners.length;i++){
			data.banners.push({
				src: bannerSrcRAW.banners[i].imageUrl,
				typeTitle: bannerSrcRAW.banners[i].typeTitle,
				titleColor: bannerSrcRAW.banners[i].titleColor,
				active: i == 0 ? 1 : 0
			})
		}
	}
});
//请求默认搜索关键词
$.ajax({
	url:"/api/api.php?resource=/search/default",
	type:"GET",
	async:true,
	timeout:5000,
	success:function(searchDefaultRAW){
		var searchDefault = JSON.parse(searchDefaultRAW);
		data.searchDefault.showKeyword = searchDefault.data.showKeyword
		data.searchDefault.realKeyword = searchDefault.data.realKeyword
	}
});
//请求推荐歌单
$.ajax({
	url:"/api/api.php?resource=/recommend/resource",
	type:"GET",
	async:true,
	timeout:5000,
	success:function(playlists){
		var playlistsRAW = JSON.parse(playlists);
		for(i=0;i<playlistsRAW.recommend.length;i++){
			data.recommendPlaylists.playlists.push({
				id: playlistsRAW.recommend[i].id,
				cover: playlistsRAW.recommend[i].picUrl,
				playCount: formatNumber(playlistsRAW.recommend[i].playcount),
				title: playlistsRAW.recommend[i].name
			})
		}
	}
});
//请求推荐歌曲
$.ajax({
	url:"/api/api.php?resource=/recommend/songs",
	type:"GET",
	async:true,
	timeout:5000,
	success:function(songs){
		var songsRAW = JSON.parse(songs);
		for(i=0;i<songsRAW.recommend.length;i++){
			data.recommendSongs.songs.push({
				id: songsRAW.recommend[i].id,
				cover: songsRAW.recommend[i].album.picUrl,
				title: songsRAW.recommend[i].name,
				reason: songsRAW.recommend[i].reason,
				artist: songsRAW.recommend[i].artists[0].name,
				sq: songsRAW.recommend[i].privilege.maxbr == 999000 ? 1 : 0,
			})
		}
	}
});
//aplayer
const ap = new APlayer({
    container: document.getElementById('aplayer'),
    audio: [{
        name: '情非得已',
        artist: 'artist',
        url: 'http://m8.music.126.net/20200219051708/442700019aa422317254285ecf7e2504/ymusic/0fd6/4f65/43ed/a8772889f38dfcb91c04da915b301617.mp3',
        cover: 'https://p2.music.126.net/ZDUo6vF_5ykD6E_08HE1kw==/3385396303317256.jpg',
		lrc: "[00:04.050]↵[00:12.570]难以忘记初次见你↵[00:16.860]一双迷人的眼睛↵[00:21.460]在我脑海里↵[00:23.960]你的身影 挥散不去↵[00:30.160]握你的双手感觉你的温柔↵[00:34.940]真的有点透不过气↵[00:39.680]你的天真 我想珍惜↵[00:43.880]看到你受委屈 我会伤心↵[00:48.180]喔↵[00:50.340]只怕我自己会爱上你↵[00:55.070]不敢让自己靠的太近↵[00:59.550]怕我没什么能够给你↵[01:04.030]爱你也需要很大的勇气↵[01:08.190]只怕我自己会爱上你↵[01:12.910]也许有天会情不自禁↵[01:17.380]想念只让自己苦了自己↵[01:21.840]爱上你是我情非得已↵[01:28.810]难以忘记初次见你↵[01:33.170]一双迷人的眼睛↵[01:37.700]在我脑海里 你的身影 挥散不去↵[01:46.360]握你的双手感觉你的温柔↵[01:51.120]真的有点透不过气↵[01:55.910]你的天真 我想珍惜↵[02:00.150]看到你受委屈 我会伤心↵[02:04.490]喔↵[02:06.540]只怕我自己会爱上你↵[02:11.240]不敢让自己靠的太近↵[02:15.750]怕我没什么能够给你↵[02:20.200]爱你也需要很大的勇气↵[02:24.570]只怕我自己会爱上你↵[02:29.230]也许有天会情不自禁↵[02:33.680]想念只让自己苦了自己↵[02:38.140]爱上你是我情非得已↵[03:04.060]什么原因 耶↵[03:07.730]我竟然又会遇见你↵[03:13.020]我真的真的不愿意↵[03:16.630]就这样陷入爱的陷阱↵[03:20.700]喔↵[03:22.910]只怕我自己会爱上你↵[03:27.570]不敢让自己靠的太近↵[03:32.040]怕我没什么能够给你↵[03:36.560]爱你也需要很大的勇气↵[03:40.740]只怕我自己会爱上你↵[03:45.460]也许有天会情不自禁↵[03:49.990]想念只让自己苦了自己↵[03:54.510]爱上你是我情非得已↵[03:58.970]爱上你是我情非得已↵[04:03.000]↵"
    }]
});
//格式化数字
function formatNumber(num){
	if(num / 10000 >= 1 && num / 10000 < 10000){
		return Math.round(num / 10000) + "万";
	}else if(num / 100000000 >= 1){
		return (num / 100000000).toFixed(1) + "亿";
	}else{
		return num;
	}
}