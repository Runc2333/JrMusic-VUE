<!DOCTYPE html>
<html lang="zh">
	<head>
		<script src="/js/vue.js"></script>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1,user-scalable=0">
		<meta name="baidu_union_verify" content="75c4712c3944c70e859488396202bfc5">
		<meta name="author" content="Runc"/>
		<title>JrMusic - Powered by Vue.js</title>
		<link href="/css/font-awesome.min.css" rel="stylesheet" type="text/css" media="screen">
		<link href="/css/project/main.css?ver=<? echo time();?>" rel="stylesheet" type="text/css" media="screen">
	</head>
	<body>
		<div class="preloaderPreloader"></div>
		<div class="preloader"></div>
		<div id="app">
			<div class="backgroundColorBlock"></div>
			<!--topSearchBox-->
			<div class="topContainer">
				<input class="searchBox" :placeholder=searchDefault.showKeyword>
			</div>
			<!--banner-->
			<div class="sliderContainer">
				<div class="slider" :style="{width: bannerTotalWidth, gridTemplateColumns: 'repeat('+banners.length+', '+deviceWidth+')', left: sliderLeft, transition: sliderTransition}" @touchstart="scrollBannerStart($event)" @touchmove="scrollBannerMove($event)" @touchend="scrollBannerEnd($event)">
					<div class="carousel-item bannerContainer" v-for="banner in banners">
						<img :src=banner.src>
						<div class="bottomRightCornerLabel" :class=banner.titleColor>{{ banner.typeTitle }}</div>
					</div>
				</div>
				<div class="indicatorContainerGrid">
					<div class="indicatorContainer">
						<div class="indicator" v-for="banner in banners" :class="{active: banner.active}"></div>
					</div>
				</div>
			</div>
			<!--indexButtons-->
			<div class="buttonsContainer">
				<div class="buttonContainer" v-for="button in buttons">
					<div class="buttonIcon">
						<i aria-hidden="true" :class="button.icon" style="font-size: 24px;"></i>
					</div>
					<div class="buttonLabel">{{ button.label }}</div>
					<div class="buttonDate" v-if="button.date">{{ new Date().getDate() }}</div>
				</div>
			</div>
			<!--recommandPlaylists-->
			<div class="section">
				<div class="sectionTitleContainer">
					<div class="sectionSubtitle">{{ recommendPlaylists.subtitle }}</div>
					<div class="sectionTitle">{{ recommendPlaylists.title }}</div>
					<div class="sectionAction">查看更多</div>
				</div>
				<div class="playlistsContainerContainer">
					<div class="playlistsContainer" :style="{width: recommendPlaylists.playlists.length * 110 + 'px', gridTemplateColumns: '120px repeat('+(recommendPlaylists.playlists.length - 1)+', 110px)'}">
						<div class="playlist" v-for="playlist in recommendPlaylists.playlists">
							<div class="playlistCover">
								<img :src=playlist.cover>
								<div class="playlistPlayCount"><i aria-hidden="true" class="fal fa-play"></i>{{ playlist.playCount }}</div>
								<div class="playlistTitle">{{ playlist.title }}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!--recommandSongs-->
			<div class="section">
				<div class="sectionTitleContainer">
					<div class="sectionSubtitle">{{ recommendSongs.subtitle }}</div>
					<div class="sectionTitle">{{ recommendSongs.title }}</div>
					<div class="sectionAction"><i aria-hidden="true" class="fa fa-play"></i>播放全部</div>
				</div>
				<div class="songsContainer" :style="{width: songsTotalWidth, left: songsLeft, transition: songsTransition, gridTemplateColumns: 'repeat('+Math.ceil(recommendSongs.songs.length / 3)+', 335px)'}" @touchstart="scrollSongsStart($event)" @touchmove="scrollSongsMove($event)" @touchend="scrollSongsEnd($event)">
					<div class="song" v-for="song in recommendSongs.songs">
						<div class="songCover">
							<img :src=song.cover>
						</div>
						<div class="songTitle"><i class="songName">{{ song.title }} </i><i class="songArtist">- {{ song.artist }}</i></div>
						<div class="songReason"><i class="sqLabel" v-if="song.sq">SQ</i>{{ song.reason }}</div>
						<div class="songPlayButton"><i aria-hidden="true" class="fa fa-play"></i></div>
					</div>
				</div>
			</div>
			<!--bottomBar-->
			<div class="bottomBarContainer">
				<div class="bottomBarItem" v-for="item in bottomBarItems">
					<div class="bottomBarItemIcon" :class="{active: item.active}">
						<i aria-hidden="true" :class="item.icon"></i>
					</div>
					<div class="bottomBarItemLabel" :class="{active: item.active}">{{ item.label }}</div>
				</div>
			</div>
		</div>
		<div id="aplayer" style="display:none"></div>
		<script src="/js/jquery.min.js" type="text/javascript"></script>
		<script src="/js/aplayer.min.js" type="text/javascript"></script>
		<script src="/js/project/main.js?ver=<? echo time();?>" type="text/javascript"></script>
	</body>
</html>